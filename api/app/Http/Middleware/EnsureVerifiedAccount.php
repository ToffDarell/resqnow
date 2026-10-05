<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureVerifiedAccount
{
    /**
     * Operational ResQNow APIs require an account
     * currently authorized by the barangay.
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $user =
            $request->user();

        abort_unless(
            $user &&
            $user->account_status ===
                'Verified',
            403,
            'Your account is not currently authorized. Please contact the barangay.'
        );

        return $next(
            $request
        );
    }
}
