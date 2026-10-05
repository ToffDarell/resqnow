<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SystemSetting::firstOrCreate([]);

        return response()->json([
            'success' => true,
            'message' => 'System settings retrieved successfully.',
            'data' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'system_name' => ['required', 'string', 'max:255'],
            'barangay_name' => ['required', 'string', 'max:255'],
            'city_name' => ['required', 'string', 'max:255'],
            'language' => ['required', 'string', 'max:50'],

            'notifications' => ['required', 'boolean'],
            'critical_alerts' => ['required', 'boolean'],
            'assignment_alerts' => ['required', 'boolean'],
            'announcement_alerts' => ['required', 'boolean'],
            'auto_refresh' => ['required', 'boolean'],
        ]);

        $settings = SystemSetting::firstOrCreate([]);

        $settings->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'System settings updated successfully.',
            'data' => $settings->fresh(),
        ]);
    }
}