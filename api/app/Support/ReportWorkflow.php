<?php

namespace App\Support;

use App\Models\Report;
use Illuminate\Validation\ValidationException;

class ReportWorkflow
{
    /**
     * Human-readable responder action labels.
     */
    public const ACTIONS = [
        'acknowledge' =>
            'Acknowledge assignment',

        'start' =>
            'Start response',

        'en-route' =>
            'Mark en route',

        'arrived' =>
            'Record arrival / response',

        'note' =>
            'Add field update',

        'support' =>
            'Request additional support',

        'unable-locate' =>
            'Request location assistance',

        'invalid-finding' =>
            'Request incident review',

        'resolve' =>
            'Resolve report',
    ];

    /**
     * Return actions currently allowed
     * for an assigned Responder.
     *
     * @return array<int, array<string, string>>
     */
    public static function actionsFor(
        Report $report,
        ?int $userId = null
    ): array {
        /*
         * Closed reports cannot receive any
         * further responder actions.
         */
        if (
            in_array(
                $report->status,
                [
                    'Resolved',
                    'Invalid',
                    'Cancelled',
                ],
                true
            )
        ) {
            return [];
        }

        /*
         * Find the responder's active assignment.
         */
        $assignment =
            $report
                ->activeAssignments()
                ->when(
                    $userId,
                    fn ($query) =>
                        $query->where(
                            'assigned_user_id',
                            $userId
                        )
                )
                ->first();

        /*
         * No active assignment means the user
         * cannot perform responder actions.
         */
        if (!$assignment) {
            return [];
        }

        /*
         * The responder must acknowledge the
         * assignment before performing any
         * operational action.
         */
        if (
            !$assignment->acknowledged_at
        ) {
            return [
                [
                    'value' =>
                        'acknowledge',

                    'label' =>
                        self::ACTIONS[
                            'acknowledge'
                        ],
                ],
            ];
        }

        /*
         * Primary lifecycle actions.
         */
        $nextActions =
            match ($report->status) {
                'Assigned' => [
                    'start',
                ],

                'In Progress' =>
                    $report->report_type ===
                    'Emergency'
                        ? [
                            'en-route',
                            'arrived',
                        ]
                        : [
                            'arrived',
                        ],

                'Responders En Route' => [
                    'arrived',
                ],

                'Responded' => [
                    'resolve',
                ],

                default => [],
            };

        /*
         * Secondary operational actions become
         * available only after acknowledgement.
         *
         * These actions do not directly advance
         * the report lifecycle.
         */
        $nextActions =
            array_merge(
                $nextActions,
                [
                    'note',
                    'support',
                    'unable-locate',
                    'invalid-finding',
                ]
            );

        return array_map(
            fn ($action) => [
                'value' =>
                    $action,

                'label' =>
                    self::ACTIONS[
                        $action
                    ],
            ],
            $nextActions
        );
    }

    /**
     * Determine the next lifecycle status
     * for a permitted responder action.
     */
    public static function nextStatus(
        Report $report,
        string $action,
        ?int $userId = null
    ): string {
        $allowedActions =
            array_column(
                self::actionsFor(
                    $report,
                    $userId
                ),
                'value'
            );

        if (
            !in_array(
                $action,
                $allowedActions,
                true
            )
        ) {
            throw ValidationException::withMessages([
                'action' => [
                    'This action is unavailable. Refresh the report and review its current state.',
                ],
            ]);
        }

        return match ($action) {
            'start' =>
                'In Progress',

            'en-route' =>
                'Responders En Route',

            'arrived' =>
                'Responded',

            'resolve' =>
                'Resolved',

            /*
             * Acknowledge, note, support,
             * unable-locate and invalid-finding
             * do not directly change lifecycle.
             */
            default =>
                $report->status,
        };
    }
}
