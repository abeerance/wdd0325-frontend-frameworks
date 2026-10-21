<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seeding assumes empty tables. Run it twice and the unique names collide;
     * start again with `migrate:fresh --seed`.
     */
    public function run(): void
    {
        $this->call([
            MemberSeeder::class,
            VarietySeeder::class,
            PacketSeeder::class,
            BorrowingSeeder::class,
            HarvestNoteSeeder::class,
        ]);
    }
}
