<?php

use App\Http\Controllers\Api\EvacuationCenterController;
use App\Http\Controllers\Api\ResponderOperationsController;
use App\Http\Controllers\Api\ResponderReportController;
use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\EnsureVerifiedAccount;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Responder Routes
|--------------------------------------------------------------------------
|
| These endpoints are available only to:
|
| 1. Authenticated users
| 2. Verified accounts
| 3. Users whose stored role is "responder"
|
| ReportAccess performs the additional report-level check so a responder
| can retrieve or update only incidents currently assigned to that account.
|
*/

Route::prefix('responder')
    ->middleware([
        'auth:sanctum',
        EnsureVerifiedAccount::class,
        EnsureRole::class . ':responder',
        'throttle:120,1',
    ])
    ->group(function () {

        /*
         * Responder readiness / operational context.
         * Exact unassigned incident locations are intentionally not exposed.
         */
        Route::get(
            '/operations',
            [
                ResponderOperationsController::class,
                'show',
            ]
        );

        Route::post(
            '/duty-status',
            [
                ResponderOperationsController::class,
                'updateDutyStatus',
            ]
        )->middleware('throttle:30,1');

        /*
         * Published evacuation-center operational data for field routing.
         */
        Route::get(
            '/evacuation-centers',
            [
                EvacuationCenterController::class,
                'index',
            ]
        );

        /*
         * List reports currently assigned
         * to the authenticated responder.
         */
        Route::get(
            '/reports',
            [
                ResponderReportController::class,
                'index',
            ]
        );

        /*
         * Acknowledge the authenticated responder's
         * active assignment without changing the
         * report lifecycle status.
         */
        Route::post(
            '/reports/{reportCode}/acknowledge',
            [
                ResponderReportController::class,
                'acknowledge',
            ]
        )->where(
            'reportCode',
            '^(EM|NE)-[0-9]{6}$'
        );

        /*
         * Perform a server-authorized lifecycle action:
         * start, en-route, arrived, resolve.
         */
        Route::post(
            '/reports/{reportCode}/actions',
            [
                ResponderReportController::class,
                'action',
            ]
        )->where(
            'reportCode',
            '^(EM|NE)-[0-9]{6}$'
        );

        /*
         * Open one currently assigned report.
         */
        Route::get(
            '/reports/{reportCode}',
            [
                ResponderReportController::class,
                'show',
            ]
        )->where(
            'reportCode',
            '^(EM|NE)-[0-9]{6}$'
        );
    });
