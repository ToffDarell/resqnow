<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ResponderProfile;
use App\Support\ReportAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResponderOperationsController extends Controller
{
    private const TERMINAL_STATUSES = [
        'Resolved',
        'Invalid',
        'Cancelled',
    ];

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user && $user->role === 'responder',
            403,
            'Your account does not have responder access.'
        );

        $profile = $user->responderProfile()->first();

        $activeAssignmentCount = ReportAccess::forUser($user)
            ->whereNotIn('status', self::TERMINAL_STATUSES)
            ->count();

        $activeEmergencyQuery = Report::query()
            ->where('report_type', 'Emergency')
            ->whereNotIn('status', self::TERMINAL_STATUSES);

        $activeEmergencyCount = (clone $activeEmergencyQuery)->count();

        // Counts only. Exact locations remain hidden until assignment.
        $unassignedEmergencyCount = (clone $activeEmergencyQuery)
            ->whereDoesntHave('activeAssignments')
            ->count();

        return response()->json([
            'data' => [
                'isOnDuty' => (bool) ($profile?->is_on_duty ?? false),
                'responderRole' => $profile?->responder_role ?: 'Emergency Responder',
                'currentAsset' => $profile?->current_asset,
                'teamName' => $profile?->team_name,
                'lastDutyChangedAt' => $profile?->last_duty_changed_at?->toISOString(),
                'activeAssignmentCount' => $activeAssignmentCount,
                'awareness' => [
                    'activeEmergencyCount' => $activeEmergencyCount,
                    'unassignedEmergencyCount' => $unassignedEmergencyCount,
                    'locationAccess' => 'assigned-only',
                ],
            ],
        ])->header('Cache-Control', 'private, no-store');
    }

    public function updateDutyStatus(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user && $user->role === 'responder',
            403,
            'Your account does not have responder access.'
        );

        $validated = $request->validate([
            'isOnDuty' => ['required', 'boolean'],
        ]);

        $isOnDuty = (bool) $validated['isOnDuty'];

        if (! $isOnDuty) {
            $hasActiveMission = ReportAccess::forUser($user)
                ->whereNotIn('status', self::TERMINAL_STATUSES)
                ->exists();

            abort_if(
                $hasActiveMission,
                409,
                'Complete or reassign your active mission before going off duty.'
            );
        }

        $profile = DB::transaction(function () use ($user, $isOnDuty) {
            $profile = ResponderProfile::query()
                ->where('user_id', $user->id)
                ->lockForUpdate()
                ->first();

            if (! $profile) {
                $profile = new ResponderProfile([
                    'user_id' => $user->id,
                ]);
            }

            $profile->is_on_duty = $isOnDuty;
            $profile->last_duty_changed_at = now();
            $profile->save();

            return $profile;
        });

        return response()->json([
            'data' => [
                'isOnDuty' => (bool) $profile->is_on_duty,
                'responderRole' => $profile->responder_role ?: 'Emergency Responder',
                'currentAsset' => $profile->current_asset,
                'teamName' => $profile->team_name,
                'lastDutyChangedAt' => $profile->last_duty_changed_at?->toISOString(),
            ],
        ])->header('Cache-Control', 'private, no-store');
    }
}
