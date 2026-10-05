<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResponderProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'is_on_duty',
        'responder_role',
        'current_asset',
        'team_name',
        'last_duty_changed_at',
    ];

    protected function casts(): array
    {
        return [
            'is_on_duty' => 'boolean',
            'last_duty_changed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
