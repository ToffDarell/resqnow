<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreSosReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Services\ReportNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SosReportController extends Controller
{
    private const TERMINAL_STATUSES = [
        'Resolved',
        'Invalid',
        'Cancelled',
    ];

    /**
     * Create or replay a one-swipe resident SOS.
     *
     * Identity comes only from the authenticated
     * Sanctum session. The client never supplies a
     * resident/user ID.
     */
    public function store(
        StoreSosReportRequest $request
    ): JsonResponse {
        $user = $request->user();
        $user->loadMissing('profile');

        $idempotencyHeader = trim((string) $request->header(
            'X-Idempotency-Key',
            ''
        ));

        $clientRequestId = $this->extractClientRequestId(
            $idempotencyHeader
        );

        if ($clientRequestId === null) {
            return response()->json([
                'message' =>
                    'A valid SOS idempotency key is required.',
                'errors' => [
                    'idempotencyKey' => [
                        'Send X-Idempotency-Key as sos-<uuid>.',
                    ],
                ],
            ], 422);
        }

        $data = $request->validated();
        $location = $data['location'] ?? null;

        /*
         * The fingerprint identifies the operation, not the GPS
         * sample. A retry after packet loss may capture slightly
         * different coordinates but must still replay the first SOS.
         */
        $requestFingerprint = hash(
            'sha256',
            'resident-sos-v1'
        );

        [$report, $result] = DB::transaction(
            function () use (
                $user,
                $clientRequestId,
                $requestFingerprint,
                $location
            ) {
                /*
                 * Serialize SOS creation per resident. This
                 * closes the race where two devices submit
                 * different keys at nearly the same time.
                 */
                DB::table('users')
                    ->where('id', $user->id)
                    ->lockForUpdate()
                    ->first();

                $sameRequest = Report::query()
                    ->where('user_id', $user->id)
                    ->where('client_request_id', $clientRequestId)
                    ->first();

                if ($sameRequest) {
                    if (
                        $sameRequest->request_fingerprint !== null
                        && $sameRequest->request_fingerprint !== $requestFingerprint
                    ) {
                        return [$sameRequest, 'conflict'];
                    }

                    return [$sameRequest, 'idempotent'];
                }

                /*
                 * A second independent SOS is not created while
                 * one SOS from this resident is still active.
                 */
                $activeSos = Report::query()
                    ->where('user_id', $user->id)
                    ->where('report_type', 'Emergency')
                    ->where('concern_code', 'sos')
                    ->whereNotIn('status', self::TERMINAL_STATUSES)
                    ->latest('id')
                    ->first();

                if ($activeSos) {
                    return [$activeSos, 'active'];
                }

                $profile = $user->profile;
                $hasGps = is_array($location)
                    && isset($location['latitude'], $location['longitude']);

                if ($hasGps) {
                    $latitude = $location['latitude'];
                    $longitude = $location['longitude'];
                    $locationSource = 'gps';
                    $locationAccuracy = $location['accuracy'] ?? null;
                    $locationCapturedAt = $location['capturedAt'] ?? now();
                    $locationText = 'Current GPS location (coordinates transmitted)';
                } else {
                    $latitude = $profile?->home_latitude;
                    $longitude = $profile?->home_longitude;
                    $locationSource = $profile?->address || ($latitude !== null && $longitude !== null)
                        ? 'saved'
                        : null;
                    $locationAccuracy = null;
                    $locationCapturedAt = null;
                    $locationText = $profile?->address
                        ?: 'Location unavailable - contact resident immediately';
                }

                $affectedIndividuals = array_values(array_filter([
                    $profile?->has_senior_citizen ? 'Senior Citizen' : null,
                    $profile?->has_child ? 'Child' : null,
                    $profile?->has_pwd ? 'PWD' : null,
                    $profile?->has_pregnant_person ? 'Pregnant Person' : null,
                ]));

                $report = Report::create([
                    'user_id' => $user->id,
                    'client_request_id' => $clientRequestId,
                    'request_fingerprint' => $requestFingerprint,
                    'report_code' => null,
                    'report_type' => 'Emergency',
                    'concern_code' => 'sos',
                    'concern_type' => 'SOS - Immediate Life Threat',
                    'subcategory' => null,
                    'status' => 'Submitted',
                    'priority' => 'High',
                    'reporting_for' => 'Myself',
                    'subject_name' => null,
                    'subject_contact' => null,
                    'relationship_note' => null,
                    'purok' => $profile?->purok,
                    'location' => $locationText,
                    'landmark' => null,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                    'location_source' => $locationSource,
                    'location_accuracy' => $locationAccuracy,
                    'location_captured_at' => $locationCapturedAt,
                    'description' =>
                        'One-swipe SOS submitted by the resident. Immediate triage and callback are required.',
                    'required_assistance' =>
                        'Immediate emergency response and dispatcher callback.',
                    'affected_individuals' => $affectedIndividuals,
                    'photo_path' => null,
                    'barangay_remarks' => null,
                    'invalid_reason' => null,
                    'resolved_remarks' => null,
                ]);

                $report->update([
                    'report_code' => sprintf(
                        'EM-%06d',
                        $report->id
                    ),
                ]);

                $report->statusLogs()->create([
                    'status' => 'Submitted',
                    'remarks' =>
                        'SOS triggered by resident. Immediate triage required.',
                    'changed_by_user_id' => $user->id,
                ]);

                return [$report, 'created'];
            }
        );

        if ($result === 'conflict') {
            return response()->json([
                'message' =>
                    'This SOS request key was already used with different data. Refresh the Home screen before retrying.',
            ], 409);
        }

        $report->load([
            'statusLogs',
            'activeAssignments.assignedUser',
        ]);

        if ($result === 'created') {
            /*
             * Future-compatible: when verified Admin accounts
             * exist, they receive an immediate in-app SOS alert.
             * With no Admin accounts yet, this safely does nothing.
             */
            ReportNotifications::send(
                ReportNotifications::admins(),
                'report',
                $report->report_code . ': Resident SOS',
                'A resident triggered SOS. Open the report for location and vulnerability details.',
                $report->report_code
            );
        }

        $messages = [
            'created' => 'SOS received by ResQNow.',
            'idempotent' => 'This SOS was already received by ResQNow.',
            'active' => 'An active SOS already exists for this resident.',
        ];

        return response()->json([
            'message' => $messages[$result] ?? 'SOS received.',
            'report' => new ReportResource($report),
            'idempotentReplay' => $result === 'idempotent',
            'activeRescue' => $result === 'active',
        ], $result === 'created' ? 201 : 200);
    }

    private function extractClientRequestId(
        string $header
    ): ?string {
        if (!str_starts_with($header, 'sos-')) {
            return null;
        }

        $uuid = substr($header, 4);

        return Str::isUuid($uuid)
            ? $uuid
            : null;
    }
}
