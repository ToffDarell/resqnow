<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportAssignment extends Model
{
    use HasFactory;

    /**
     * Fields that may be mass assigned.
     */
    protected $fillable = [
        'report_id',
        'assigned_user_id',
        'assigned_by_user_id',
        'notes',
        'assigned_at',
        'unassigned_at',
        'acknowledged_at',
    ];

    /**
     * Convert date fields into Carbon instances.
     */
    protected function casts(): array
    {
        return [
            'assigned_at' =>
                'datetime',

            'unassigned_at' =>
                'datetime',

            'acknowledged_at' =>
                'datetime',
        ];
    }

    /**
     * Report this assignment belongs to.
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(
            Report::class
        );
    }

    /**
     * Personnel / responder assigned to the report.
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'assigned_user_id'
        );
    }

    /**
     * Admin / barangay user who made the assignment.
     *
     * This may be null for system-generated assignments.
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'assigned_by_user_id'
        );
    }
}
