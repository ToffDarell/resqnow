<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    /**
     * Get all registered residents.
     */
    public function index(): JsonResponse
    {
        $residents = User::where('role', 'resident')
            ->withCount('reports')
            ->orderByDesc('created_at')
            ->get([
                'id',
                'name',
                'email',
                'role',
                'status',
                'verification_status',
                'verification_remarks',
                'verified_at',
                'created_at',
                'updated_at',
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Residents retrieved successfully.',
            'data' => $residents,
        ]);
    }

    /**
     * Approve or reject a resident account.
     */
    public function updateVerification(
        Request $request,
        User $user
    ): JsonResponse {
        // Make sure this endpoint can only modify resident accounts.
        if ($user->role !== 'resident') {
            return response()->json([
                'success' => false,
                'message' => 'Only resident accounts can be verified.',
            ], 422);
        }

        $validated = $request->validate([
            'verification_status' => [
                'required',
                'in:Verified,Rejected',
            ],
            'verification_remarks' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $oldVerificationStatus = $user->verification_status;
        $oldVerificationRemarks = $user->verification_remarks;
        $oldStatus = $user->status;

        $verificationStatus = $validated['verification_status'];

        $user->verification_status = $verificationStatus;
        $user->verification_remarks =
            $validated['verification_remarks'] ?? null;

        if ($verificationStatus === 'Verified') {
            $user->status = 'active';
            $user->verified_at = now();
        } else {
            $user->status = 'inactive';
            $user->verified_at = null;
        }

        $user->save();

        $admin = $request->user();

        // Log verification status change.
        AuditLog::create([
            'action' => 'Resident Verification Updated',
            'category' => 'Resident',
            'target' => "Resident #{$user->id}",
            'field' => 'verification_status',
            'old_value' => $oldVerificationStatus,
            'new_value' => $verificationStatus,
            'remarks' => $user->verification_remarks,
            'user_name' => $admin?->name,
            'user_role' => $admin?->role,
            'status' => 'Success',
        ]);

        // Log remarks separately when they changed.
        if ($oldVerificationRemarks !== $user->verification_remarks) {
            AuditLog::create([
                'action' => 'Resident Verification Remarks Updated',
                'category' => 'Resident',
                'target' => "Resident #{$user->id}",
                'field' => 'verification_remarks',
                'old_value' => $oldVerificationRemarks,
                'new_value' => $user->verification_remarks,
                'remarks' => 'Resident verification remarks updated.',
                'user_name' => $admin?->name,
                'user_role' => $admin?->role,
                'status' => 'Success',
            ]);
        }

        // Log account status change when applicable.
        if ($oldStatus !== $user->status) {
            AuditLog::create([
                'action' => 'Resident Account Status Updated',
                'category' => 'Resident',
                'target' => "Resident #{$user->id}",
                'field' => 'status',
                'old_value' => $oldStatus,
                'new_value' => $user->status,
                'remarks' => $verificationStatus === 'Verified'
                    ? 'Resident account activated after verification.'
                    : 'Resident account deactivated after rejection.',
                'user_name' => $admin?->name,
                'user_role' => $admin?->role,
                'status' => 'Success',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => $verificationStatus === 'Verified'
                ? 'Resident account verified successfully.'
                : 'Resident account rejected successfully.',
            'data' => $user->fresh(),
        ]);
    }
}