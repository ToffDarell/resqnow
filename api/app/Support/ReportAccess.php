<?php

namespace App\Support;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class ReportAccess
{
    /**
     * Relationships commonly needed when returning
     * an operational report to the frontend.
     */
    public const RELATIONS = [
        'user.profile',
        'statusLogs.changedBy',
        'activeAssignments.assignedUser',
        'attentionRequests.requestedBy',
        'attentionRequests.acknowledgedBy',
    ];

    /**
     * Build a report query scoped to the authenticated user.
     *
     * Resident:
     * - only reports they submitted
     *
     * Responder:
     * - only reports currently assigned to them
     *
     * Admin:
     * - all operational reports
     */
    public static function forUser(
        User $user
    ): Builder {
        $query =
            Report::query();

        return match ($user->role) {
            'resident' =>
                $query->where(
                    'user_id',
                    $user->id
                ),

            'responder' =>
                $query->whereHas(
                    'activeAssignments',
                    function (
                        Builder $assignment
                    ) use ($user) {
                        $assignment->where(
                            'assigned_user_id',
                            $user->id
                        );
                    }
                ),

            'admin' =>
                $query,

            default =>
                abort(
                    403,
                    'Your account cannot access reports.'
                ),
        };
    }
}
