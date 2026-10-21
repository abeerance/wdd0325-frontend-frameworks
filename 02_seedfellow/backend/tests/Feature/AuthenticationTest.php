<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_member_signs_in_and_the_answer_is_the_member(): void
    {
        $member = User::factory()->create(['email' => 'tomas@example.org']);

        $this->postJson('/api/login', ['email' => 'tomas@example.org', 'password' => 'password'])
            ->assertOk()
            ->assertJsonPath('id', $member->id)
            ->assertJsonMissingPath('password');

        $this->assertAuthenticatedAs($member);
    }

    public function test_wrong_details_are_one_message_on_the_email_field(): void
    {
        User::factory()->create(['email' => 'tomas@example.org']);

        $this->postJson('/api/login', ['email' => 'tomas@example.org', 'password' => 'wrong'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Those details did not match.');

        $this->assertGuest();
    }

    public function test_an_unknown_email_says_exactly_the_same_thing(): void
    {
        $this->postJson('/api/login', ['email' => 'nobody@example.org', 'password' => 'password'])
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Those details did not match.');
    }

    public function test_signing_out_ends_the_session(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/logout')
            ->assertNoContent();

        $this->assertGuest();
    }

    public function test_the_current_member_is_behind_the_guard(): void
    {
        $this->getJson('/api/user')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Unauthenticated.');
    }
}
