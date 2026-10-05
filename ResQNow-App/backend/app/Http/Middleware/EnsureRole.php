<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Allow the request only when the authenticated
     * user has one of the permitted roles.
     */
    public function handle(
        Request $request,
        Closure $next,
        string ...$roles
    ): Response {
        $user = $request->user();

        abort_unless(
            $user &&
            in_array(
                $user->role,
                $roles,
                true
            ),
            403,
            'Your account does not have access to this action.'
        );

        return $next(
            $request
        );
    }
}
