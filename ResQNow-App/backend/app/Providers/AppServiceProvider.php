<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /**
         * Send password reset links to the React frontend
         * instead of expecting Laravel to render a reset page.
         */
        ResetPassword::createUrlUsing(
            function (
                $user,
                string $token
            ): string {
                $frontendUrl =
                    rtrim(
                        (string) config(
                            'app.frontend_url',
                            'http://localhost:5173'
                        ),
                        '/'
                    );

                $query =
                    http_build_query([
                        'token' =>
                            $token,

                        'email' =>
                            $user->getEmailForPasswordReset(),
                    ]);

                return
                    $frontendUrl .
                    '/reset-password?' .
                    $query;
            }
        );
    }
}
