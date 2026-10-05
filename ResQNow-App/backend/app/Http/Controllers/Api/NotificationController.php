<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user && $user->role === 'resident',
            403,
            'Your account does not have resident access.'
        );

        $notifications = DB::table('resqnow_notifications')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(100)
            ->get();

        $unreadCount = DB::table('resqnow_notifications')
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'data' => $notifications
                ->map(fn ($notification) => $this->serialize($notification))
                ->values(),
            'unreadCount' => $unreadCount,
        ]);
    }

    public function show(Request $request, int $notificationId): JsonResponse
    {
        $notification = $this->findForUser($request, $notificationId);

        return response()->json([
            'data' => $this->serialize($notification),
        ]);
    }

    public function markRead(Request $request, int $notificationId): JsonResponse
    {
        $notification = $this->findForUser($request, $notificationId);

        if (!$notification->read_at) {
            DB::table('resqnow_notifications')
                ->where('id', $notification->id)
                ->where('user_id', $request->user()->id)
                ->update([
                    'read_at' => now(),
                    'updated_at' => now(),
                ]);
        }

        $fresh = DB::table('resqnow_notifications')
            ->where('id', $notification->id)
            ->where('user_id', $request->user()->id)
            ->first();

        return response()->json([
            'data' => $this->serialize($fresh),
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user && $user->role === 'resident',
            403,
            'Your account does not have resident access.'
        );

        DB::table('resqnow_notifications')
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Notifications marked as read.',
            'unreadCount' => 0,
        ]);
    }

    private function findForUser(Request $request, int $notificationId): object
    {
        $user = $request->user();

        abort_unless(
            $user && $user->role === 'resident',
            403,
            'Your account does not have resident access.'
        );

        $notification = DB::table('resqnow_notifications')
            ->where('id', $notificationId)
            ->where('user_id', $user->id)
            ->first();

        abort_if(!$notification, 404, 'Notification not found.');

        return $notification;
    }

    private function serialize(object $notification): array
    {
        return [
            'id' => (int) $notification->id,
            'kind' => $notification->kind,
            'title' => $notification->title,
            'message' => $notification->message,
            'reportCode' => $notification->report_code,
            'announcementId' => $notification->announcement_id
                ? (int) $notification->announcement_id
                : null,
            'readAt' => $notification->read_at
                ? Carbon::parse($notification->read_at)->toIso8601String()
                : null,
            'createdAt' => Carbon::parse($notification->created_at)
                ->toIso8601String(),
        ];
    }
}
