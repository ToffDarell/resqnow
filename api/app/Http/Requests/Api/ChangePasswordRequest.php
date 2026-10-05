<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ChangePasswordRequest extends FormRequest
{
    /**
     * Only authenticated users may change their password.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Validation rules for changing a password.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'currentPassword' => [
                'required',
                'string',
            ],

            'password' => [
                'required',
                'confirmed',

                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
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
            'currentPassword.required' =>
                'Enter your current password.',

            'password.required' =>
                'Enter your new password.',

            'password.confirmed' =>
                'The password confirmation does not match.',
        ];
    }
}
