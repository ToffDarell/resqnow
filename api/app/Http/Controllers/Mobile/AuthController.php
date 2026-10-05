<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ChangePasswordRequest;
use App\Http\Requests\Api\ForgotPasswordRequest;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Requests\Api\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ============ REGISTER ============

    /**
     * Register a new resident account.
     */
    public function register(
        RegisterRequest $request
    ): JsonResponse {
        $data = $request->validated();

        $user = DB::transaction(
            function () use ($data) {
                $user = User::create([
                    'name' => $data['fullName'],
                    'email' => strtolower($data['email']),
                    'password' => Hash::make($data['password']),
                    'role' => 'resident',
                    'account_status' => 'Pending Verification',
                ]);

                $householdProfile = $data['householdProfile'] ?? [];

                $user->profile()->create([
                    'contact_number' => $data['contactNumber'],
                    'emergency_contact_name' => $data['emergencyContactName'] ?? null,
                    'emergency_contact_number' => $data['emergencyContactNumber'] ?? null,
                    'purok' => $data['purok'],
                    'address' => $data['address'],
                    'household_count' => $data['householdCount'] ?? 1,
                    'has_senior_citizen' => $householdProfile['hasSeniorCitizen'] ?? false,
                    'has_child' => $householdProfile['hasChild'] ?? false,
                    'has_pwd' => $householdProfile['hasPWD'] ?? false,
                    'has_pregnant_person' => $householdProfile['hasPregnantPerson'] ?? false,
                    'home_latitude' => $data['homeLatitude'] ?? null,
                    'home_longitude' => $data['homeLongitude'] ?? null,
                ]);

                return $user;
            }
        );

        $user->load('profile');

        return response()->json([
            'message' => 'Resident account created successfully. Your account is pending barangay verification.',
            'user' => new UserResource($user),
        ], 201);
    }

    // ============ LOGIN ============

    /**
     * Authenticate a verified ResQNow account.
     *
     * Resident and Responder share the same login. The mobile app is a
     * separate origin (Vercel), so it authenticates with a Sanctum bearer
     * token instead of a cookie session.
     */
    public function login(
        LoginRequest $request
    ): JsonResponse {
        $data = $request->validated();

        /** @var User|null $user */
        $user = User::query()
            ->where('email', strtolower($data['email']))
            ->first();

        if (
            ! $user ||
            ! Hash::check($data['password'], $user->password)
        ) {
            // Server log only (never sent to the client): why the sign-in failed.
            Log::warning('app.login failed', [
                'reason' => $user ? 'bad_password' : 'no_such_user',
                'email' => strtolower($data['email']),
                'role' => $user?->role,
                'hash_prefix' => $user ? substr((string) $user->password, 0, 7) : null,
                'hash_length' => $user ? strlen((string) $user->password) : null,
            ]);

            return response()->json([
                'message' => 'The email or password you entered is incorrect.',
            ], 422);
        }

        // Administrators never sign in here. Answer exactly like a wrong
        // password so the app reveals nothing about admin accounts.
        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'The email or password you entered is incorrect.',
            ], 422);
        }

        if (
            ! in_array(
                $user->role,
                ['resident', 'responder'],
                true
            )
        ) {
            return response()->json([
                'message' => 'This account does not have ResQNow access.',
            ], 403);
        }

        if ($user->account_status !== 'Verified') {
            $accountStatus = $user->account_status;

            return response()->json([
                'message' => $accountStatus === 'Pending Verification'
                    ? 'Your account is still waiting for barangay verification.'
                    : 'Your account is currently unavailable.',
                'accountStatus' => $accountStatus,
            ], 403);
        }

        $token = $user
            ->createToken('resqnow-mobile')
            ->plainTextToken;

        $user->load('profile');

        return response()->json([
            'message' => 'Signed in successfully.',
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    // ============ FORGOT PASSWORD ============

    /**
     * Request password reset instructions.
     */
    public function forgotPassword(
        ForgotPasswordRequest $request
    ): JsonResponse {
        $data = $request->validated();
        $email = strtolower($data['email']);

        Password::sendResetLink([
            'email' => $email,
        ]);

        return response()->json([
            'message' => 'If an account exists for that email, password reset instructions have been sent.',
        ]);
    }

    // ============ RESET PASSWORD ============

    /**
     * Reset an account password using a valid password-reset token.
     */
    public function resetPassword(
        ResetPasswordRequest $request
    ): JsonResponse {
        $data = $request->validated();

        $credentials = [
            'email' => strtolower($data['email']),
            'password' => $data['password'],
            'password_confirmation' => $data['password_confirmation'],
            'token' => $data['token'],
        ];

        $status = Password::reset(
            $credentials,
            function (
                User $user,
                string $password
            ) {
                if (Hash::check($password, $user->password)) {
                    throw ValidationException::withMessages([
                        'password' => [
                            'Your new password must be different from your current password.',
                        ],
                    ]);
                }

                $user
                    ->forceFill([
                        'password' => Hash::make($password),
                    ])
                    ->setRememberToken(Str::random(60));

                $user->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'This password reset link is invalid or has expired.',
            ], 422);
        }

        return response()->json([
            'message' => 'Your password has been reset successfully. You can now sign in with your new password.',
        ]);
    }

    // ============ CHANGE PASSWORD ============

    /**
     * Change the authenticated user's password.
     */
    public function changePassword(
        ChangePasswordRequest $request
    ): JsonResponse {
        $data = $request->validated();

        /** @var User $user */
        $user = $request->user();

        abort_unless(
            $user && in_array(
                $user->role,
                ['resident', 'responder', 'admin'],
                true
            ),
            403,
            'Your account cannot perform this action.'
        );

        if (
            !Hash::check(
                $data['currentPassword'],
                $user->password
            )
        ) {
            return response()->json([
                'message' => 'The current password you entered is incorrect.',
                'errors' => [
                    'currentPassword' => [
                        'The current password you entered is incorrect.',
                    ],
                ],
            ], 422);
        }

        if (Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Your new password must be different from your current password.',
                'errors' => [
                    'password' => [
                        'Your new password must be different from your current password.',
                    ],
                ],
            ], 422);
        }

        $user
            ->forceFill([
                'password' => Hash::make($data['password']),
            ])
            ->setRememberToken(Str::random(60));

        $user->save();

        // Sign out every other device; keep the current token.
        $user
            ->tokens()
            ->where('id', '!=', $user->currentAccessToken()?->id)
            ->delete();

        return response()->json([
            'message' => 'Your password has been changed successfully.',
        ]);
    }

    // ============ CURRENT USER ============

    /**
     * Return the authenticated ResQNow user.
     */
    public function user(
        Request $request
    ): UserResource {
        /** @var User $user */
        $user = $request->user();

        $user->load('profile');

        return new UserResource($user);
    }

    // ============ LOGOUT ============

    /**
     * Revoke the bearer token used for this request.
     */
    public function logout(
        Request $request
    ): JsonResponse {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Signed out successfully.',
        ]);
    }
}
