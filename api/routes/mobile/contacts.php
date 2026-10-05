<?php

use App\Http\Controllers\Mobile\ContactDirectoryController;
use Illuminate\Support\Facades\Route;

// Contact directory endpoint
Route::get(
    '/contacts',
    ContactDirectoryController::class
)->middleware('auth:sanctum');
