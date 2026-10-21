<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Kind;
use App\Models\Variety;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

/**
 * @extends Factory<Variety>
 */
class VarietyFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'species' => fake()->words(2, true),
            'kind' => fake()->randomElement(Kind::cases()),
            'story' => fake()->paragraph(),
            'sowing_months' => [3, 4],
            'photo_path' => null,
            'photo_version' => null,
            'photo_credit' => null,
            'retired_at' => null,
        ];
    }

    public function retired(): static
    {
        return $this->state(fn (): array => ['retired_at' => now()]);
    }

    /**
     * A photograph on the default disk, which a test fakes first. Its bytes are random,
     * so two models made with it never share a version.
     */
    public function withPhoto(): static
    {
        return $this->state(function (): array {
            $photo = UploadedFile::fake()->createWithContent('photo.jpg', Str::random(64));

            return [
                'photo_path' => $photo->store('varieties'),
                'photo_version' => Variety::photoVersion($photo->getRealPath()),
            ];
        });
    }
}
