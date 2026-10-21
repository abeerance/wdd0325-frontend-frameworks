<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use App\Models\Variety;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RateLimitTest extends TestCase
{
    use RefreshDatabase;

    private const ADDRESS = '203.0.113.7';

    protected function setUp(): void
    {
        parent::setUp();

        // Every request in these tests leaves from one address, the way every request a
        // frontend makes from its own server does.
        $this->withServerVariables(['REMOTE_ADDR' => self::ADDRESS]);
    }

    public function test_each_signed_in_member_has_an_allowance_of_their_own(): void
    {
        [$marit, $tomas] = User::factory()->count(2)->create();

        $this->spend(60, fn () => $this->actingAs($marit)->getJson('/api/user')->assertOk());

        $this->actingAs($marit)->getJson('/api/user')->assertTooManyRequests();
        $this->actingAs($tomas)->getJson('/api/user')
            ->assertOk()
            ->assertHeader('X-RateLimit-Remaining', '59');
    }

    public function test_a_visitor_without_a_session_is_counted_by_address(): void
    {
        $this->spend(60, fn () => $this->getJson('/api/varieties')->assertOk());

        $this->getJson('/api/varieties')->assertTooManyRequests();

        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.8'])
            ->getJson('/api/varieties')
            ->assertOk()
            ->assertHeader('X-RateLimit-Remaining', '59');
    }

    public function test_visitors_on_an_address_do_not_use_up_a_members_allowance(): void
    {
        $this->spend(60, fn () => $this->getJson('/api/varieties')->assertOk());
        $this->getJson('/api/varieties')->assertTooManyRequests();

        $this->actingAs(User::factory()->create())
            ->getJson('/api/varieties')
            ->assertOk()
            ->assertHeader('X-RateLimit-Remaining', '59');
    }

    public function test_photographs_draw_on_their_own_allowance(): void
    {
        Storage::fake();
        $variety = Variety::factory()->withPhoto()->create();

        $this->spend(60, fn () => $this->getJson('/api/varieties')->assertOk());
        $this->getJson('/api/varieties')->assertTooManyRequests();

        $this->get("/api/varieties/{$variety->id}/photo")
            ->assertOk()
            ->assertHeader('X-RateLimit-Limit', '600')
            ->assertHeader('X-RateLimit-Remaining', '599');
    }

    private function spend(int $requests, callable $request): void
    {
        for ($i = 0; $i < $requests; $i++) {
            $request();
        }
    }
}
