<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = max(1, min((int) $request->integer('limit', 20), 50));

        $announcements = Announcement::query()
            ->where('is_active', true)
            ->where('published_at', '<=', now())
            ->where(function ($query) {
                $query
                    ->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->orderByRaw("CASE category WHEN 'critical' THEN 3 WHEN 'advisory' THEN 2 ELSE 1 END DESC")
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $announcements
                ->map(fn (Announcement $announcement) => $this->serialize($announcement))
                ->values(),
        ]);
    }

    public function show(Announcement $announcement): JsonResponse
    {
        abort_unless(
            $announcement->is_active &&
            $announcement->published_at?->lte(now()) &&
            (! $announcement->expires_at || $announcement->expires_at->isFuture()),
            404,
            'Announcement not found.'
        );

        return response()->json([
            'data' => $this->serialize($announcement),
        ]);
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
