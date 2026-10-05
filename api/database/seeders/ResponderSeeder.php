<?php

namespace Database\Seeders;

use App\Models\Personnel;
use App\Models\ResponderProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResponderSeeder extends Seeder
{
    /**
     * Create a responder account (mobile app) from RESPONDER_EMAIL /
     * RESPONDER_PASSWORD, linked to a web-admin personnel record so the
     * admin can assign incidents to it. Skipped if unset.
     */
    public function run(): void
    {
        $email = env('RESPONDER_EMAIL');
        $password = env('RESPONDER_PASSWORD');

        if (! $email || ! $password) {
            return;
        }

        $name = env('RESPONDER_NAME', 'Barangay Responder');

        $user = User::updateOrCreate(
            ['email' => strtolower($email)],
            [
                'name' => $name,
                'password' => $password,
                'role' => 'responder',
                'account_status' => 'Verified',
            ]
        );

        ResponderProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'responder_role' => env('RESPONDER_ROLE', 'Responder'),
                'team_name' => env('RESPONDER_TEAM'),
            ]
        );

        $personnel = Personnel::query()->where('user_id', $user->id)->first()
            ?? Personnel::create([
                'personnel_code' => 'RSP-' . str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
                'name' => $name,
                'role' => env('RESPONDER_ROLE', 'Responder'),
                'team' => env('RESPONDER_TEAM'),
                'status' => 'Active',
                'availability' => 'Available',
                'joined_at' => now(),
                'user_id' => $user->id,
            ]);
    }
}
