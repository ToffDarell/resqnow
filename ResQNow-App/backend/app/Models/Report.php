<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Report extends Model
{
    use HasFactory;

    /**
     * Fields that may be mass assigned.
     */
    protected $fillable = [
        'user_id',

        // Request safety / concurrency.
        'client_request_id',
        'request_fingerprint',
        'version',

        // File storage metadata.
        'photo_disk',

        // Location metadata.
        'location_source',
        'location_accuracy',
        'location_captured_at',

        // Existing report fields.
        'report_code',
        'report_type',
        'concern_code',
        'concern_type',
        'subcategory',
        'status',
        'priority',
        'reporting_for',
        'subject_name',
        'subject_contact',
        'relationship_note',
        'purok',
        'location',
        'landmark',
        'latitude',
        'longitude',
        'description',
        'required_assistance',
        'affected_individuals',
        'photo_path',
        'barangay_remarks',
        'invalid_reason',
        'resolved_remarks',
    ];

    /**
     * Convert database values to useful PHP types.
     */
    protected function casts(): array
    {
        return [
            'affected_individuals' =>
                'array',

            'version' =>
                'integer',

            'location_accuracy' =>
                'float',

            'location_captured_at' =>
                'datetime',

            'latitude' =>
                'decimal:7',

            'longitude' =>
                'decimal:7',
        ];
    }

    /**
     * Resident who submitted the report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class
        );
    }

    /**
     * Complete status / field activity history.
     */
    public function statusLogs(): HasMany
    {
        return $this
            ->hasMany(
                ReportStatusLog::class
            )
            ->orderBy('created_at')
            ->orderBy('id');
    }

    /**
     * Most recent report status update.
     */
    public function latestStatusLog(): HasOne
    {
        return $this
            ->hasOne(
                ReportStatusLog::class
            )
            ->latestOfMany();
    }

    /**
     * Support, unable-to-locate and review requests
     * created during field response.
     */
    public function attentionRequests(): HasMany
    {
        return $this
            ->hasMany(
                ReportAttentionRequest::class
            )
            ->orderByDesc('id');
    }

    /**
     * Complete personnel assignment history.
     */
    public function assignments(): HasMany
    {
        return $this
            ->hasMany(
                ReportAssignment::class
            )
            ->orderBy('assigned_at');
    }

    /**
     * Personnel currently assigned to the report.
     */
    public function activeAssignments(): HasMany
    {
        return $this
            ->hasMany(
                ReportAssignment::class
            )
            ->whereNull(
                'unassigned_at'
            )
            ->orderBy('assigned_at');
    }
}
