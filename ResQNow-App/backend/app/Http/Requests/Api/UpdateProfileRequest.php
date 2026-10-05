<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Only an authenticated resident may update
     * their own resident profile.
     */
    public function authorize(): bool
    {
        return $this->user() !== null
            && $this->user()->role === 'resident';
    }

    /**
     * Validation rules for resident profile updates.
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

                Rule::unique(
                    'users',
                    'email'
                )->ignore(
                    $this->user()->id
                ),
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
            'fullName.required' =>
                'Enter your full name.',

            'fullName.min' =>
                'Your full name must contain at least 2 characters.',

            'contactNumber.required' =>
                'Enter your contact number.',

            'contactNumber.regex' =>
                'Enter a valid Philippine mobile number.',

            'email.required' =>
                'Enter your email address.',

            'email.email' =>
                'Enter a valid email address.',

            'email.unique' =>
                'An account with this email already exists.',

            'address.required' =>
                'Enter your address.',

            'purok.required' =>
                'Select your purok.',

            'householdCount.integer' =>
                'Household count must be a whole number.',

            'householdCount.min' =>
                'Household count must be at least 1.',

            'householdCount.max' =>
                'Household count cannot be greater than 100.',
        ];
    }
}
