<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvacuationCenter extends Model
{
    protected $table = 'resqnow_evacuation_centers';

    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'status',
        'capacity',
        'current_occupancy',
        'contact_number',
        'notes',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'capacity' => 'integer',
            'current_occupancy' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
