<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'contact_number',
    'purok',
    'address',
    'household_count',
    'has_senior_citizen',
    'has_child',
    'has_pwd',
    'has_pregnant_person',
    'home_latitude',
    'home_longitude',
    'emergency_contact_name',
    'emergency_contact_number',
])]
class ResidentProfile extends Model
{
    use HasFactory;

    /**
     * Account that owns this resident profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class
        );
    }

    /**
     * Cast resident profile values.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'household_count' => 'integer',

            'has_senior_citizen' => 'boolean',
            'has_child' => 'boolean',
            'has_pwd' => 'boolean',
            'has_pregnant_person' => 'boolean',

            'home_latitude' => 'decimal:7',
            'home_longitude' => 'decimal:7',
        ];
    }
}
