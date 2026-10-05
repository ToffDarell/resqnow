<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'role',
    'account_status',
])]
#[Hidden([
    'password',
    'remember_token',
])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Resident profile connected to this account.
     */
    public function profile(): HasOne
    {
        return $this->hasOne(
            ResidentProfile::class
        );
    }

    /**
     * Operational responder profile for responder accounts.
     */
    public function responderProfile(): HasOne
    {
        return $this->hasOne(
            ResponderProfile::class
        );
    }

    /**
     * Reports submitted by this user.
     *
     * For a resident account, these are the
     * resident's submitted reports.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(
            Report::class
        );
    }

    /**
     * Report status changes made by this user.
     *
     * Mainly used later for barangay/admin/responder
     * users who update report progress.
     */
    public function reportStatusChanges(): HasMany
    {
        return $this->hasMany(
            ReportStatusLog::class,
            'changed_by_user_id'
        );
    }

    /**
     * Report assignments where this user
     * is the assigned responder/personnel.
     */
    public function reportAssignments(): HasMany
    {
        return $this->hasMany(
            ReportAssignment::class,
            'assigned_user_id'
        );
    }

    /**
     * Assignments created by this user.
     *
     * Used later for barangay/admin users
     * who assign responders to reports.
     */
    public function createdReportAssignments(): HasMany
    {
        return $this->hasMany(
            ReportAssignment::class,
            'assigned_by_user_id'
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
