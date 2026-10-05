<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportAttentionRequest extends Model
{
    protected $table = 'resqnow_attention_requests';

    protected $guarded = [
        'id',
    ];

    protected function casts(): array
    {
        return [
            'acknowledged_at' => 'datetime',
        ];
    }

    public function report(): BelongsTo
    {
        return $this->belongsTo(
            Report::class
        );
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(
            ReportStatusLog::class,
            'event_id'
        );
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'requested_by'
        );
    }

    public function acknowledgedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'acknowledged_by'
        );
    }
}
