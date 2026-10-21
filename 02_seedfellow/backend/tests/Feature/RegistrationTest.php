<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Contracts\Encryption\Encrypter;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    private const ADDRESS = '203.0.113.7';

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function ana(array $overrides = []): array
    {
        return [
            'name' => 'Ana Keller',
            'email' => 'ana@example.org',
            'password' => 'a row of runner beans',
            'password_confirmation' => 'a row of runner beans',
            ...$overrides,
        ];
    }

    public function test_a_new_member_registers_and_is_signed_in(): void
    {
        $answer = $this->postJson('/api/register', $this->ana())
            ->assertCreated()
            ->assertJsonPath('name', 'Ana Keller')
            ->assertJsonPath('email', 'ana@example.org')
            ->assertJsonPath('is_librarian', false)
            ->assertJsonMissingPath('password');

        $member = User::where('email', 'ana@example.org')->sole();
        $this->assertAuthenticatedAs($member);
        $this->assertTrue(Hash::check('a row of runner beans', $member->password));

        // Forget the member this process is holding, so the next request has only the
        // session cookie to go on, as the browser's next request would.
        $this->app['auth']->forgetGuards();

        // The same member, in the same shape, as the session answers for from now on.
        $this->getJson('/api/user')
            ->assertOk()
            ->assertExactJson($answer->json());
    }

    public function test_the_address_is_stored_in_lower_case_and_signs_in_in_any_case(): void
    {
        $this->postJson('/api/register', $this->ana(['name' => '  Ana Keller  ', 'email' => 'Ana@Example.org']))
            ->assertCreated()
            ->assertJsonPath('name', 'Ana Keller')
            ->assertJsonPath('email', 'ana@example.org');

        $this->postJson('/api/logout')->assertNoContent();
        $this->assertGuest();

        $this->postJson('/api/login', ['email' => 'Ana@Example.org', 'password' => 'a row of runner beans'])
            ->assertOk()
            ->assertJsonPath('email', 'ana@example.org');
    }

    public function test_an_address_already_on_file_is_refused_in_any_case(): void
    {
        User::factory()->create(['email' => 'tomas@example.org']);

        $this->postJson('/api/register', $this->ana(['email' => 'Tomas@Example.org']))
            ->assertUnprocessable()
            ->assertJsonPath('message', RegisterRequest::EMAIL_TAKEN)
            ->assertJsonPath('errors.email.0', RegisterRequest::EMAIL_TAKEN);

        $this->assertDatabaseCount('users', 1);
        $this->assertGuest();
    }

    public function test_a_short_password_is_refused(): void
    {
        $this->postJson('/api/register', $this->ana(['password' => 'beans', 'password_confirmation' => 'beans']))
            ->assertUnprocessable()
            ->assertJsonPath('errors.password.0', 'The password field must be at least 12 characters.');

        $this->assertDatabaseCount('users', 0);
    }

    public function test_a_password_that_does_not_match_its_confirmation_is_refused(): void
    {
        $this->postJson('/api/register', $this->ana(['password_confirmation' => 'a row of broad beans']))
            ->assertUnprocessable()
            ->assertJsonPath('errors.password.0', 'The password field confirmation does not match.');

        $this->assertDatabaseCount('users', 0);
    }

    public function test_every_missing_field_is_named(): void
    {
        $this->postJson('/api/register', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_nobody_registers_themselves_a_librarian(): void
    {
        $this->postJson('/api/register', $this->ana(['is_librarian' => true]))
            ->assertCreated()
            ->assertJsonPath('is_librarian', false);

        $this->assertFalse(User::where('email', 'ana@example.org')->sole()->is_librarian);
    }

    public function test_a_signed_in_member_is_refused_before_anything_is_checked(): void
    {
        $tomas = User::factory()->create();

        $this->actingAs($tomas)
            ->postJson('/api/register', [])
            ->assertForbidden()
            ->assertJsonPath('message', 'You are already signed in. Log out before registering someone new.');

        $this->assertDatabaseCount('users', 1);
        $this->assertAuthenticatedAs($tomas);
    }

    public function test_a_registration_from_outside_the_allowed_origins_gets_no_session_and_no_member(): void
    {
        $this->withoutHeader('Origin')
            ->postJson('/api/register', $this->ana())
            ->assertBadRequest()
            ->assertJsonPath('message', 'A registration needs a session, and this request was not given one. Send it from an allowed origin.');

        $this->assertDatabaseCount('users', 0);
    }

    public function test_a_registration_without_the_csrf_token_is_refused(): void
    {
        // The CSRF check stands aside while tests run. Put it back for this one request,
        // and nothing else about the application changes.
        $this->app->bind(ValidateCsrfToken::class, fn (Application $app) => new class($app, $app->make(Encrypter::class)) extends ValidateCsrfToken
        {
            protected function runningUnitTests(): bool
            {
                return false;
            }
        });

        $this->postJson('/api/register', $this->ana())
            ->assertStatus(419)
            ->assertJsonPath('message', 'CSRF token mismatch.');

        $this->assertDatabaseCount('users', 0);
        $this->assertGuest();
    }

    public function test_registering_has_an_allowance_of_its_own_counted_by_address(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => self::ADDRESS]);

        // Refused attempts count too, and they write nothing, which keeps this quick.
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/register', [])
                ->assertUnprocessable()
                ->assertHeader('X-RateLimit-Limit', '10');
        }

        $this->postJson('/api/register', $this->ana())
            ->assertTooManyRequests()
            ->assertHeader('Retry-After');

        // The allowance is separate from the api one, which the same address still has whole.
        $this->getJson('/api/varieties')
            ->assertOk()
            ->assertHeader('X-RateLimit-Remaining', '59');

        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.8'])
            ->postJson('/api/register', $this->ana())
            ->assertCreated()
            ->assertHeader('X-RateLimit-Remaining', '9');
    }
}
