<?php

namespace App\Services;

use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReportNotifications
{
    /**
     * Store in-app notification records.
     *
     * This does not imply SMS, push notification,
     * or external message delivery.
     */
    public static function send(
        iterable $userIds,
        string $kind,
        string $title,
        string $message,
        ?string $code = null,
        ?int $announcementId = null
    ): void {
        $ids = is_array($userIds)
            ? $userIds
            : iterator_to_array($userIds);

        foreach (array_unique($ids) as $userId) {
            DB::table('resqnow_notifications')
                ->insert([
                    'user_id' =>
                        $userId,

                    'kind' =>
                        $kind,

                    'title' =>
                        $title,

                    'message' =>
                        $message,

                    'report_code' =>
                        $code,

                    'announcement_id' =>
                        $announcementId,

                    'created_at' =>
                        now(),

                    'updated_at' =>
                        now(),
                ]);
        }
    }

    /**
     * IDs of verified Admin accounts.
     *
     * @return array<int, int>
     */
    public static function admins(): array
    {
        return User::query()
            ->where(
                'role',
                'admin'
            )
            ->where(
                'account_status',
                'Verified'
            )
            ->pluck('id')
            ->all();
    }

    /**
     * Record a report-progress notification
     * for other involved users.
     */
    public static function progress(
        Report $report,
        string $activity,
        int $actorId
    ): void {
        $recipients = array_merge(
            [
                $report->user_id,
            ],
            self::admins(),
            $report
                ->activeAssignments()
                ->pluck(
                    'assigned_user_id'
                )
                ->all()
        );

        /*
         * Do not notify the person who performed
         * the action themselves.
         */
        $recipients = array_values(
            array_diff(
                $recipients,
                [
                    $actorId,
                ]
            )
        );

        self::send(
            $recipients,
            'report',
            $report->report_code .
                ': ' .
                $activity,
            'Open the report for its confirmed status and history.',
            $report->report_code
        );
    }
}
