<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    /**
     * Anyone may request password reset instructions.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for forgot password.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                'max:255',
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
            'email.required' =>
                'Enter your email address.',

            'email.email' =>
                'Enter a valid email address.',
        ];
    }
}
