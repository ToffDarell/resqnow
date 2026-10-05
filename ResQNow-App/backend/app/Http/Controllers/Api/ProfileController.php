<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    // ============ UPDATE PROFILE ============
    /**
     * Update the authenticated resident's profile.
     */
    public function update(
        UpdateProfileRequest $request
    ): JsonResponse {
        $data =
            $request->validated();

        /** @var User $user */
        $user =
            $request->user();

        DB::transaction(
            function () use (
                $user,
                $data
            ) {
                // ============ USER ACCOUNT ============

                $user->update([
                    'name' =>
                        $data['fullName'],

                    'email' =>
                        strtolower(
                            $data['email']
                        ),
                ]);

                // ============ RESIDENT PROFILE ============

                $currentProfile =
                    $user->profile;

                $householdProfile =
                    $data['householdProfile'] ?? [];

                /**
                 * Preserve existing optional values when
                 * the frontend does not send them.
                 *
                 * This is especially important for the
                 * future home map coordinates.
                 */
                $profileData = [
                    'contact_number' =>
                        $data['contactNumber'],

                    'purok' =>
                        $data['purok'],

                    'address' =>
                        $data['address'],

                    'household_count' =>
                        $data['householdCount']
                        ?? $currentProfile?->household_count
                        ?? 1,

                    'has_senior_citizen' =>
                        array_key_exists(
                            'hasSeniorCitizen',
                            $householdProfile
                        )
                            ? $householdProfile[
                                'hasSeniorCitizen'
                            ]
                            : (
                                $currentProfile
                                    ?->has_senior_citizen
                                ?? false
                            ),

                    'has_child' =>
                        array_key_exists(
                            'hasChild',
                            $householdProfile
                        )
                            ? $householdProfile[
                                'hasChild'
                            ]
                            : (
                                $currentProfile
                                    ?->has_child
                                ?? false
                            ),

                    'has_pwd' =>
                        array_key_exists(
                            'hasPWD',
                            $householdProfile
                        )
                            ? $householdProfile[
                                'hasPWD'
                            ]
                            : (
                                $currentProfile
                                    ?->has_pwd
                                ?? false
                            ),

                    'has_pregnant_person' =>
                        array_key_exists(
                            'hasPregnantPerson',
                            $householdProfile
                        )
                            ? $householdProfile[
                                'hasPregnantPerson'
                            ]
                            : (
                                $currentProfile
                                    ?->has_pregnant_person
                                ?? false
                            ),

                    'home_latitude' =>
                        array_key_exists(
                            'homeLatitude',
                            $data
                        )
                            ? $data[
                                'homeLatitude'
                            ]
                            : $currentProfile
                                ?->home_latitude,

                    'home_longitude' =>
                        array_key_exists(
                            'homeLongitude',
                            $data
                        )
                            ? $data[
                                'homeLongitude'
                            ]
                            : $currentProfile
                                ?->home_longitude,
                ];

                /**
                 * Normal accounts already have a profile.
                 *
                 * The fallback also safely handles an older
                 * resident account that may be missing one.
                 */
                if ($currentProfile) {
                    $currentProfile->update(
                        $profileData
                    );
                } else {
                    $user
                        ->profile()
                        ->create(
                            $profileData
                        );
                }
            }
        );

        // Reload fresh values from MySQL.
        $user->refresh();
        $user->load('profile');

        return response()->json([
            'message' =>
                'Your profile has been updated successfully.',

            'user' =>
                new UserResource(
                    $user
                ),
        ]);
    }
}
