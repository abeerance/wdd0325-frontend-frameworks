<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // SQLite's lower() folds ASCII capitals only, so "Épeautre" would never match a search
        // lowered by PHP. PostgreSQL lowers every script; this gives SQLite the same behaviour.
        Event::listen(ConnectionEstablished::class, function (ConnectionEstablished $event): void {
            // `composer install` boots the app before the database file exists, and opening the
            // connection then would fail. The first connection after the file exists gets the function.
            $database = (string) $event->connection->getConfig('database');
            if ($event->connection->getDriverName() !== 'sqlite' || ($database !== ':memory:' && ! is_file($database))) {
                return;
            }

            $pdo = $event->connection->getPdo();
            $lower = fn (?string $value): ?string => $value === null ? null : mb_strtolower($value);
            method_exists($pdo, 'createFunction')
                ? $pdo->createFunction('lower', $lower, 1)
                : $pdo->sqliteCreateFunction('lower', $lower, 1);
        });

        // A signed-in member has an allowance of their own, wherever they connect from. A
        // frontend that calls the API from its server sends every member from one address,
        // and keying by address would make them all share a single bucket. The default guard
        // is the session one, which never sees a token, so ask the token guard.
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by(
            $request->user('sanctum') ? 'member:'.$request->user('sanctum')->getAuthIdentifier() : 'address:'.$request->ip(),
        ));

        // Guessing passwords is guessing one address's password, however many machines do
        // it, so a login is counted by the address typed. Nothing in front of this API
        // vouches for who sent a request, so the sender's own address is not a safe key.
        // Anything that is not text has no address to count, and validation refuses it right
        // after, so it shares one allowance of its own instead of failing here.
        RateLimiter::for('login', function (Request $request) {
            $email = $request->input('email');

            return Limit::perMinute(5)->by('login:'.(is_string($email) ? Str::lower($email) : ''));
        });

        // Photographs carry no session, so the address is all there is to key on. The
        // allowance is ten times the api one: a cold catalogue page asks for a picture per
        // card, and an image optimiser asks again for every width it serves.
        RateLimiter::for('photos', fn (Request $request) => Limit::perMinute(600)->by($request->ip()));

        // Every registration that gets through writes a member, so the allowance is a sixth of
        // the api one: plenty for a person who mistypes, too few to fill the table. Until the
        // request succeeds there is no member to count it by, and the frontend's server is
        // the address every visitor arrives from, so this allowance is shared by all of them.
        RateLimiter::for('register', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));

        // Length is what makes a password hard to guess. Production also turns away a
        // password already published in a breach; that check asks api.pwnedpasswords.com,
        // and development and the tests have to work without a network.
        Password::defaults(fn () => $this->app->isProduction()
            ? Password::min(12)->uncompromised()
            : Password::min(12));
    }
}
