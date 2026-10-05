<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CancelReportRequest;
use App\Http\Requests\Api\StoreEmergencyReportRequest;
use App\Http\Requests\Api\StoreNonEmergencyReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Services\ReportNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ReportController extends Controller
{
    /**
     * Emergency concern codes and their
     * canonical resident-facing labels.
     */
    private const EMERGENCY_CONCERNS = [
        'life-death' => 'Life and Death Emergency',
        'fire' => 'Fire Emergency',
        'medical' => 'Medical Emergency',
        'violence' => 'Public Safety / Violence',
        'flood' => 'Flood Rescue Needed',
        'accident' => 'Road Accident',
        'evacuation' => 'Immediate Evacuation',
    ];

    /**
     * Non-emergency concern codes and their
     * canonical resident-facing labels.
     */
    private const NON_EMERGENCY_CONCERNS = [
        'evac-assistance' => 'Evacuation Preparation',
        'bhw-assistance' => 'Barangay Health Worker Assistance',
        'road-obstruction' => 'Road Obstruction',
        'damaged-facility' => 'Damaged Facility',
        'cleanup' => 'Clean-up Assistance',
        'community-concern' => 'Community Concern',
        'other-assistance' => 'Other Assistance',
    ];

    /**
     * Default priority rules for Non-Emergency reports.
     *
     * These are only the initial priorities assigned
     * by the system. Barangay/Admin personnel may
     * override them later after reviewing the report.
     *
     * Assignment remains a separate action.
     */
    private const NON_EMERGENCY_PRIORITIES = [
        'evac-assistance' => 'Medium',
        'bhw-assistance' => 'Medium',
        'road-obstruction' => 'Medium',

        'damaged-facility' => 'Low',
        'cleanup' => 'Low',
        'community-concern' => 'Low',
        'other-assistance' => 'Low',
    ];


    /**
     * Resident cancellation is available while assistance is still
     * pending or in progress. Once an on-scene response is recorded,
     * the incident should be completed by the responder workflow.
     */
    private const CANCELLABLE_STATUSES = [
        'Submitted',
        'Pending Verification',
        'Verified',
        'Assigned',
        'In Progress',
        'Responders En Route',
    ];

    /**
     * Canonical human-readable resident cancellation reasons.
     */
    private const CANCELLATION_REASONS = [
        'safe_now' => 'Resident is safe now',
        'accidental' => 'Submitted by mistake / accidental SOS',
        'help_elsewhere' => 'Help arrived from another source',
        'duplicate' => 'Duplicate report',
        'issue_resolved' => 'Issue already resolved',
        'no_longer_needed' => 'Assistance is no longer needed',
        'other' => 'Other reason',
    ];

    /**
     * Get all reports belonging to
     * the currently authenticated resident.
     */
    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $reports = Report::query()
            ->where(
                'user_id',
                $request->user()->id
            )
            ->with([
                'statusLogs',
                'activeAssignments.assignedUser',
            ])
            ->latest()
            ->get();

        return ReportResource::collection(
            $reports
        );
    }

    /**
     * Get one report belonging to
     * the currently authenticated resident.
     */
    public function show(
        Request $request,
        string $reportCode
    ): ReportResource {
        $report = Report::query()
            ->where(
                'user_id',
                $request->user()->id
            )
            ->where(
                'report_code',
                $reportCode
            )
            ->with([
                'statusLogs',
                'activeAssignments.assignedUser',
            ])
            ->firstOrFail();

        return new ReportResource(
            $report
        );
    }


    /**
     * Cancel one resident-owned report.
     *
     * This endpoint is shared by Emergency, Non-Emergency, and SOS
     * reports. Identity and ownership come from Sanctum, never from a
     * resident ID submitted by the browser.
     */
    public function cancel(
        CancelReportRequest $request,
        string $reportCode
    ): JsonResponse {
        $data = $request->validated();
        $user = $request->user();

        $report = DB::transaction(
            function () use (
                $data,
                $user,
                $reportCode
            ) {
                $report = Report::query()
                    ->where('user_id', $user->id)
                    ->where('report_code', $reportCode)
                    ->lockForUpdate()
                    ->firstOrFail();

                // Repeated requests against an already-cancelled report are
                // treated as idempotent reads rather than creating more logs.
                if ($report->status === 'Cancelled') {
                    return $report;
                }

                abort_if(
                    (int) $report->version !== (int) $data['expectedVersion'],
                    409,
                    'This report changed since it was loaded. Refresh it before cancelling.'
                );

                abort_unless(
                    in_array(
                        $report->status,
                        self::CANCELLABLE_STATUSES,
                        true
                    ),
                    409,
                    'This report can no longer be cancelled because its response is already complete or closed.'
                );

                // Capture responder recipients before active assignments are
                // closed so they can still be notified of the cancellation.
                $activeAssignments = $report
                    ->activeAssignments()
                    ->lockForUpdate()
                    ->get();

                $responderIds = $activeAssignments
                    ->pluck('assigned_user_id')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();

                $cancelledAt = now();

                foreach ($activeAssignments as $assignment) {
                    $assignment->forceFill([
                        'unassigned_at' => $cancelledAt,
                    ])->save();
                }

                $reasonLabel = self::CANCELLATION_REASONS[
                    $data['reason']
                ];

                $extraRemarks = trim(
                    (string) ($data['remarks'] ?? '')
                );

                $remarks = 'Cancellation reason: ' . $reasonLabel . '.';

                if ($extraRemarks !== '') {
                    $remarks .= ' Resident note: ' . $extraRemarks;
                }

                $isSos = $report->concern_code === 'sos';

                $report->status = 'Cancelled';
                $report->version = ((int) $report->version) + 1;
                $report->save();

                $report->statusLogs()->create([
                    'status' => 'Cancelled',
                    'activity' => $isSos
                        ? 'Resident cancelled SOS rescue'
                        : 'Resident cancelled report',
                    'remarks' => $remarks,
                    'changed_by_user_id' => $user->id,
                ]);

                // Keep the resident's bell/history consistent with the saved
                // cancellation even though they performed the action.
                ReportNotifications::send(
                    [$user->id],
                    'report',
                    $report->report_code . ': Report cancelled',
                    $isSos
                        ? 'Your SOS rescue was cancelled. Open the report for the confirmed history.'
                        : 'Your report was cancelled. Open it for the confirmed history.',
                    $report->report_code
                );

                $staffRecipients = array_values(
                    array_unique(
                        array_merge(
                            $responderIds,
                            ReportNotifications::admins()
                        )
                    )
                );

                if ($staffRecipients !== []) {
                    ReportNotifications::send(
                        $staffRecipients,
                        'report',
                        $report->report_code . ': Resident cancelled report',
                        $reasonLabel . '.',
                        $report->report_code
                    );
                }

                return $report;
            }
        );

        $report->refresh();
        $report->load([
            'user.profile',
            'statusLogs.changedBy',
            'activeAssignments.assignedUser',
        ]);

        return response()->json([
            'message' => 'Report cancelled successfully.',
            'report' => new ReportResource($report),
        ]);
    }

    /**
     * Submit an Emergency report.
     */
    public function storeEmergency(
        StoreEmergencyReportRequest $request
    ): JsonResponse {
        $data = $request->validated();

        $report = DB::transaction(
            function () use (
                $request,
                $data
            ) {
                /**
                 * Create the database record first.
                 *
                 * report_code starts as null because
                 * we need the auto-generated database
                 * ID before we can create EM-000001.
                 */
                $report = Report::create([
                    'user_id' =>
                        $request->user()->id,

                    'report_code' =>
                        null,

                    'report_type' =>
                        'Emergency',

                    'concern_code' =>
                        $data['concernCode'],

                    'concern_type' =>
                        self::EMERGENCY_CONCERNS[
                            $data['concernCode']
                        ],

                    'subcategory' =>
                        null,

                    /**
                     * Emergency reports are saved
                     * immediately as Submitted.
                     */
                    'status' =>
                        'Submitted',

                    /**
                     * All currently supported Emergency
                     * categories begin as High priority.
                     *
                     * Priority does NOT automatically
                     * assign a responder.
                     */
                    'priority' =>
                        'High',

                    'reporting_for' =>
                        ! empty(
                            $data[
                                'reportingForOther'
                            ]
                        )
                            ? 'Another Person'
                            : 'Myself',

                    'subject_name' =>
                        $data[
                            'subjectName'
                        ] ?? null,

                    'subject_contact' =>
                        $data[
                            'subjectContact'
                        ] ?? null,

                    'relationship_note' =>
                        null,

                    'purok' =>
                        null,

                    'location' =>
                        $data['location'],

                    'landmark' =>
                        $data[
                            'landmark'
                        ] ?? null,

                    /**
                     * Optional incident coordinates.
                     *
                     * These can remain null when the
                     * resident submits an address only.
                     */
                    'latitude' =>
                        $data[
                            'latitude'
                        ] ?? null,

                    'longitude' =>
                        $data[
                            'longitude'
                        ] ?? null,

                    'location_source' =>
                        $data[
                            'locationSource'
                        ] ?? null,

                    'location_accuracy' =>
                        $data[
                            'locationAccuracy'
                        ] ?? null,

                    'location_captured_at' =>
                        $data[
                            'locationCapturedAt'
                        ] ?? null,

                    'description' =>
                        $data[
                            'description'
                        ] ?? null,

                    'required_assistance' =>
                        null,

                    'affected_individuals' =>
                        null,

                    'photo_path' =>
                        null,

                    'barangay_remarks' =>
                        null,

                    'invalid_reason' =>
                        null,

                    'resolved_remarks' =>
                        null,
                ]);

                /**
                 * Generate the resident-facing
                 * Emergency report code.
                 *
                 * Example:
                 * database ID 1 → EM-000001
                 */
                $report->update([
                    'report_code' =>
                        sprintf(
                            'EM-%06d',
                            $report->id
                        ),
                ]);

                /**
                 * Store the first timeline event.
                 */
                $report
                    ->statusLogs()
                    ->create([
                        'status' =>
                            'Submitted',

                        'remarks' =>
                            'Emergency report submitted by resident.',

                        'changed_by_user_id' =>
                            $request->user()->id,
                    ]);

                return $report;
            }
        );

        /**
         * Load the relationships required by
         * ReportResource before returning data.
         */
        $report->load([
            'statusLogs',
            'activeAssignments.assignedUser',
        ]);

        return response()->json([
            'message' =>
                'Emergency report submitted successfully.',

            'report' =>
                new ReportResource(
                    $report
                ),
        ], 201);
    }

    /**
     * Submit a Non-Emergency report.
     */
    public function storeNonEmergency(
        StoreNonEmergencyReportRequest $request
    ): JsonResponse {
        $data =
            $request->validated();

        $photoPath = null;

        try {
            /**
             * Save optional resident photo evidence.
             *
             * Validation of type and size happens
             * inside StoreNonEmergencyReportRequest.
             */
            if (
                $request->hasFile('photo')
            ) {
                $photoPath =
                    $request
                        ->file('photo')
                        ->store(
                            'reports',
                            'public'
                        );
            }

            $report = DB::transaction(
                function () use (
                    $request,
                    $data,
                    $photoPath
                ) {
                    /**
                     * Priority is calculated by Laravel,
                     * not by the React frontend.
                     */
                    $priority =
                        self::NON_EMERGENCY_PRIORITIES[
                            $data['concernCode']
                        ];

                    $report =
                        Report::create([
                            'user_id' =>
                                $request
                                    ->user()
                                    ->id,

                            'report_code' =>
                                null,

                            'report_type' =>
                                'Non-Emergency',

                            'concern_code' =>
                                $data[
                                    'concernCode'
                                ],

                            'concern_type' =>
                                self::NON_EMERGENCY_CONCERNS[
                                    $data[
                                        'concernCode'
                                    ]
                                ],

                            'subcategory' =>
                                $data[
                                    'subcategory'
                                ] ?? null,

                            /**
                             * Non-Emergency reports
                             * must be reviewed first.
                             */
                            'status' =>
                                'Pending Verification',

                            /**
                             * Category-based priority:
                             *
                             * Medium:
                             * - Evacuation Assistance
                             * - BHW Assistance
                             * - Road Obstruction
                             *
                             * Low:
                             * - Damaged Facility
                             * - Cleanup
                             * - Community Concern
                             * - Other Assistance
                             */
                            'priority' =>
                                $priority,

                            'reporting_for' =>
                                $data[
                                    'reportingFor'
                                ],

                            'subject_name' =>
                                $data[
                                    'subjectName'
                                ] ?? null,

                            'subject_contact' =>
                                $data[
                                    'subjectContact'
                                ] ?? null,

                            'relationship_note' =>
                                $data[
                                    'relationshipNote'
                                ] ?? null,

                            'purok' =>
                                $data[
                                    'purok'
                                ],

                            'location' =>
                                $data[
                                    'location'
                                ],

                            'landmark' =>
                                $data[
                                    'landmark'
                                ] ?? null,

                            /**
                             * Coordinates remain optional.
                             */
                            'latitude' =>
                                $data[
                                    'latitude'
                                ] ?? null,

                            'longitude' =>
                                $data[
                                    'longitude'
                                ] ?? null,

                            'description' =>
                                $data[
                                    'description'
                                ],

                            'required_assistance' =>
                                $data[
                                    'requiredAssistance'
                                ] ?? null,

                            'affected_individuals' =>
                                $data[
                                    'affectedIndividuals'
                                ] ?? [],

                            'photo_path' =>
                                $photoPath,

                            'barangay_remarks' =>
                                null,

                            'invalid_reason' =>
                                null,

                            'resolved_remarks' =>
                                null,
                        ]);

                    /**
                     * Generate the resident-facing
                     * Non-Emergency code.
                     *
                     * Example:
                     * database ID 2 → NE-000002
                     */
                    $report->update([
                        'report_code' =>
                            sprintf(
                                'NE-%06d',
                                $report->id
                            ),
                    ]);

                    /**
                     * Resident submitted the report.
                     */
                    $report
                        ->statusLogs()
                        ->create([
                            'status' =>
                                'Submitted',

                            'remarks' =>
                                'Non-emergency report submitted by resident.',

                            'changed_by_user_id' =>
                                $request
                                    ->user()
                                    ->id,
                        ]);

                    /**
                     * The report then enters the
                     * barangay verification queue.
                     */
                    $report
                        ->statusLogs()
                        ->create([
                            'status' =>
                                'Pending Verification',

                            'remarks' =>
                                'Waiting for barangay verification.',

                            'changed_by_user_id' =>
                                null,
                        ]);

                    return $report;
                }
            );
        } catch (Throwable $exception) {
            /**
             * If the photo was stored successfully
             * but the DB transaction later fails,
             * remove the abandoned file.
             */
            if ($photoPath) {
                Storage::disk(
                    'public'
                )->delete(
                    $photoPath
                );
            }

            throw $exception;
        }

        /**
         * Load relationships needed by
         * ReportResource.
         */
        $report->load([
            'statusLogs',
            'activeAssignments.assignedUser',
        ]);

        return response()->json([
            'message' =>
                'Non-emergency report submitted successfully.',

            'report' =>
                new ReportResource(
                    $report
                ),
        ], 201);
    }
}
