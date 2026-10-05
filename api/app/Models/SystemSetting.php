<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'system_name',
        'barangay_name',
        'city_name',
        'language',
        'notifications',
        'critical_alerts',
        'assignment_alerts',
        'announcement_alerts',
        'auto_refresh',
    ];

    protected function casts(): array
    {
        return [
            'notifications' => 'boolean',
            'critical_alerts' => 'boolean',
            'assignment_alerts' => 'boolean',
            'announcement_alerts' => 'boolean',
            'auto_refresh' => 'boolean',
        ];
    }
}