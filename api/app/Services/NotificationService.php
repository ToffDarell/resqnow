<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Report;
use App\Models\SystemSetting;
use App\Models\User;
use App\Models\Incident;
use App\Models\Personnel;
use App\Models\Announcement;

class NotificationService
{
    /**
     * Create a notification for a specific user.
     */
    public function create(
        int $targetUserId,
        string $type,
        string $title,
        string $message
    ): Notification {
        return Notification::create([
            'target_user_id' => $targetUserId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'is_read' => false,
        ]);
    }

    /**
 * Create a notification when an announcement is published.
 */
public function notifyAnnouncementPublished(
    Announcement $announcement
): void {
    $settings = SystemSetting::firstOrCreate([]);

    if (
        ! $settings->notifications ||
        ! $settings->announcement_alerts
    ) {
        return;
    }

    $this->notifyActiveAdmins(
        'announcement_published',
        'Announcement Published',
        "Announcement \"{$announcement->title}\" has been published."
    );
}

    /**
     * Send a notification to all active admin users.
     */
    public function notifyActiveAdmins(
        string $type,
        string $title,
        string $message
    ): void {
        $admins = User::where('role', 'admin')
            ->where('status', 'active')
            ->get();

        foreach ($admins as $admin) {
            $this->create(
                $admin->id,
                $type,
                $title,
                $message
            );
        }
    }

    /**
     * Create a notification when a report receives Critical priority.
     */
    public function notifyCriticalReport(Report $report): void
    {
        $settings = SystemSetting::firstOrCreate([]);

        if (
            ! $settings->notifications ||
            ! $settings->critical_alerts
        ) {
            return;
        }

        $this->notifyActiveAdmins(
            'critical_report',
            'Critical Report',
            'Report #' . $report->id . ' has been assigned Critical priority.'
        );
    
    }

    /**
 * Create a notification when personnel is assigned to an incident.
 */
public function notifyPersonnelAssignment(
    Incident $incident,
    Personnel $personnel
): void {
    $settings = SystemSetting::firstOrCreate([]);

    if (
        ! $settings->notifications ||
        ! $settings->assignment_alerts
    ) {
        return;
    }

    $this->notifyActiveAdmins(
        'personnel_assignment',
        'Personnel Assigned',
        "Personnel {$personnel->name} has been assigned to incident {$incident->incident_code}."
    );
}
}