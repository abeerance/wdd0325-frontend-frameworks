<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Borrowing;
use App\Models\Packet;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Borrowing>
 */
class BorrowingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'packet_id' => Packet::factory()->borrowed(),
            'user_id' => User::factory(),
            'borrowed_on' => today()->subMonths(2),
            'due_on' => today()->addMonths(4),
            'returned_on' => null,
        ];
    }

    public function returned(): static
    {
        return $this->state(fn (): array => ['returned_on' => today()->subWeek()]);
    }
}
