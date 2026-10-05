<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing
    |--------------------------------------------------------------------------
    |
    | React runs on localhost:5173 while Laravel
    | runs on localhost:8000 during development.
    |
    */

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => [
        '*',
    ],

    'allowed_origins' => [
        env(
            'FRONTEND_URL',
            'http://localhost:5173'
        ),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        '*',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    // Required for Laravel Sanctum cookies
    'supports_credentials' => true,

];
