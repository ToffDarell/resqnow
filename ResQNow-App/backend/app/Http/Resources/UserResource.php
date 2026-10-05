<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform authenticated user data
     * for the React frontend.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $profile =
            $this->profile;

        return [
            'id' =>
                $this->id,

            'fullName' =>
                $this->name,

            'email' =>
                $this->email,

            'role' =>
                $this->role,

            'accountStatus' =>
                $this->account_status,

            'contactNumber' =>
                $profile?->contact_number,

            'address' =>
                $profile?->address,

            'purok' =>
                $profile?->purok,

            'householdCount' =>
                $profile?->household_count ?? 1,

            'householdProfile' => [
                'hasSeniorCitizen' =>
                    $profile?->has_senior_citizen ?? false,

                'hasChild' =>
                    $profile?->has_child ?? false,

                'hasPWD' =>
                    $profile?->has_pwd ?? false,

                'hasPregnantPerson' =>
                    $profile?->has_pregnant_person ?? false,
            ],

            'homeLocation' =>
                $profile &&
                $profile->home_latitude !== null &&
                $profile->home_longitude !== null
                    ? [
                        'latitude' =>
                            (float) $profile->home_latitude,

                        'longitude' =>
                            (float) $profile->home_longitude,
                    ]
                    : null,

            'createdAt' =>
                $this->created_at?->toISOString(),

            'updatedAt' =>
                $this->updated_at?->toISOString(),
        ];
    }
}
