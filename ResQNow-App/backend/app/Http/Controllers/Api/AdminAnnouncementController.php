<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Services\ReportNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Announcement::query()
                ->orderByDesc('published_at')
                ->orderByDesc('id')
                ->limit(100)
                ->get()
                ->map(fn (Announcement $announcement) => $this->serialize($announcement))
                ->values(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatePayload($request);

        $announcement = DB::transaction(function () use ($request, $data) {
            $announcement = Announcement::create([
                'title' => $data['title'],
                'body' => $data['body'],
                'category' => $data['category'],
                'affected_puroks' => $data['affectedPuroks'] ?? null,
                'expires_at' => $data['expiresAt'] ?? null,
                'is_active' => $data['isActive'] ?? true,
                'published_by' => $request->user()->id,
                'published_at' => now(),
            ]);

            if ($announcement->is_active) {
                $this->notifyResidents($announcement);
            }

            return $announcement;
        });

        return response()->json([
            'message' => 'Announcement published.',
            'data' => $this->serialize($announcement),
        ], 201);
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $data = $this->validatePayload($request, true);

        DB::transaction(function () use ($announcement, $data) {
            $announcement->fill([
                'title' => $data['title'] ?? $announcement->title,
                'body' => $data['body'] ?? $announcement->body,
                'category' => $data['category'] ?? $announcement->category,
                'affected_puroks' => array_key_exists('affectedPuroks', $data)
                    ? $data['affectedPuroks']
                    : $announcement->affected_puroks,
                'expires_at' => array_key_exists('expiresAt', $data)
                    ? $data['expiresAt']
                    : $announcement->expires_at,
                'is_active' => array_key_exists('isActive', $data)
                    ? $data['isActive']
                    : $announcement->is_active,
            ]);

            $announcement->save();

            if (! empty($data['republish']) && $announcement->is_active) {
                $this->notifyResidents($announcement);
            }
        });

        return response()->json([
            'message' => 'Announcement updated.',
            'data' => $this->serialize($announcement->fresh()),
        ]);
    }

    private function validatePayload(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:160'],
            'body' => [$required, 'string', 'max:5000'],
            'category' => [$required, 'in:critical,advisory,general'],
            'affectedPuroks' => ['sometimes', 'nullable', 'array', 'max:30'],
            'affectedPuroks.*' => ['string', 'max:80'],
            'expiresAt' => ['sometimes', 'nullable', 'date'],
            'isActive' => ['sometimes', 'boolean'],
            'republish' => ['sometimes', 'boolean'],
        ]);
    }

    private function notifyResidents(Announcement $announcement): void
    {
        $residentIds = DB::table('users')
            ->leftJoin(
                'resqnow_preferences',
                'resqnow_preferences.user_id',
                '=',
                'users.id'
            )
            ->where('users.role', 'resident')
            ->where('users.account_status', 'Verified')
            ->where(function ($query) {
                $query
                    ->whereNull('resqnow_preferences.user_id')
                    ->orWhere('resqnow_preferences.announcement_notifications', true);
            })
            ->pluck('users.id')
            ->all();

        ReportNotifications::send(
            $residentIds,
            'announcement',
            $announcement->title,
            $announcement->body,
            null,
            $announcement->id
        );
    }

    private function serialize(Announcement $announcement): array
    {
        return [
            'id' => (int) $announcement->id,
            'title' => $announcement->title,
            'body' => $announcement->body,
            'category' => $announcement->category,
            'affectedPuroks' => $announcement->affected_puroks ?? [],
            'publishedAt' => $announcement->published_at?->toIso8601String(),
            'expiresAt' => $announcement->expires_at?->toIso8601String(),
            'isActive' => (bool) $announcement->is_active,
        ];
    }
}
