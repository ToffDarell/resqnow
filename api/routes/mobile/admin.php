<?php

use App\Http\Controllers\Mobile\AdminEvacuationCenterController;
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
