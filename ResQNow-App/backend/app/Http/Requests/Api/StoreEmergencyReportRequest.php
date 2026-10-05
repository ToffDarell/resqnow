<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmergencyReportRequest extends FormRequest
{
    /**
     * Only a verified resident may submit
     * an emergency report.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null
            && $user->role === 'resident'
            && $user->account_status === 'Verified';
    }

    /**
     * Validate emergency report information.
     */
    public function rules(): array
    {
        return [
            // Emergency category selected by resident
            'concernCode' => [
                'required',
                'string',
                Rule::in([
                    'life-death',
                    'fire',
                    'medical',
                    'violence',
                    'flood',
                    'accident',
                    'evacuation',
                ]),
            ],

            // Actual emergency location
            'location' => [
                'required',
                'string',
                'max:1000',
            ],

            // Optional map coordinates
            'latitude' => [
                'nullable',
                'required_if:locationSource,gps',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'nullable',
                'required_if:locationSource,gps',
                'numeric',
                'between:-180,180',
            ],

            // How the incident location was selected.
            'locationSource' => [
                'nullable',
                'string',
                Rule::in([
                    'gps',
                    'saved',
                    'manual',
                ]),
            ],

            // Browser-reported GPS accuracy in meters.
            'locationAccuracy' => [
                'nullable',
                'required_if:locationSource,gps',
                'numeric',
                'min:0',
                'max:100000',
            ],

            // Time the GPS fix was captured on the device.
            'locationCapturedAt' => [
                'nullable',
                'required_if:locationSource,gps',
                'date',
            ],

            // Whether the resident is reporting
            // an emergency for another person
            'reportingForOther' => [
                'sometimes',
                'boolean',
            ],

            // Optional victim information
            'subjectName' => [
                'nullable',
                'string',
                'max:150',
            ],

            'subjectContact' => [
                'nullable',
                'string',
                'max:30',
                'regex:/^(09|\+639)\d{9}$/',
            ],

            // Optional emergency information
            'landmark' => [
                'nullable',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }

    /**
     * User-friendly validation messages.
     */
    public function messages(): array
    {
        return [
            'concernCode.required' =>
                'Please select the type of emergency.',

            'concernCode.in' =>
                'The selected emergency type is invalid.',

            'location.required' =>
                'Please provide the emergency location.',

            'location.max' =>
                'The emergency location is too long.',

            'latitude.between' =>
                'The latitude is invalid.',

            'longitude.between' =>
                'The longitude is invalid.',

            'latitude.required_if' =>
                'Current GPS latitude is missing. Please capture your location again.',

            'longitude.required_if' =>
                'Current GPS longitude is missing. Please capture your location again.',

            'locationSource.in' =>
                'The selected location method is invalid.',

            'locationAccuracy.required_if' =>
                'GPS accuracy is missing. Please capture your location again.',

            'locationCapturedAt.required_if' =>
                'GPS capture time is missing. Please capture your location again.',

            'reportingForOther.boolean' =>
                'The reporting option is invalid.',

            'subjectName.max' =>
                'The victim name is too long.',

            'subjectContact.regex' =>
                'Enter a valid Philippine mobile number.',

            'description.max' =>
                'The description must not exceed 2000 characters.',
        ];
    }
}
