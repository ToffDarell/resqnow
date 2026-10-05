<?php

use App\Http\Controllers\Api\AdminAnnouncementController;
use App\Http\Controllers\Api\AdminEvacuationCenterController;
use App\Http\Middleware\EnsureRole;
use App\Http\Middleware\EnsureVerifiedAccount;
use Illuminate\Support\Facades\Route;

Route::middleware([
    'auth:sanctum',
    EnsureVerifiedAccount::class,
    EnsureRole::class . ':admin',
    'throttle:60,1',
])->prefix('admin')->group(function () {
    Route::get(
        '/announcements',
        [AdminAnnouncementController::class, 'index']
    );

    Route::post(
        '/announcements',
        [AdminAnnouncementController::class, 'store']
    );

    Route::patch(
        '/announcements/{announcement}',
        [AdminAnnouncementController::class, 'update']
    )->whereNumber('announcement');

    Route::get(
        '/evacuation-centers',
        [AdminEvacuationCenterController::class, 'index']
    );

    Route::post(
        '/evacuation-centers',
        [AdminEvacuationCenterController::class, 'store']
    );

    Route::patch(
        '/evacuation-centers/{evacuationCenter}',
        [AdminEvacuationCenterController::class, 'update']
    )->whereNumber('evacuationCenter');
});
