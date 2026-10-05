<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'incident_code',
        'title',
        'type',
        'category',
        'description',
        'location',
        'latitude',
        'longitude',
        'priority',
        'assigned_personnel_id',
        'status',
        'dispatched_at',
        'resolved_at',
    ];

    /**
     * The original hazard/incident report.
     */
    public function report()
    {
        return $this->belongsTo(Report::class);
    }

    /**
     * The personnel assigned to this incident.
     */
    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'assigned_personnel_id');
    }
}