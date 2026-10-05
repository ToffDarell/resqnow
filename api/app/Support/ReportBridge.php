<?php

namespace App\Support;

use App\Models\Incident;
use App\Models\Personnel;
use App\Models\Report;
use App\Models\ReportAssignment;
use App\Models\User;
use App\Services\ReportNotifications;

/**
 * Keeps the web-admin workflow (verification, triage, incidents, personnel)
 * and the mobile-app workflow (status history, assignments, notifications)
 * in step. Every method is a no-op for reports that did not come from the
 * mobile app (no report_code), so the web admin keeps working on its own.
 */
class ReportBridge
{
    /**
     * Append a history entry to a mobile report and tell the resident.
     */
    public static function record(
        Report $report,
        string $status,
        ?string $remarks = null,
        ?int $userId = null,
        ?string $activity = null
    ): void {
        if (! $report->report_code) {
            return;
        }

        $report->statusLogs()->create([
            'status' => $status,
            'activity' => $activity,
            'remarks' => $remarks,
            'changed_by_user_id' => $userId,
        ]);

        if ($report->user_id) {
            ReportNotifications::send(
                [$report->user_id],
                'report',
                $report->report_code . ': ' . ($activity ?? $status),
                $remarks ?? 'Open the report for its confirmed status and history.',
                $report->report_code
            );
        }
    }

    /**
     * Web admin assigned personnel to an incident. When that personnel has a
     * responder account, create the mobile assignment so it shows up in the
     * responder app.
     */
    public static function assigned(
        Incident $incident,
        Personnel $personnel,
        ?User $admin
    ): void {
        $report = $incident->report;

        if (! $report || ! $report->report_code) {
            return;
        }

        // Close assignments held by anyone else.
        $report->activeAssignments()
            ->when(
                $personnel->user_id,
                fn ($query) => $query->where('assigned_user_id', '!=', $personnel->user_id)
            )
            ->update(['unassigned_at' => now()]);

        if ($personnel->user_id) {
            $already = $report->activeAssignments()
                ->where('assigned_user_id', $personnel->user_id)
                ->exists();

            if (! $already) {
                ReportAssignment::create([
                    'report_id' => $report->id,
                    'assigned_user_id' => $personnel->user_id,
                    'assigned_by_user_id' => $admin?->id,
                    'assigned_at' => now(),
                ]);
            }

            ReportNotifications::send(
                [$personnel->user_id],
                'assignment',
                $report->report_code . ': New assignment',
                'You have been assigned to this incident.',
                $report->report_code
            );
        }

        if (! in_array($report->status, ['Resolved', 'Invalid', 'Cancelled'], true)) {
            $report->status = 'Assigned';
            $report->version = ((int) $report->version) + 1;
            $report->save();
        }

        self::record(
            $report,
            'Assigned',
            "Assigned to {$personnel->name}.",
            $admin?->id,
            'Personnel assigned'
        );
    }

    /**
     * Web admin moved an incident along; mirror it on the mobile report.
     */
    public static function incidentStatus(
        Incident $incident,
        ?User $admin
    ): void {
        $report = $incident->report;

        if (! $report || ! $report->report_code) {
            return;
        }

        $target = match ($incident->status) {
            'In Progress' => 'In Progress',
            'Resolved', 'Closed' => 'Resolved',
            default => null,
        };

        if (
            ! $target ||
            $report->status === $target ||
            in_array($report->status, ['Resolved', 'Invalid', 'Cancelled'], true)
        ) {
            return;
        }

        $report->status = $target;
        $report->version = ((int) $report->version) + 1;
        $report->save();

        self::record(
            $report,
            $target,
            null,
            $admin?->id,
            $target === 'Resolved' ? 'Report resolved' : 'Response started'
        );
    }

    /**
     * A responder acted in the mobile app; mirror it on the web-admin incident.
     */
    public static function syncIncident(Report $report): void
    {
        $incident = Incident::query()
            ->where('report_id', $report->id)
            ->first();

        if (! $incident) {
            return;
        }

        $status = match ($report->status) {
            'In Progress', 'Responders En Route', 'Responded' => 'In Progress',
            'Resolved' => 'Resolved',
            default => null,
        };

        if (! $status || $incident->status === $status || $incident->status === 'Closed') {
            return;
        }

        $updates = ['status' => $status];

        if ($status === 'Dispatched' && ! $incident->dispatched_at) {
            $updates['dispatched_at'] = now();
        }

        if ($status === 'Resolved' && ! $incident->resolved_at) {
            $updates['resolved_at'] = now();
        }

        $incident->update($updates);
    }
}
