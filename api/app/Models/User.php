<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
    'status',
    'verification_status',
    'verification_remarks',
    'verified_at',
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
     * Get all reports submitted by this user.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    /**
     * Resident profile (mobile app).
     */
    public function profile(): HasOne
    {
        return $this->hasOne(ResidentProfile::class);
    }

    /**
     * Responder profile (mobile app).
     */
    public function responderProfile(): HasOne
    {
        return $this->hasOne(ResponderProfile::class);
    }

    public function reportStatusChanges(): HasMany
    {
        return $this->hasMany(ReportStatusLog::class, 'changed_by_user_id');
    }

    public function reportAssignments(): HasMany
    {
        return $this->hasMany(ReportAssignment::class, 'assigned_user_id');
    }

    /**
     * Mobile-app view of the web-admin verification fields.
     *
     * The web admin stores verification_status (Pending/Verified/Rejected)
     * plus status (active/inactive). The mobile app speaks "account status".
     */
    protected function accountStatus(): Attribute
    {
        return Attribute::make(
            get: function () {
                return match ($this->verification_status) {
                    'Verified' => $this->status === 'inactive' ? 'Deactivated' : 'Verified',
                    'Rejected' => 'Rejected',
                    default => 'Pending Verification',
                };
            },
            set: function (string $value) {
                return match ($value) {
                    'Verified' => [
                        'verification_status' => 'Verified',
                        'status' => 'active',
                        'verified_at' => now(),
                    ],
                    'Rejected' => [
                        'verification_status' => 'Rejected',
                        'status' => 'inactive',
                        'verified_at' => null,
                    ],
                    default => [
                        'verification_status' => 'Pending',
                        'status' => 'active',
                        'verified_at' => null,
                    ],
                };
            },
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
        'verified_at' => 'datetime',
    ];
}
}