<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Report extends Model
{
    protected $fillable = [
        'user_id',
        'report_type',
        'category',
        'description',
        'location',
        'latitude',
        'longitude',
        'status',
        'verification_status',
        'priority',

        'water_level',
        'road_passability',
        'affected_residents',
        'location_risk',
        'assistance_evacuation_need',
        'additional_risk_factors',

        'triage_score',
        'triage_recommendation',
        'triage_remarks',
        'triage_assessed_at',
        'triage_assessed_by',

        'priority_override_reason',
        'priority_assigned_at',
        'priority_assigned_by',

        // Mobile app fields.
        'client_request_id',
        'request_fingerprint',
        'version',
        'photo_disk',
        'location_source',
        'location_accuracy',
        'location_captured_at',
        'report_code',
        'concern_code',
        'concern_type',
        'subcategory',
        'reporting_for',
        'subject_name',
        'subject_contact',
        'relationship_note',
        'purok',
        'landmark',
        'required_assistance',
        'affected_individuals',
        'photo_path',
        'barangay_remarks',
        'invalid_reason',
        'resolved_remarks',
    ];

    protected $casts = [
        'additional_risk_factors' => 'array',
        'triage_assessed_at' => 'datetime',
        'priority_assigned_at' => 'datetime',
        'affected_individuals' => 'array',
        'version' => 'integer',
        'location_accuracy' => 'float',
        'location_captured_at' => 'datetime',
    ];

    /**
     * Reports created by the mobile app start in the web-admin
     * verification queue and carry the web-admin category label.
     */
    protected static function booted(): void
    {
        static::creating(function (Report $report) {
            if (in_array($report->status, [null, 'Submitted', 'Pending Verification'], true)) {
                $report->status = 'For Verification';
            }

            if (empty($report->category)) {
                $report->category = $report->concern_type ?: 'General';
            }

            if (empty($report->verification_status)) {
                $report->verification_status = 'Pending';
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(ReportStatusLog::class)
            ->orderBy('created_at')
            ->orderBy('id');
    }

    public function latestStatusLog(): HasOne
    {
        return $this->hasOne(ReportStatusLog::class)->latestOfMany();
    }

    public function attentionRequests(): HasMany
    {
        return $this->hasMany(ReportAttentionRequest::class)->orderByDesc('id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(ReportAssignment::class)->orderBy('assigned_at');
    }

    public function activeAssignments(): HasMany
    {
        return $this->hasMany(ReportAssignment::class)
            ->whereNull('unassigned_at')
            ->orderBy('assigned_at');
    }

    /**
     * Status as shown in the mobile app.
     *
     * Reports move through the web-admin queue ("For Verification",
     * "For Prioritization", "Prioritized") before a responder is assigned;
     * the mobile app presents those stages with its own labels.
     */
    public function appStatus(): ?string
    {
        return match ($this->status) {
            'For Verification' => $this->verification_status === 'Returned'
                || $this->report_type !== 'Emergency'
                    ? 'Pending Verification'
                    : 'Submitted',
            'For Prioritization', 'Prioritized' => 'Verified',
            default => $this->status,
        };
    }
}
