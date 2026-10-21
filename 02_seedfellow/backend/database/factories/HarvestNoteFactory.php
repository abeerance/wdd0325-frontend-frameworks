<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Borrowing;
use App\Models\HarvestNote;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

/**
 * @extends Factory<HarvestNote>
 */
class HarvestNoteFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'borrowing_id' => Borrowing::factory()->returned(),
            'body' => fake()->paragraph(),
            'seeds_sown' => 20,
            'seeds_germinated' => 15,
            'photo_path' => null,
            'photo_version' => null,
        ];
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
                'photo_path' => $photo->store('harvest-notes'),
                'photo_version' => HarvestNote::photoVersion($photo->getRealPath()),
            ];
        });
    }
}
