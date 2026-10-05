<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    use HasFactory;

    protected $fillable = [
        'personnel_code',
        'name',
        'role',
        'team',
        'mobile',
        'status',
        'availability',
        'assignment',
        'location',
        'joined_at',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
        ];
    }
}