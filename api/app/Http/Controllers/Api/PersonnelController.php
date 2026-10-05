<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personnel;
use Illuminate\Http\JsonResponse;

class PersonnelController extends Controller
{
    /**
     * Display all personnel.
     */
    public function index(): JsonResponse
    {
        $personnel = Personnel::latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Personnel retrieved successfully.',
            'data' => $personnel,
        ]);
    }
}