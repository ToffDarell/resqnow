<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ReportStatusLog extends Model
{
    use HasFactory;

    /**
     * Fields that may be mass assigned.
     */
    protected $fillable = [
        'report_id',
        'status',
        'remarks',
        'changed_by_user_id',

        // Responder field update details.
        'activity',
        'checklist',
        'photo_path',

        // Request retry / duplicate protection.
        'client_request_id',
        'request_fingerprint',
    ];

    /**
     * Convert stored values to useful PHP types.
     */
    protected function casts(): array
    {
        return [
            'checklist' => 'array',
        ];
    }

    /**
     * Report this status / field update belongs to.
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(
            Report::class
        );
    }

    /**
     * User who caused the status or field update.
     *
     * This may be null for system-generated events.
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'changed_by_user_id'
        );
    }

    /**
     * Optional support / unable-to-locate /
     * review request created from this event.
     *
     * event_id is unique in the attention-request table,
     * so one status log can have at most one request.
     */
    public function attentionRequest(): HasOne
    {
        return $this->hasOne(
            ReportAttentionRequest::class,
            'event_id'
        );
    }
}
