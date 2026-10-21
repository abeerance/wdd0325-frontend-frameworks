<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // A signed-in member has an allowance of their own, wherever they connect from. A
        // frontend that calls the API from its server sends every member from one address,
        // and keying by address would make them all share a single bucket.
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by(
            $request->user() ? 'member:'.$request->user()->getAuthIdentifier() : 'address:'.$request->ip(),
        ));

        // Photographs carry no session, so the address is all there is to key on. The
        // allowance is ten times the api one: a cold catalogue page asks for a picture per
        // card, and an image optimiser asks again for every width it serves.
        RateLimiter::for('photos', fn (Request $request) => Limit::perMinute(600)->by($request->ip()));

        // Every registration that gets through writes a member, so an address gets a sixth
        // of the api allowance: plenty for a person who mistypes, too few to fill the table.
        RateLimiter::for('register', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));

        // Length is what makes a password hard to guess. Production also turns away a
        // password already published in a breach; that check asks api.pwnedpasswords.com,
        // and development and the tests have to work without a network.
        Password::defaults(fn () => $this->app->isProduction()
            ? Password::min(12)->uncompromised()
            : Password::min(12));
    }
}
