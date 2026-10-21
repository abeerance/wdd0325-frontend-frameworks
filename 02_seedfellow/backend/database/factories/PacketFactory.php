<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PacketStatus;
use App\Models\Packet;
use App\Models\Variety;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Packet>
 */
class PacketFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'variety_id' => Variety::factory(),
            'status' => PacketStatus::InStock,
        ];
    }

    public function borrowed(): static
    {
        return $this->state(fn (): array => ['status' => PacketStatus::Borrowed]);
    }
}
