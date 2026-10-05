<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreSosReportRequest extends FormRequest
{
    /**
     * Only a verified resident may trigger SOS.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null
            && $user->role === 'resident'
            && $user->account_status === 'Verified';
    }

    /**
     * GPS is best-effort. SOS remains valid when
     * location is missing, denied, or times out.
     */
    public function rules(): array
    {
        return [
            'location' => [
                'nullable',
                'array',
            ],

            'location.latitude' => [
                'nullable',
                'required_with:location.longitude',
                'numeric',
                'between:-90,90',
            ],

            'location.longitude' => [
                'nullable',
                'required_with:location.latitude',
                'numeric',
                'between:-180,180',
            ],

            'location.accuracy' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100000',
            ],

            'location.capturedAt' => [
                'nullable',
                'date',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'location.latitude.between' =>
                'The captured SOS latitude is invalid.',

            'location.longitude.between' =>
                'The captured SOS longitude is invalid.',

            'location.latitude.required_with' =>
                'The captured SOS location is incomplete.',

            'location.longitude.required_with' =>
                'The captured SOS location is incomplete.',
        ];
    }
}
