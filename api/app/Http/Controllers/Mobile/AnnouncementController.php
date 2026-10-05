<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Read-only announcements for the mobile app.
 *
 * Announcements are authored in the web admin (announcements table);
 * the mobile app only sees the ones that are Published and not expired.
 */
class AnnouncementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = max(1, min((int) $request->integer('limit', 20), 50));

        $announcements = $this->visible()
            ->orderByRaw("CASE priority WHEN 'Critical' THEN 3 WHEN 'High' THEN 2 ELSE 1 END DESC")
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

    public function show(int $announcement): JsonResponse
    {
        $found = $this->visible()->find($announcement);

        abort_unless($found, 404, 'Announcement not found.');

        return response()->json([
            'data' => $this->serialize($found),
        ]);
    }

    private function visible(): Builder
    {
        return Announcement::query()
            ->where('status', 'Published')
            ->where(function (Builder $query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->where(function (Builder $query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    private function serialize(Announcement $announcement): array
    {
        $category = match ($announcement->priority) {
            'Critical' => 'critical',
            'High' => 'advisory',
            default => 'general',
        };

        return [
            'id' => (int) $announcement->id,
            'title' => $announcement->title,
            'body' => $announcement->content,
            'category' => $category,
            'affectedPuroks' => [],
            'publishedAt' => ($announcement->published_at ?? $announcement->created_at)?->toIso8601String(),
            'expiresAt' => $announcement->expires_at?->toIso8601String(),
            'isActive' => true,
        ];
    }
}
