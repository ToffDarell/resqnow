<?php

namespace App\Http\Resources;

use App\Support\ReportWorkflow;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ReportResource extends JsonResource
{
    /**
     * Shared report structure used by
     * Resident, Responder, and later Admin.
     *
     * @return array<string, mixed>
     */
    public function toArray(
        Request $request
    ): array {
        return [
            // ============ IDENTIFIERS ============

            // Public code:
            // EM-000001 / NE-000001
            'id' =>
                $this->report_code,

            // Internal database ID.
            'databaseId' =>
                $this->id,

            // Used for stale-update protection.
            'version' =>
                (int) $this->version,


            // ============ REPORT ============

            'reportType' =>
                $this->report_type,

            'concernCode' =>
                $this->concern_code,

            'concernType' =>
                $this->concern_type,

            'subcategory' =>
                $this->subcategory,

            'status' =>
                $this->appStatus(),

            'priority' =>
                $this->priority,


            // ============ REPORTER / SUBJECT ============

            'reportingFor' =>
                $this->reporting_for,

            'reporter' =>
                $this->getReporter(),

            'subjectName' =>
                $this->subject_name,

            'subjectContact' =>
                $this->subject_contact,

            // Existing Resident compatibility.
            'victimName' =>
                $this->subject_name,

            'victimContact' =>
                $this->subject_contact,

            'relationshipNote' =>
                $this->relationship_note,


            // ============ LOCATION ============

            'purok' =>
                $this->purok,

            'location' =>
                $this->location,

            'landmark' =>
                $this->landmark,

            'latitude' =>
                $this->latitude !== null
                    ? (float) $this->latitude
                    : null,

            'longitude' =>
                $this->longitude !== null
                    ? (float) $this->longitude
                    : null,

            'locationSource' =>
                $this->location_source,

            'locationAccuracy' =>
                $this->location_accuracy !== null
                    ? (float) $this->location_accuracy
                    : null,

            'locationCapturedAt' =>
                $this->location_captured_at
                    ?->toISOString(),


            // ============ RESIDENT DETAILS ============

            'description' =>
                $this->description,

            'requiredAssistance' =>
                $this->required_assistance,

            'affectedIndividuals' =>
                $this->affected_individuals ?? [],

            // Assignment-scoped operational vulnerability context.
            'responderIntel' =>
                $this->getResponderIntel($request),


            // ============ RESIDENT EVIDENCE ============

            // Resident-submitted evidence. S3 URLs are temporary;
            // the configured public disk returns its public URL.
            'photoUrl' => $this->getPhotoUrl(),


            // ============ BARANGAY INFORMATION ============

            'barangayRemarks' =>
                $this->barangay_remarks,

            'invalidReason' =>
                $this->invalid_reason,

            'resolvedRemarks' =>
                $this->resolved_remarks,


            // ============ HISTORY ============

            'timeline' =>
                $this->buildTimeline(),

            'events' =>
                $this->getEvents(),

            'latestUpdate' =>
                $this->getLatestUpdateText(),


            // ============ ASSIGNMENT ============

            'assignedPersonnel' =>
                $this->getAssignedPersonnelText(),

            'assignedPersonnelList' =>
                $this->getAssignedPersonnelList(),


            // ============ SUPPORT / REVIEW ============

            'attentionRequests' =>
                $this->getAttentionRequests(),


            // ============ RESPONDER ACTIONS ============

            /*
             * Only authenticated responder accounts
             * receive permitted field actions.
             */
            'responderActions' =>
                $this->getResponderActions(
                    $request
                ),


            // ============ DISPLAY TIMES ============

            'submittedAt' =>
                $this->created_at
                    ? $this->created_at->format(
                        'Y-m-d h:i A'
                    )
                    : null,

            'updatedAt' =>
                $this->updated_at
                    ? $this->updated_at->format(
                        'Y-m-d h:i A'
                    )
                    : null,


            // ============ ISO TIMES ============

            'createdAt' =>
                $this->created_at
                    ?->toISOString(),

            'updatedAtIso' =>
                $this->updated_at
                    ?->toISOString(),
        ];
    }



    private function getPhotoUrl(): ?string
    {
        if (!$this->photo_path) {
            return null;
        }

        $diskName = $this->photo_disk
            ?: config('filesystems.report_evidence_disk', 'public');
        $disk = Storage::disk($diskName);

        if (config("filesystems.disks.{$diskName}.driver") === 's3') {
            return $disk->temporaryUrl(
                $this->photo_path,
                now()->addMinutes(30)
            );
        }

        return $disk->url($this->photo_path);
    }

    /**
     * Operational vulnerability context for assigned responders/admins only.
     * Boolean resident-profile flags are never converted into invented counts.
     */
    private function getResponderIntel(Request $request): ?array
    {
        $viewerRole = $request->user()?->role;

        if (! in_array($viewerRole, ['responder', 'admin'], true)) {
            return null;
        }

        $profile = (
            $this->relationLoaded('user') &&
            $this->user?->relationLoaded('profile')
        )
            ? $this->user->profile
            : null;

        $householdFlags = [];

        if ($profile?->has_senior_citizen) {
            $householdFlags[] = 'Senior citizen in household';
        }
        if ($profile?->has_child) {
            $householdFlags[] = 'Child in household';
        }
        if ($profile?->has_pwd) {
            $householdFlags[] = 'PWD in household';
        }
        if ($profile?->has_pregnant_person) {
            $householdFlags[] = 'Pregnant person in household';
        }

        return [
            'affectedIndividuals' => $this->affected_individuals ?? [],
            'householdFlags' => $householdFlags,
            'householdCount' => $profile?->household_count,
        ];
    }

    /**
     * Resident who submitted the report.
     */
    private function getReporter(): ?array
    {
        if (
            !$this->relationLoaded('user') ||
            !$this->user
        ) {
            return null;
        }

        $profile =
            $this->user->relationLoaded(
                'profile'
            )
                ? $this->user->profile
                : null;

        return [
            'id' =>
                $this->user->id,

            'fullName' =>
                $this->user->name,

            'email' =>
                $this->user->email,

            'contactNumber' =>
                $profile?->contact_number,
        ];
    }


    /**
     * Build lifecycle progress for the
     * existing Resident tracking screen.
     *
     * @return array<int, array<string, mixed>>
     */
    private function buildTimeline(): array
    {
        $workflow =
            $this->report_type ===
            'Emergency'
                ? [
                    'Submitted',
                    'Assigned',
                    'In Progress',
                    'Responders En Route',
                    'Responded',
                    'Resolved',
                ]
                : [
                    'Submitted',
                    'Pending Verification',
                    'Verified',
                    'Assigned',
                    'In Progress',
                    'Responded',
                    'Resolved',
                ];

        $logs =
            $this->relationLoaded(
                'statusLogs'
            )
                ? $this->statusLogs
                : collect();

        $timeline = [];

        foreach (
            $workflow as $status
        ) {
            $log =
                $logs
                    ->where(
                        'status',
                        $status
                    )
                    ->sortBy(
                        'created_at'
                    )
                    ->first();

            $timeline[] = [
                'status' =>
                    $status,

                'date' =>
                    $log?->created_at
                        ? $log
                            ->created_at
                            ->format(
                                'Y-m-d h:i A'
                            )
                        : null,

                'done' =>
                    $log !== null,
            ];
        }

        if (
            $this->status ===
            'Invalid'
        ) {
            $invalidLog =
                $logs
                    ->where(
                        'status',
                        'Invalid'
                    )
                    ->sortByDesc(
                        'created_at'
                    )
                    ->first();

            $timeline[] = [
                'status' =>
                    'Invalid',

                'date' =>
                    $invalidLog?->created_at
                        ? $invalidLog
                            ->created_at
                            ->format(
                                'Y-m-d h:i A'
                            )
                        : null,

                'done' =>
                    true,
            ];
        }

        if (
            $this->status ===
            'Cancelled'
        ) {
            // A cancelled report has no future lifecycle steps. Keep only
            // progression that really happened before the cancellation.
            $timeline = array_values(
                array_filter(
                    $timeline,
                    fn ($step) => $step['done']
                )
            );

            $cancelledLog =
                $logs
                    ->where(
                        'status',
                        'Cancelled'
                    )
                    ->sortByDesc(
                        'created_at'
                    )
                    ->first();

            $timeline[] = [
                'status' =>
                    'Cancelled',

                'date' =>
                    $cancelledLog?->created_at
                        ? $cancelledLog
                            ->created_at
                            ->format(
                                'Y-m-d h:i A'
                            )
                        : null,

                'done' =>
                    true,
            ];
        }

        return $timeline;
    }


    /**
     * Real saved report activity.
     *
     * @return array<int, array<string, mixed>>
     */
    private function getEvents(): array
    {
        if (
            !$this->relationLoaded(
                'statusLogs'
            )
        ) {
            return [];
        }

        return $this
            ->statusLogs
            ->map(
                function ($log) {
                    $actor =
                        $log->relationLoaded(
                            'changedBy'
                        )
                            ? $log->changedBy
                            : null;

                    return [
                        'id' =>
                            $log->id,

                        'status' =>
                            $log->status,

                        'activity' =>
                            $log->activity,

                        'remarks' =>
                            $log->remarks,

                        'checklist' =>
                            $log->checklist ?? [],

                        /*
                         * Field evidence remains protected.
                         * We will add its authorized endpoint
                         * when the Responder controller is ready.
                         */
                        'hasPhoto' =>
                            !empty(
                                $log->photo_path
                            ),

                        'photoUrl' =>
                            null,

                        'actor' =>
                            $actor
                                ? [
                                    'id' =>
                                        $actor->id,

                                    'fullName' =>
                                        $actor->name,

                                    'role' =>
                                        $actor->role,
                                ]
                                : null,

                        'createdAt' =>
                            $log->created_at
                                ?->toISOString(),
                    ];
                }
            )
            ->values()
            ->all();
    }


    /**
     * Most recent readable update.
     */
    private function getLatestUpdateText(): ?string
    {
        if (
            !$this->relationLoaded(
                'statusLogs'
            )
        ) {
            return null;
        }

        $latestLog =
            $this
                ->statusLogs
                ->sortByDesc('id')
                ->first();

        if (!$latestLog) {
            return null;
        }

        if ($latestLog->remarks) {
            return $latestLog->remarks;
        }

        if ($latestLog->activity) {
            return $latestLog->activity;
        }

        return match (
            $latestLog->status
        ) {
            'Submitted' =>
                'Your report has been submitted.',

            'Pending Verification' =>
                'Waiting for barangay verification.',

            'Verified' =>
                'Your report has been verified by barangay personnel.',

            'Assigned' =>
                'Personnel have been assigned to your report.',

            'In Progress' =>
                'Response work has started.',

            'Responders En Route' =>
                'Assigned responders recorded that they are en route.',

            'Responded' =>
                'Barangay personnel recorded a response to the incident.',

            'Resolved' =>
                'This report has been resolved.',

            'Invalid' =>
                'This report has been marked invalid.',

            'Cancelled' =>
                'This report was cancelled by the resident.',

            default =>
                'Your report status has been updated.',
        };
    }


    /**
     * Existing Resident-compatible assignment text.
     */
    private function getAssignedPersonnelText(): ?string
    {
        if (
            !$this->relationLoaded(
                'activeAssignments'
            )
        ) {
            return null;
        }

        $names =
            $this
                ->activeAssignments
                ->map(
                    fn ($assignment) =>
                        $assignment
                            ->assignedUser
                            ?->name
                )
                ->filter()
                ->values();

        if ($names->isEmpty()) {
            return null;
        }

        return $names->implode(', ');
    }


    /**
     * Structured active assignment data.
     *
     * @return array<int, array<string, mixed>>
     */
    private function getAssignedPersonnelList(): array
    {
        if (
            !$this->relationLoaded(
                'activeAssignments'
            )
        ) {
            return [];
        }

        return $this
            ->activeAssignments
            ->filter(
                fn ($assignment) =>
                    $assignment
                        ->assignedUser !==
                    null
            )
            ->map(
                fn ($assignment) => [
                    'assignmentId' =>
                        $assignment->id,

                    'id' =>
                        $assignment
                            ->assignedUser
                            ->id,

                    'fullName' =>
                        $assignment
                            ->assignedUser
                            ->name,

                    'role' =>
                        $assignment
                            ->assignedUser
                            ->role,

                    'assignedAt' =>
                        $assignment
                            ->assigned_at
                            ?->toISOString(),

                    'acknowledged' =>
                        $assignment
                            ->acknowledged_at !==
                        null,

                    'acknowledgedAt' =>
                        $assignment
                            ->acknowledged_at
                            ?->toISOString(),

                    'notes' =>
                        $assignment->notes,
                ]
            )
            ->values()
            ->all();
    }


    /**
     * Saved support / location / review requests.
     *
     * @return array<int, array<string, mixed>>
     */
    private function getAttentionRequests(): array
    {
        if (
            !$this->relationLoaded(
                'attentionRequests'
            )
        ) {
            return [];
        }

        return $this
            ->attentionRequests
            ->map(
                function ($attention) {
                    $requestedBy =
                        $attention->relationLoaded(
                            'requestedBy'
                        )
                            ? $attention
                                ->requestedBy
                            : null;

                    $acknowledgedBy =
                        $attention->relationLoaded(
                            'acknowledgedBy'
                        )
                            ? $attention
                                ->acknowledgedBy
                            : null;

                    return [
                        'id' =>
                            $attention->id,

                        'kind' =>
                            $attention->kind,

                        'response' =>
                            $attention->response,

                        'acknowledged' =>
                            $attention
                                ->acknowledged_at !==
                            null,

                        'acknowledgedAt' =>
                            $attention
                                ->acknowledged_at
                                ?->toISOString(),

                        'requestedBy' =>
                            $requestedBy
                                ? [
                                    'id' =>
                                        $requestedBy->id,

                                    'fullName' =>
                                        $requestedBy->name,

                                    'role' =>
                                        $requestedBy->role,
                                ]
                                : null,

                        'acknowledgedBy' =>
                            $acknowledgedBy
                                ? [
                                    'id' =>
                                        $acknowledgedBy->id,

                                    'fullName' =>
                                        $acknowledgedBy->name,

                                    'role' =>
                                        $acknowledgedBy->role,
                                ]
                                : null,

                        'createdAt' =>
                            $attention
                                ->created_at
                                ?->toISOString(),
                    ];
                }
            )
            ->values()
            ->all();
    }


    /**
     * Server-authorized field actions
     * for the authenticated Responder.
     *
     * @return array<int, array<string, string>>
     */
    private function getResponderActions(
        Request $request
    ): array {
        $user =
            $request->user();

        if (
            !$user ||
            $user->role !==
            'responder'
        ) {
            return [];
        }

        return ReportWorkflow::actionsFor(
            $this->resource,
            $user->id
        );
    }
}
