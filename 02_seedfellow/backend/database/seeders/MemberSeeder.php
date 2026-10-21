<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Two people with real passwords, so a sign-in can be demonstrated without a fixture.
     * The plaintext is hashed by the model's `hashed` cast.
     *
     * Both rows carry the day the library opened rather than the day the seeder ran:
     * `created_at` and `updated_at` are in the answer to a login, and a script quotes it.
     */
    private const JOINED_ON = '2026-01-12 09:00:00';

    public function run(): void
    {
        $joined = CarbonImmutable::parse(self::JOINED_ON);

        // `is_librarian` is deliberately not fillable, so no request can promote anyone.
        // The seeder is trusted code, and forceFill says out loud that it sets it anyway.
        (new User([
            'name' => 'Marit Frei',
            'email' => 'marit@example.org',
            'password' => 'seeds-in-the-post',
        ]))->forceFill([
            'is_librarian' => true,
            'created_at' => $joined,
            'updated_at' => $joined,
        ])->save();

        (new User([
            'name' => 'Tomas Rieder',
            'email' => 'tomas@example.org',
            'password' => 'correct horse battery staple',
        ]))->forceFill([
            'is_librarian' => false,
            'created_at' => $joined->addWeek(),
            'updated_at' => $joined->addWeek(),
        ])->save();
    }
}
