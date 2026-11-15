<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_member_signs_in_and_the_answer_is_a_token_and_the_member(): void
    {
        $member = User::factory()->create(['email' => 'tomas@example.org']);

        $answer = $this->postJson('/api/login', ['email' => 'tomas@example.org', 'password' => 'password'])
            ->assertOk()
            ->assertJsonPath('member.id', $member->id)
            ->assertJsonMissingPath('member.password')
            ->assertJsonStructure(['token', 'expires_at', 'member']);

        // Nothing is signed in on this side: the token is all the member has.
        $this->assertGuest();

        $this->assertEqualsWithDelta(
            now()->addMinutes(10080)->timestamp,
            PersonalAccessToken::sole()->expires_at->timestamp,
            5,
        );

        $this->withToken($answer->json('token'))
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('id', $member->id);
    }

    public function test_wrong_details_are_one_message_on_the_email_field(): void
    {
        User::factory()->create(['email' => 'tomas@example.org']);

        $this->postJson('/api/login', ['email' => 'tomas@example.org', 'password' => 'wrong'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Those details did not match.');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_an_unknown_email_says_exactly_the_same_thing(): void
    {
        $this->postJson('/api/login', ['email' => 'nobody@example.org', 'password' => 'password'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Those details did not match.');
    }

    public function test_signing_out_deletes_the_token_and_the_next_request_is_refused(): void
    {
        $member = User::factory()->create();
        $token = $member->createToken('frontend')->plainTextToken;

        $this->withToken($token)->postJson('/api/logout')->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        // The guard keeps the member it resolved last, as a long-lived process would not.
        Auth::forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertUnauthorized();
    }

    public function test_signing_out_only_ends_the_token_it_was_sent_with(): void
    {
        $member = User::factory()->create();
        $phone = $member->createToken('phone')->plainTextToken;
        $member->createToken('laptop');

        $this->withToken($phone)->postJson('/api/logout')->assertNoContent();

        $this->assertSame(['laptop'], $member->tokens()->pluck('name')->all());
    }

    public function test_signing_out_without_a_token_is_refused(): void
    {
        $this->postJson('/api/logout')->assertUnauthorized();
    }

    public function test_an_expired_token_is_refused(): void
    {
        $token = User::factory()->create()
            ->createToken('frontend', ['*'], now()->subMinute())
            ->plainTextToken;

        $this->withToken($token)->getJson('/api/user')->assertUnauthorized();
    }

    public function test_a_cookie_is_not_a_way_in(): void
    {
        $this->actingAs(User::factory()->create())
            ->getJson('/api/user')
            ->assertUnauthorized();
    }

    public function test_a_login_with_something_other_than_text_is_a_validation_refusal(): void
    {
        $this->postJson('/api/login', ['email' => [], 'password' => 'wrong'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->postJson('/api/login', ['email' => ['tomas@example.org'], 'password' => ['x']])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);

        $this->postJson('/api/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_the_current_member_is_behind_the_guard(): void
    {
        $this->getJson('/api/user')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Unauthenticated.');
    }

    public function test_logging_in_has_an_allowance_counted_by_the_address_typed(): void
    {
        User::factory()->create(['email' => 'tomas@example.org']);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', ['email' => 'Tomas@Example.org', 'password' => 'wrong'])
                ->assertUnprocessable();
        }

        $this->postJson('/api/login', ['email' => 'tomas@example.org', 'password' => 'password'])
            ->assertTooManyRequests()
            ->assertHeader('Retry-After');

        // Another address, from the same sender, still has its own.
        $this->postJson('/api/login', ['email' => 'nobody@example.org', 'password' => 'wrong'])
            ->assertUnprocessable();
    }
}
