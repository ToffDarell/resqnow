<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvacuationCenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminEvacuationCenterController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => EvacuationCenter::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $center = EvacuationCenter::create($this->validated($request));

        return response()->json([
            'message' => 'Evacuation center created.',
            'data' => $center,
        ], 201);
    }

    public function update(Request $request, EvacuationCenter $evacuationCenter): JsonResponse
    {
        $evacuationCenter->fill($this->validated($request, true));
        $evacuationCenter->save();

        return response()->json([
            'message' => 'Evacuation center updated.',
            'data' => $evacuationCenter->fresh(),
        ]);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        $data = $request->validate([
            'name' => [$required, 'string', 'max:160'],
            'address' => [$required, 'string', 'max:255'],
            'latitude' => ['sometimes', 'nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'nullable', 'numeric', 'between:-180,180'],
            'status' => [$required, 'in:open,full,standby,closed'],
            'capacity' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:1000000'],
            'currentOccupancy' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:1000000'],
            'contactNumber' => ['sometimes', 'nullable', 'string', 'max:32'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'isActive' => ['sometimes', 'boolean'],
            'sortOrder' => ['sometimes', 'integer', 'min:0', 'max:1000000'],
        ]);

        return [
            ...array_filter([
                'name' => $data['name'] ?? null,
                'address' => $data['address'] ?? null,
                'latitude' => array_key_exists('latitude', $data) ? $data['latitude'] : null,
                'longitude' => array_key_exists('longitude', $data) ? $data['longitude'] : null,
                'status' => $data['status'] ?? null,
                'capacity' => array_key_exists('capacity', $data) ? $data['capacity'] : null,
                'current_occupancy' => array_key_exists('currentOccupancy', $data)
                    ? $data['currentOccupancy']
                    : null,
                'contact_number' => array_key_exists('contactNumber', $data)
                    ? $data['contactNumber']
                    : null,
                'notes' => array_key_exists('notes', $data) ? $data['notes'] : null,
                'is_active' => array_key_exists('isActive', $data) ? $data['isActive'] : null,
                'sort_order' => array_key_exists('sortOrder', $data) ? $data['sortOrder'] : null,
            ], fn ($value) => $value !== null),
        ];
    }
}
