<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CancelReportRequest extends FormRequest
{
    /**
     * Authentication / role authorization is enforced by the route middleware.
     * Ownership is checked again inside ReportController using request()->user().
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'reason' => [
                'required',
                'string',
                'in:safe_now,accidental,help_elsewhere,duplicate,issue_resolved,no_longer_needed,other',
            ],

            'remarks' => [
                'nullable',
                'string',
                'max:500',
                'required_if:reason,other',
            ],

            // Prevent a stale report screen from cancelling a newer state.
            'expectedVersion' => [
                'required',
                'integer',
                'min:1',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reason.required' => 'Please select why you are cancelling this report.',
            'reason.in' => 'The selected cancellation reason is invalid.',
            'remarks.required_if' => 'Please briefly explain the cancellation reason.',
            'remarks.max' => 'Cancellation remarks may not exceed 500 characters.',
            'expectedVersion.required' => 'Refresh the report before cancelling it.',
        ];
    }
}
