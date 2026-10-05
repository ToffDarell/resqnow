<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    private const ROLE_PERMISSIONS = [
        'admin' => [
            'dashboard.view',
            'reports.view',
            'reports.create',
            'reports.edit',
            'reports.delete',
            'verification.view',
            'verification.manage',
            'prioritization.view',
            'prioritization.manage',
            'map.view',
            'residents.view',
            'residents.manage',
            'personnel.view',
            'personnel.manage',
            'announcements.view',
            'announcements.create',
            'announcements.edit',
            'announcements.publish',
            'announcements.archive',
            'audit.view',
            'settings.view',
            'settings.manage',
        ],

        'personnel' => [
            'dashboard.view',
            'reports.view',
            'reports.create',
            'reports.edit',
            'verification.view',
            'verification.manage',
            'prioritization.view',
            'prioritization.manage',
            'map.view',
            'residents.view',
            'personnel.view',
            'announcements.view',
            'audit.view',
        ],

        'responder' => [
            'dashboard.view',
            'reports.view',
            'map.view',
        ],
    ];

    public function handle(
        Request $request,
        Closure $next,
        string ...$permissions
    ): Response {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $userPermissions = self::ROLE_PERMISSIONS[$user->role] ?? [];

        foreach ($permissions as $permission) {
            if (in_array($permission, $userPermissions, true)) {
                return $next($request);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'You do not have permission to perform this action.',
        ], 403);
    }
}