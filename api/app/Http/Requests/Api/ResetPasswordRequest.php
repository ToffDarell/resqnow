<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
{
    /**
     * Anyone with a valid reset token may reset a password.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for password reset.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'token' => [
                'required',
                'string',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'password' => [
                'required',
                'confirmed',

                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],

            /*
             * Give the confirmation field its own rule
             * so it is included in validated().
             */
            'password_confirmation' => [
                'required',
                'string',
            ],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'token.required' =>
                'The password reset token is required.',

            'email.required' =>
                'Enter your email address.',

            'email.email' =>
                'Enter a valid email address.',

            'password.required' =>
                'Enter a new password.',

            'password.confirmed' =>
                'The password confirmation does not match.',

            'password_confirmation.required' =>
                'Confirm your new password.',
        ];
    }
}
