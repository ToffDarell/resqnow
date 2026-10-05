<?php

use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EvacuationCenterController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SosReportController;
use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\EnsureVerifiedAccount;
use Illuminate\Support\Facades\Route;


// ============ PUBLIC AUTH ROUTES ============

// Resident registration remains public.
Route::post(
    '/register',
    [AuthController::class, 'register']
)->middleware(
    'throttle:5,1'
);

// Shared ResQNow sign in.
Route::post(
    '/login',
    [AuthController::class, 'login']
)->middleware(
    'throttle:10,1'
);

// Password recovery.
Route::post(
    '/forgot-password',
    [AuthController::class, 'forgotPassword']
)->middleware(
    'throttle:5,1'
);

Route::post(
    '/reset-password',
    [AuthController::class, 'resetPassword']
)->middleware(
    'throttle:5,1'
);


// ============ LOGOUT ============
//
// Logout must still work even if an account
// becomes unverified after the session started.

Route::post(
    '/logout',
    [AuthController::class, 'logout']
)->middleware(
    'auth:sanctum'
);


// ============ VERIFIED AUTHENTICATED USERS ============

Route::middleware([
    'auth:sanctum',
    EnsureVerifiedAccount::class,
])->group(function () {

    // ============ CURRENT ACCOUNT ============

    // Shared across Resident, Responder and Admin.
    Route::get(
        '/user',
        [AuthController::class, 'user']
    );

    // Shared account-security endpoint.
    Route::post(
        '/change-password',
        [AuthController::class, 'changePassword']
    )->middleware(
        'throttle:5,1'
    );


    // ============ RESIDENT-ONLY ROUTES ============

    Route::middleware(
        EnsureRole::class .
        ':resident'
    )->group(function () {

        // Update resident profile.
        Route::put(
            '/profile',
            [
                ProfileController::class,
                'update',
            ]
        )->middleware(
            'throttle:10,1'
        );


        // Get resident reports.
        Route::get(
            '/reports',
            [
                ReportController::class,
                'index',
            ]
        );


        // One-swipe emergency SOS. Identity comes from Sanctum;
        // GPS is best-effort and the request is idempotent.
        Route::post(
            '/reports/sos',
            [
                SosReportController::class,
                'store',
            ]
        )->middleware(
            'throttle:6,1'
        );


        // Submit Emergency report.
        Route::post(
            '/reports/emergency',
            [
                ReportController::class,
                'storeEmergency',
            ]
        )->middleware(
            'throttle:10,1'
        );


        // Submit Non-Emergency report.
        Route::post(
            '/reports/non-emergency',
            [
                ReportController::class,
                'storeNonEmergency',
            ]
        )->middleware(
            'throttle:10,1'
        );


        // One Resident report.
        Route::get(
            '/reports/{reportCode}',
            [
                ReportController::class,
                'show',
            ]
        )->where(
            'reportCode',
            '^(EM|NE)-[0-9]{6}$'
        );

        // Cancel any resident-owned Emergency, Non-Emergency, or SOS report
        // while response is still pending / in progress.
        Route::patch(
            '/reports/{reportCode}/cancel',
            [
                ReportController::class,
                'cancel',
            ]
        )->where(
            'reportCode',
            '^(EM|NE)-[0-9]{6}$'
        )->middleware(
            'throttle:20,1'
        );


        // Resident in-app notifications.
        Route::get(
            '/notifications',
            [
                NotificationController::class,
                'index',
            ]
        );

        Route::patch(
            '/notifications/read-all',
            [
                NotificationController::class,
                'markAllRead',
            ]
        )->middleware(
            'throttle:30,1'
        );

        Route::get(
            '/notifications/{notificationId}',
            [
                NotificationController::class,
                'show',
            ]
        )->whereNumber(
            'notificationId'
        );

        Route::patch(
            '/notifications/{notificationId}/read',
            [
                NotificationController::class,
                'markRead',
            ]
        )->whereNumber(
            'notificationId'
        )->middleware(
            'throttle:60,1'
        );


        // Active barangay alerts and announcements.
        Route::get(
            '/announcements',
            [AnnouncementController::class, 'index']
        );

        Route::get(
            '/announcements/{announcement}',
            [AnnouncementController::class, 'show']
        )->whereNumber('announcement');

        // Published evacuation-center operational data.
        Route::get(
            '/evacuation-centers',
            [EvacuationCenterController::class, 'index']
        );
    });
});


// ============ CONTACT DIRECTORY ============

require __DIR__ . '/contacts.php';

// ============ RESPONDER API ============

require __DIR__ . '/responders.php';

// ============ ADMIN OPERATIONAL API ============

require __DIR__ . '/admin.php';
