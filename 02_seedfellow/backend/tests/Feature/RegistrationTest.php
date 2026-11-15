<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Http\Requests\RegisterRequest;
use App\Models\User;
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

    public function test_a_new_member_registers_and_is_handed_a_token(): void
    {
        $answer = $this->postJson('/api/register', $this->ana())
            ->assertCreated()
            ->assertJsonPath('member.name', 'Ana Keller')
            ->assertJsonPath('member.email', 'ana@example.org')
            ->assertJsonPath('member.is_librarian', false)
            ->assertJsonMissingPath('member.password')
            ->assertJsonStructure(['token', 'expires_at', 'member']);

        $member = User::where('email', 'ana@example.org')->sole();
        $this->assertTrue(Hash::check('a row of runner beans', $member->password));

        // The same member, in the same shape, as the token answers for from now on.
        $this->withToken($answer->json('token'))
            ->getJson('/api/user')
            ->assertOk()
            ->assertExactJson($answer->json('member'));
    }

    public function test_the_address_is_stored_in_lower_case_and_signs_in_in_any_case(): void
    {
        $this->postJson('/api/register', $this->ana(['name' => '  Ana Keller  ', 'email' => 'Ana@Example.org']))
            ->assertCreated()
            ->assertJsonPath('member.name', 'Ana Keller')
            ->assertJsonPath('member.email', 'ana@example.org');

        $this->postJson('/api/login', ['email' => 'Ana@Example.org', 'password' => 'a row of runner beans'])
            ->assertOk()
            ->assertJsonPath('member.email', 'ana@example.org');
    }

    public function test_an_address_already_on_file_is_refused_in_any_case(): void
    {
        User::factory()->create(['email' => 'tomas@example.org']);

        $this->postJson('/api/register', $this->ana(['email' => 'Tomas@Example.org']))
            ->assertUnprocessable()
            ->assertJsonPath('message', RegisterRequest::EMAIL_TAKEN)
            ->assertJsonPath('errors.email.0', RegisterRequest::EMAIL_TAKEN);

        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('personal_access_tokens', 0);
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
            ->assertJsonPath('member.is_librarian', false);

        $this->assertFalse(User::where('email', 'ana@example.org')->sole()->is_librarian);
    }

    public function test_a_signed_in_member_is_refused_before_anything_is_checked(): void
    {
        $tomas = User::factory()->create();

        $this->actingAs($tomas, 'sanctum')
            ->postJson('/api/register', [])
            ->assertForbidden()
            ->assertJsonPath('message', 'You are already signed in. Log out before registering someone new.');

        $this->assertDatabaseCount('users', 1);
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
