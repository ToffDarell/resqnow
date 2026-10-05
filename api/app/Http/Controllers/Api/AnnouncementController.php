<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\AuditLog;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Get all announcements.
     */
    public function index()
    {
        $announcements = Announcement::orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'message' => 'Announcements retrieved successfully.',
            'data' => $announcements,
        ]);
    }

    /**
     * Get a specific announcement.
     */
    public function show(Announcement $announcement)
    {
        return response()->json([
            'success' => true,
            'message' => 'Announcement retrieved successfully.',
            'data' => $announcement,
        ]);
    }

    /**
     * Create a new announcement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'priority' => 'required|string|max:50',
            'status' => 'required|string|max:50',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:published_at',
        ]);

        $announcement = Announcement::create($validated);

        $this->createAuditLog(
            action: 'Created',
            target: "Announcement #{$announcement->id}",
            field: null,
            oldValue: null,
            newValue: $announcement->title,
            remarks: 'New announcement created.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Announcement created successfully.',
            'data' => $announcement,
        ], 201);
    }

    /**
     * Update an existing announcement.
     */
    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'priority' => 'required|string|max:50',
            'status' => 'required|string|max:50',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:published_at',
        ]);

        $oldValues = $announcement->only([
            'title',
            'content',
            'category',
            'priority',
            'status',
            'published_at',
            'expires_at',
        ]);

        $announcement->update($validated);

        $changedFields = $announcement->getChanges();

        foreach ($changedFields as $field => $newValue) {
            if ($field === 'updated_at') {
                continue;
            }

            $this->createAuditLog(
                action: 'Updated',
                target: "Announcement #{$announcement->id}",
                field: $field,
                oldValue: $oldValues[$field] ?? null,
                newValue: $newValue,
                remarks: "Announcement {$field} updated."
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Announcement updated successfully.',
            'data' => $announcement->fresh(),
        ]);
    }

    /**
     * Update only the announcement status.
     */
    public function updateStatus(
    Request $request,
    Announcement $announcement,
    NotificationService $notificationService
)
    {
        $validated = $request->validate([
            'status' => 'required|string|max:50',
        ]);

        $oldStatus = $announcement->status;

        $announcement->update([
            'status' => $validated['status'],
        ]);

        $this->createAuditLog(
            action: 'Status Updated',
            target: "Announcement #{$announcement->id}",
            field: 'status',
            oldValue: $oldStatus,
            newValue: $validated['status'],
            remarks: 'Announcement status updated.'
        );
        if (
    $validated['status'] === 'Published' &&
    $oldStatus !== 'Published'
) {
    $notificationService->notifyAnnouncementPublished(
        $announcement
    );
}

        return response()->json([
            'success' => true,
            'message' => 'Announcement status updated successfully.',
            'data' => $announcement->fresh(),
        ]);
    }

    /**
     * Delete an announcement.
     */
    public function destroy(Announcement $announcement)
    {
        $announcementId = $announcement->id;
        $announcementTitle = $announcement->title;

        $announcement->delete();

        $this->createAuditLog(
            action: 'Deleted',
            target: "Announcement #{$announcementId}",
            field: null,
            oldValue: $announcementTitle,
            newValue: null,
            remarks: 'Announcement deleted.'
        );

        return response()->json([
            'success' => true,
            'message' => 'Announcement deleted successfully.',
        ]);
    }

    /**
     * Create an audit log using the currently authenticated user.
     */
    private function createAuditLog(
        string $action,
        ?string $target = null,
        ?string $field = null,
        $oldValue = null,
        $newValue = null,
        ?string $remarks = null
    ): void {
        $user = request()->user();

        AuditLog::create([
            'action' => $action,
            'category' => 'Announcement',
            'target' => $target,
            'field' => $field,
            'old_value' => $oldValue !== null
                ? (string) $oldValue
                : null,
            'new_value' => $newValue !== null
                ? (string) $newValue
                : null,
            'remarks' => $remarks,
            'user_name' => $user?->name,
            'user_role' => $user?->role,
            'status' => 'Success',
        ]);
    }
}