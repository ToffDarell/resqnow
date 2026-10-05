<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $table = 'resqnow_announcements';

    protected $fillable = [
        'title',
        'body',
        'category',
        'affected_puroks',
        'expires_at',
        'is_active',
        'published_by',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'affected_puroks' => 'array',
            'expires_at' => 'datetime',
            'published_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }
}
