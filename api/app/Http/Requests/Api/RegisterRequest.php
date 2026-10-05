<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Anyone may access resident registration.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for resident registration.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'fullName' => [
                'required',
                'string',
                'min:2',
                'max:150',
            ],

            'contactNumber' => [
                'required',
                'string',
                'regex:/^(09|\+639)\d{9}$/',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'address' => [
                'required',
                'string',
                'max:1000',
            ],

            'purok' => [
                'required',
                'string',
                'max:100',
            ],

            'password' => [
                'required',
                'confirmed',

                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],

            'householdCount' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],

            'householdProfile' => [
                'nullable',
                'array',
            ],

            'householdProfile.hasSeniorCitizen' => [
                'nullable',
                'boolean',
            ],

            'householdProfile.hasChild' => [
                'nullable',
                'boolean',
            ],

            'householdProfile.hasPWD' => [
                'nullable',
                'boolean',
            ],

            'householdProfile.hasPregnantPerson' => [
                'nullable',
                'boolean',
            ],

            'emergencyContactName' => [
                'nullable',
                'string',
                'max:150',
            ],

            'emergencyContactNumber' => [
                'nullable',
                'string',
                'regex:/^(09|\+639)\d{9}$/',
            ],

            'homeLatitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],

            'homeLongitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
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
            'contactNumber.regex' =>
                'Enter a valid Philippine mobile number.',

            'email.unique' =>
                'An account with this email already exists.',

            'password.confirmed' =>
                'The password confirmation does not match.',
        ];
    }
}
