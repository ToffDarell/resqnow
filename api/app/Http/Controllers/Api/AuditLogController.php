<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Get all audit logs.
     */
    public function index()
    {
        $auditLogs = AuditLog::orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'message' => 'Audit logs retrieved successfully.',
            'data' => $auditLogs,
        ]);
    }

    /**
     * Create a new audit log.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'target' => 'nullable|string|max:255',
            'field' => 'nullable|string|max:255',
            'old_value' => 'nullable|string',
            'new_value' => 'nullable|string',
            'remarks' => 'nullable|string',
            'user_name' => 'nullable|string|max:255',
            'user_role' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:50',
        ]);

        $auditLog = AuditLog::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Audit log created successfully.',
            'data' => $auditLog,
        ], 201);
    }
}