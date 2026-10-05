<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvacuationCenter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EvacuationCenterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'nearest' => ['nullable', 'boolean'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $centers = EvacuationCenter::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $lat = array_key_exists('lat', $data) ? (float) $data['lat'] : null;
        $lng = array_key_exists('lng', $data) ? (float) $data['lng'] : null;

        $serialized = $centers
            ->map(function (EvacuationCenter $center) use ($lat, $lng) {
                $distanceMeters = null;

                if (
                    $lat !== null &&
                    $lng !== null &&
                    $center->latitude !== null &&
                    $center->longitude !== null
                ) {
                    $distanceMeters = $this->distanceMeters(
                        $lat,
                        $lng,
                        (float) $center->latitude,
                        (float) $center->longitude
                    );
                }

                return $this->serialize($center, $distanceMeters);
            })
            ->sort(function (array $a, array $b) use ($lat, $lng) {
                $statusRank = [
                    'open' => 0,
                    'standby' => 1,
                    'full' => 2,
                    'closed' => 3,
                ];

                $statusDifference =
                    ($statusRank[$a['status']] ?? 99) -
                    ($statusRank[$b['status']] ?? 99);

                if ($statusDifference !== 0) {
                    return $statusDifference;
                }

                if ($lat !== null && $lng !== null) {
                    return ($a['distanceMeters'] ?? PHP_INT_MAX)
                        <=> ($b['distanceMeters'] ?? PHP_INT_MAX);
                }

                return $a['sortOrder'] <=> $b['sortOrder'];
            })
            ->values();

        $limit = max(1, min((int) ($data['limit'] ?? 20), 50));

        if (! empty($data['nearest'])) {
            $limit = 1;
        }

        return response()->json([
            'data' => $serialized->take($limit)->values(),
        ]);
    }

    private function serialize(EvacuationCenter $center, ?int $distanceMeters): array
    {
        return [
            'id' => (int) $center->id,
            'name' => $center->name,
            'address' => $center->address,
            'latitude' => $center->latitude,
            'longitude' => $center->longitude,
            'status' => $center->status,
            'capacity' => $center->capacity,
            'currentOccupancy' => $center->current_occupancy,
            'contactNumber' => $center->contact_number,
            'notes' => $center->notes,
            'distanceMeters' => $distanceMeters,
            'sortOrder' => (int) $center->sort_order,
            'directionsUrl' => (
                $center->latitude !== null &&
                $center->longitude !== null
            )
                ? sprintf(
                    'https://www.google.com/maps/search/?api=1&query=%s,%s',
                    $center->latitude,
                    $center->longitude
                )
                : null,
        ];
    }

    private function distanceMeters(
        float $lat1,
        float $lng1,
        float $lat2,
        float $lng2
    ): int {
        $earthRadius = 6371000;

        $latDelta = deg2rad($lat2 - $lat1);
        $lngDelta = deg2rad($lng2 - $lng1);

        $a = sin($latDelta / 2) ** 2
            + cos(deg2rad($lat1))
            * cos(deg2rad($lat2))
            * sin($lngDelta / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return (int) round($earthRadius * $c);
    }
}
