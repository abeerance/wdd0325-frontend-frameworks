<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * PostgreSQL abandons a whole transaction once one statement in it fails, and
 * RefreshDatabase runs every test inside one. The refused insert here has to happen the
 * way it does in production, outside any transaction, so this test commits for real.
 */
class RegistrationRaceTest extends TestCase
{
    use DatabaseTruncation;

    /**
     * The trait empties the tables before each of its own tests. Every other test class
     * expects them empty too, so leave them that way.
     */
    protected function tearDown(): void
    {
        $this->truncateTablesForAllConnections();

        parent::tearDown();
    }

    public function test_two_registrations_racing_for_one_address_let_only_one_in(): void
    {
        // Another registration for the same address lands after the unique rule has
        // passed and before this one is saved.
        User::creating(function (User $user): void {
            DB::table('users')->insert([
                'name' => 'Someone Faster',
                'email' => $user->email,
                'password' => Hash::make('someone faster than ana'),
            ]);
        });

        $this->postJson('/api/register', [
            'name' => 'Ana Keller',
            'email' => 'ana@example.org',
            'password' => 'a row of runner beans',
            'password_confirmation' => 'a row of runner beans',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('errors.email.0', RegisterRequest::EMAIL_TAKEN);

        $this->assertDatabaseCount('users', 1);
        $this->assertGuest();
    }
}
