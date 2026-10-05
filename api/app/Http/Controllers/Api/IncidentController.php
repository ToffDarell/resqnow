<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\AuditLog;
use App\Services\NotificationService;

class IncidentController extends Controller
{
    /**
     * Display all incidents.
     */
    public function index(): JsonResponse
    {
     $incidents = Incident::with(['report', 'personnel'])
    ->latest()
    ->get();

        return response()->json([
            'success' => true,
            'message' => 'Incidents retrieved successfully.',
            'data' => $incidents,
        ]);
    }

    /**
     * Create an official incident from a prioritized report.
     */
    public function storeFromReport(Report $report): JsonResponse
    {
        // Make sure the report has been prioritized first
        if ($report->status !== 'Prioritized' || empty($report->priority)) {
            return response()->json([
                'success' => false,
                'message' => 'Only prioritized reports can be converted into incidents.',
            ], 422);
        }

        // Prevent duplicate incidents from the same report
        $existingIncident = Incident::where('report_id', $report->id)->first();

        if ($existingIncident) {
            return response()->json([
                'success' => false,
                'message' => 'An incident already exists for this report.',
                'data' => $existingIncident,
            ], 409);
        }

        // Create the incident first
        $incident = Incident::create([
            'report_id' => $report->id,

            // Temporary code based on report ID
            'incident_code' => 'INC-' . str_pad(
                $report->id,
                4,
                '0',
                STR_PAD_LEFT
            ),

            'title' => $report->report_type,
            'type' => $report->report_type,
            'category' => $report->category,
            'description' => $report->description,

            'location' => $report->location,
            'latitude' => $report->latitude,
            'longitude' => $report->longitude,

            'priority' => $report->priority,

            'status' => 'Pending Response',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Incident created successfully from prioritized report.',
           'data' => $incident->load(['report', 'personnel']),
        ], 201);
    }

public function updateAssignment(
    Request $request,
    Incident $incident,
    NotificationService $notificationService
): JsonResponse {
    $validated = $request->validate([
        'assigned_personnel_id' => [
            'required',
            'exists:personnels,id',
        ],
    ]);

    $personnel = \App\Models\Personnel::find(
        $validated['assigned_personnel_id']
    );

    if (!$personnel) {
        return response()->json([
            'success' => false,
            'message' => 'Selected personnel was not found.',
        ], 404);
    }

    if ($personnel->status !== 'Active') {
        return response()->json([
            'success' => false,
            'message' => 'Selected personnel is not active.',
        ], 422);
    }

    if (
        $personnel->availability !== 'Available' &&
        $incident->assigned_personnel_id !== $personnel->id
    ) {
        return response()->json([
            'success' => false,
            'message' => 'Selected personnel is currently unavailable.',
        ], 422);
    }

    $previousPersonnelId = $incident->assigned_personnel_id;

    $incident->update([
        'assigned_personnel_id' => $personnel->id,
    ]);

    if (
        $previousPersonnelId &&
        $previousPersonnelId !== $personnel->id
    ) {
        $previousPersonnel = \App\Models\Personnel::find(
            $previousPersonnelId
        );

        if ($previousPersonnel) {
            $previousPersonnel->update([
                'availability' => 'Available',
                'assignment' => null,
            ]);
        }
    }

    $personnel->update([
        'availability' => 'Assigned',
        'assignment' => $incident->incident_code,
    ]);


    $admin = $request->user();

AuditLog::create([
    'action' => 'Incident Personnel Assigned',
    'category' => 'Incident',
    'target' => $incident->incident_code,
    'field' => 'assigned_personnel_id',
    'old_value' => $previousPersonnelId
        ? (string) $previousPersonnelId
        : null,
    'new_value' => (string) $personnel->id,
    'remarks' => "Personnel {$personnel->name} assigned to incident {$incident->incident_code}.",
    'user_name' => $admin?->name,
    'user_role' => $admin?->role,
    'status' => 'Success',
]);

$notificationService->notifyPersonnelAssignment(
    $incident,
    $personnel
);

\App\Support\ReportBridge::assigned(
    $incident->fresh()->load('report'),
    $personnel,
    $admin
);

    return response()->json([
        'success' => true,
        'message' => 'Personnel assigned to incident successfully.',
        'data' => $incident
            ->fresh()
            ->load(['report', 'personnel']),
    ]);
}

    /**
     * Display a specific incident.
     */
    public function show(Incident $incident): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Incident retrieved successfully.',
            'data' => $incident->load(['report', 'personnel']),
        ]);
    }

    /**
     * Update the response status of an incident.
     */
  public function updateStatus(
    Request $request,
    Incident $incident
): JsonResponse {
    $validated = $request->validate([
        'status' => [
            'required',
            'string',
            'in:Pending Response,Dispatched,In Progress,Resolved,Closed',
        ],
    ]);

    $currentStatus = $incident->status;
    $newStatus = $validated['status'];

    $allowedTransitions = [
        'Pending Response' => [
            'Dispatched',
        ],
        'Dispatched' => [
            'In Progress',
        ],
        'In Progress' => [
            'Resolved',
        ],
        'Resolved' => [
            'Closed',
        ],
        'Closed' => [],
    ];

    if (
        $currentStatus !== $newStatus &&
        !in_array(
            $newStatus,
            $allowedTransitions[$currentStatus] ?? [],
            true
        )
    ) {
        return response()->json([
            'success' => false,
            'message' => "Invalid incident status transition from {$currentStatus} to {$newStatus}.",
        ], 422);
    }

    $updates = [
        'status' => $newStatus,
    ];

    if (
        $newStatus === 'Dispatched' &&
        !$incident->dispatched_at
    ) {
        $updates['dispatched_at'] = now();
    }

    if (
        $newStatus === 'Resolved' &&
        !$incident->resolved_at
    ) {
        $updates['resolved_at'] = now();
    }

    $incident->update($updates);

    if ($newStatus === 'Closed' && $incident->assigned_personnel_id) {
    $personnel = \App\Models\Personnel::find(
        $incident->assigned_personnel_id
    );

    if ($personnel) {
        $personnel->update([
            'availability' => 'Available',
            'assignment' => null,
        ]);
    }
}

    $admin = $request->user();

    \App\Support\ReportBridge::incidentStatus(
        $incident->fresh()->load('report'),
        $admin
    );

    AuditLog::create([
        'action' => 'Incident Status Updated',
        'category' => 'Incident',
        'target' => $incident->incident_code,
        'field' => 'status',
        'old_value' => $currentStatus,
        'new_value' => $newStatus,
        'remarks' => "Incident {$incident->incident_code} status changed from {$currentStatus} to {$newStatus}.",
        'user_name' => $admin?->name,
        'user_role' => $admin?->role,
        'status' => 'Success',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Incident status updated successfully.',
        'data' => $incident
            ->fresh()
            ->load(['report', 'personnel']),
    ]);
}
}