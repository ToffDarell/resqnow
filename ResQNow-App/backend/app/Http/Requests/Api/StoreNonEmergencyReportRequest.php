<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNonEmergencyReportRequest extends FormRequest
{
    /**
     * Only a verified resident may submit
     * a non-emergency report.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null
            && $user->role === 'resident'
            && $user->account_status === 'Verified';
    }

    /**
     * Validate non-emergency report information.
     */
    public function rules(): array
    {
        return [
            // Selected non-emergency concern
            'concernCode' => [
                'required',
                'string',
                Rule::in([
                    'evac-assistance',
                    'bhw-assistance',
                    'road-obstruction',
                    'damaged-facility',
                    'cleanup',
                    'community-concern',
                    'other-assistance',
                ]),
            ],

            // Optional category-specific subcategory
            'subcategory' => [
                'nullable',
                'string',
                'max:150',
                Rule::in([
                    'Transportation',
                    'Temporary Shelter',
                    'Supplies',

                    'Health Check',
                    'Home Visit',
                    'Medicine Assistance',

                    'Fallen Tree / Branch',
                    'Debris Blocking Road',
                    'Vehicle / Object Blocking Road',
                    'Other Road Obstruction',

                    'Street Light',
                    'Road',
                    'Drainage',
                    'Barangay Facility',

                    'Waste Collection',
                    'Storm Debris / Branches',
                    'Drainage Clean-up',

                    'Sanitation',
                    'Noise',
                    'Stray Animals',
                    'Public Area',
                ]),
            ],

            // Myself or Another Person
            'reportingFor' => [
                'required',
                'string',
                Rule::in([
                    'Myself',
                    'Another Person',
                ]),
            ],

            // Optional information when reporting
            // for another person
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

            'relationshipNote' => [
                'nullable',
                'string',
                'max:150',
            ],

            // Incident purok
            'purok' => [
                'required',
                'string',
                Rule::in([
                    'Purok 1',
                    'Purok 2',
                    'Purok 3',
                ]),
            ],

            // Incident location
            'location' => [
                'required',
                'string',
                'max:1000',
            ],

            'landmark' => [
                'nullable',
                'string',
                'max:255',
            ],

            // Ready for future map pin integration
            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
            ],

            // Main report information
            'description' => [
                'required',
                'string',
                'max:3000',
            ],

            'requiredAssistance' => [
                'nullable',
                'string',
                'max:2000',
            ],

            // Optional vulnerable / affected groups
            'affectedIndividuals' => [
                'nullable',
                'array',
                'max:5',
            ],

            'affectedIndividuals.*' => [
                'string',
                Rule::in([
                    'Child',
                    'Senior Citizen',
                    'PWD',
                    'Pregnant Person',
                    'Injured Person',
                ]),
            ],

            // Optional photo evidence
            'photo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:5120',
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
                'Please select a concern type.',

            'concernCode.in' =>
                'The selected concern type is invalid.',

            'subcategory.in' =>
                'The selected subcategory is invalid.',

            'reportingFor.required' =>
                'Please specify who this report is for.',

            'reportingFor.in' =>
                'The reporting option is invalid.',

            'subjectName.max' =>
                'The person name is too long.',

            'subjectContact.regex' =>
                'Enter a valid Philippine mobile number.',

            'relationshipNote.max' =>
                'The relationship or note is too long.',

            'purok.required' =>
                'Please select the incident purok.',

            'purok.in' =>
                'The selected purok is invalid.',

            'location.required' =>
                'Please provide the incident location.',

            'location.max' =>
                'The incident location is too long.',

            'landmark.max' =>
                'The landmark is too long.',

            'latitude.between' =>
                'The latitude is invalid.',

            'longitude.between' =>
                'The longitude is invalid.',

            'description.required' =>
                'Please describe the concern.',

            'description.max' =>
                'The description must not exceed 3000 characters.',

            'requiredAssistance.max' =>
                'The assistance needed description is too long.',

            'affectedIndividuals.array' =>
                'The affected individuals selection is invalid.',

            'affectedIndividuals.max' =>
                'Too many affected individual categories were selected.',

            'affectedIndividuals.*.in' =>
                'One of the affected individual selections is invalid.',

            'photo.image' =>
                'The uploaded file must be an image.',

            'photo.mimes' =>
                'The photo must be a JPG or PNG image.',

            'photo.max' =>
                'The photo must not exceed 5 MB.',
        ];
    }
}
