<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\PersonnelController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/logout', [AuthController::class, 'logout']);

});


/*
|--------------------------------------------------------------------------
| Resident / Public Report Routes
|--------------------------------------------------------------------------
*/

// Resident can submit a report
Route::post('/reports', [ReportController::class, 'store']);


/*
|--------------------------------------------------------------------------
| Public Announcement Routes
|--------------------------------------------------------------------------
*/

// Residents/public users can view announcements
Route::get('/announcements', [AnnouncementController::class, 'index']);

Route::get(
    '/announcements/{announcement}',
    [AnnouncementController::class, 'show']
);

/*
|--------------------------------------------------------------------------
| Web Admin / Authenticated Operations Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Reports / Triage
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/reports/{report}/triage',
        [ReportController::class, 'assessTriage']
    )->middleware('permission:prioritization.manage');

    Route::get(
        '/reports',
        [ReportController::class, 'index']
    )->middleware('permission:reports.view');

    Route::get(
        '/reports/for-verification',
        [ReportController::class, 'forVerification']
    )->middleware('permission:verification.view');

    Route::patch(
        '/reports/{report}/verify',
        [ReportController::class, 'verify']
    )->middleware('permission:verification.manage');

    Route::patch(
        '/reports/{report}/return',
        [ReportController::class, 'returnForReview']
    )->middleware('permission:verification.manage');

    Route::get(
        '/reports/for-prioritization',
        [ReportController::class, 'forPrioritization']
    )->middleware('permission:prioritization.view');

    Route::patch(
        '/reports/{report}/priority',
        [ReportController::class, 'assignPriority']
    )->middleware('permission:prioritization.manage');


    /*
    |--------------------------------------------------------------------------
    | Residents
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/residents',
        [ResidentController::class, 'index']
    )->middleware('permission:residents.view');

    Route::patch(
        '/residents/{user}/verification',
        [ResidentController::class, 'updateVerification']
    )->middleware('permission:residents.manage');


    /*
    |--------------------------------------------------------------------------
    | System Settings
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/settings',
        [SystemSettingController::class, 'index']
    )->middleware('permission:settings.view');

    Route::put(
        '/settings',
        [SystemSettingController::class, 'update']
    )->middleware('permission:settings.manage');


    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {

        Route::get(
            '/notifications',
            [NotificationController::class, 'index']
        );

        Route::get(
            '/notifications/unread-count',
            [NotificationController::class, 'unreadCount']
        );

        Route::patch(
            '/notifications/{notification}/read',
            [NotificationController::class, 'markAsRead']
        );

        Route::patch(
            '/notifications/read-all',
            [NotificationController::class, 'markAllAsRead']
        );

    });


    /*
    |--------------------------------------------------------------------------
    | Personnel
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/personnel',
        [PersonnelController::class, 'index']
    )->middleware('permission:personnel.view');


    /*
    |--------------------------------------------------------------------------
    | Announcements Management
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/announcements',
        [AnnouncementController::class, 'store']
    )->middleware('permission:announcements.create');

    Route::put(
        '/announcements/{announcement}',
        [AnnouncementController::class, 'update']
    )->middleware('permission:announcements.edit');

    Route::patch(
        '/announcements/{announcement}/status',
        [AnnouncementController::class, 'updateStatus']
    )->middleware('permission:announcements.publish');

    Route::delete(
        '/announcements/{announcement}',
        [AnnouncementController::class, 'destroy']
    )->middleware('permission:announcements.archive');


    /*
    |--------------------------------------------------------------------------
    | Audit Logs
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/audit-logs',
        [AuditLogController::class, 'index']
    )->middleware('permission:audit.view');

    Route::post(
        '/audit-logs',
        [AuditLogController::class, 'store']
    )->middleware('permission:audit.view');


    /*
    |--------------------------------------------------------------------------
    | Incidents
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/incidents',
        [IncidentController::class, 'index']
    )->middleware('permission:map.view');

    Route::post(
        '/reports/{report}/create-incident',
        [IncidentController::class, 'storeFromReport']
    )->middleware('permission:reports.edit');

    Route::get(
        '/incidents/{incident}',
        [IncidentController::class, 'show']
    )->middleware('permission:map.view');

    Route::patch(
        '/incidents/{incident}/status',
        [IncidentController::class, 'updateStatus']
    )->middleware('permission:reports.edit');

    Route::patch(
        '/incidents/{incident}/assignment',
        [IncidentController::class, 'updateAssignment']
    )->middleware('permission:personnel.manage');

});


/*
|--------------------------------------------------------------------------
| ResQNow Mobile App (resident + responder) — /api/app/*
|--------------------------------------------------------------------------
| Same database and users as the web admin. Bearer-token (Sanctum) auth.
*/

Route::prefix('app')->group(base_path('routes/mobile/api.php'));
