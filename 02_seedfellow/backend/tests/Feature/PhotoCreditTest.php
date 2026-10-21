<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Borrowing;
use App\Models\Packet;
use App\Models\User;
use App\Models\Variety;
use App\ValueObjects\PhotoCredit;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class PhotoCreditTest extends TestCase
{
    use RefreshDatabase;

    private const CREDIT = [
        'author' => 'Ermell',
        'licence' => 'CC BY-SA 4.0',
        'source_url' => 'https://commons.wikimedia.org/wiki/File:Dill_Bluete_7080848-PSD-2.jpg',
        'modified' => false,
    ];

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake();
    }

    /**
     * credits.md is where the attribution was researched; the seeder carries a copy. Every
     * row of one has to match the other exactly, or a photograph is shown under somebody
     * else's name.
     */
    public function test_every_seeded_credit_matches_the_credits_file(): void
    {
        $this->seed();

        $expected = $this->creditsFile();
        $this->assertCount(28, $expected);

        $seeded = Variety::query()->orderBy('id')->get();
        $this->assertCount(28, $seeded);

        foreach ($seeded as $variety) {
            $slug = Str::slug($variety->name);

            $this->assertArrayHasKey($slug, $expected, "{$variety->name} has no row in credits.md");
            $this->assertSame($expected[$slug], $variety->photo_credit?->jsonSerialize(), "{$variety->name} is credited wrongly");
            $this->assertSame(Variety::photoVersion(database_path("seeders/photos/{$slug}.jpg")), $variety->photo_version);
        }

        $modified = $seeded->filter(fn (Variety $variety): bool => $variety->photo_credit->modified)->pluck('name')->all();
        $this->assertSame(['Berner Rose', 'Chioggia'], $modified);
    }

    /**
     * The seeder writes its rows without a request, so nothing has checked them against the
     * rules a librarian's edit must pass. Sending each one back through that edit does.
     */
    public function test_every_seeded_credit_passes_the_rules_a_librarian_edit_must(): void
    {
        $this->seed();
        $marit = User::query()->where('email', 'marit@example.org')->sole();

        foreach (Variety::query()->orderBy('id')->get() as $variety) {
            $credit = $variety->photo_credit->jsonSerialize();

            $this->actingAs($marit)
                ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => $credit])
                ->assertOk()
                ->assertJsonPath('data.photo_credit', $credit);
        }
    }

    public function test_the_credit_is_on_the_variety_and_on_its_summary(): void
    {
        $member = User::factory()->create();
        $variety = Variety::factory()->withPhoto()->create(['photo_credit' => self::CREDIT]);
        Borrowing::factory()->for($member)->for(Packet::factory()->borrowed()->for($variety))->create();

        $this->getJson("/api/varieties/{$variety->id}")
            ->assertOk()
            ->assertJsonPath('data.photo_credit', self::CREDIT);

        $this->getJson('/api/varieties')
            ->assertOk()
            ->assertJsonPath('data.0.photo_credit', self::CREDIT);

        $this->actingAs($member)
            ->getJson('/api/borrowings')
            ->assertOk()
            ->assertJsonPath('data.0.variety.photo_credit', self::CREDIT);
    }

    public function test_a_librarian_records_corrects_and_clears_a_credit(): void
    {
        $librarian = User::factory()->librarian()->create();
        $variety = Variety::factory()->withPhoto()->create();

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => self::CREDIT])
            ->assertOk()
            ->assertJsonPath('data.photo_credit', self::CREDIT);

        // A multipart form or a query string sends the flag as "1"; the answer is a boolean.
        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => [...self::CREDIT, 'modified' => '1']])
            ->assertOk()
            ->assertJsonPath('data.photo_credit.modified', true);

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => null])
            ->assertOk()
            ->assertJsonPath('data.photo_credit', null);

        $this->assertNull($variety->fresh()->photo_credit);
    }

    public function test_a_credit_is_checked_field_by_field(): void
    {
        $librarian = User::factory()->librarian()->create();
        $variety = Variety::factory()->withPhoto()->create();

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => [
                'author' => str_repeat('a', 256),
                'licence' => 'CC BY 4.0',
                'source_url' => 'http://commons.wikimedia.org/wiki/File:Dill.jpg',
                'modified' => 'yes',
            ]])
            ->assertStatus(422)
            ->assertJsonPath('errors', [
                'photo_credit.author' => ['The author field must not be greater than 255 characters.'],
                'photo_credit.source_url' => ['The source URL field must be a valid URL.'],
                'photo_credit.modified' => ['The modified field must be true or false.'],
            ]);

        $missing = self::CREDIT;
        unset($missing['licence']);

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => $missing])
            ->assertStatus(422)
            ->assertJsonPath('errors.photo_credit', ['The photo credit field must contain entries for: author, licence, source_url, modified.']);

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => [...self::CREDIT, 'photo_path' => 'varieties/elsewhere.jpg']])
            ->assertStatus(422)
            ->assertJsonValidationErrors('photo_credit');

        $this->assertNull($variety->fresh()->photo_credit);
    }

    public function test_a_variety_without_a_photo_has_nothing_to_credit(): void
    {
        $librarian = User::factory()->librarian()->create();
        $variety = Variety::factory()->create();

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => self::CREDIT])
            ->assertStatus(422)
            ->assertJsonPath('errors.photo_credit', ['That variety has no photo to credit.']);

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => null])
            ->assertOk()
            ->assertJsonPath('data.photo_credit', null);

        $this->actingAs($librarian)
            ->postJson('/api/varieties', [
                'name' => 'Zollinger Buschbohne',
                'species' => 'Phaseolus vulgaris',
                'kind' => 'vegetable',
                'story' => 'A bush bean from the Valais.',
                'sowing_months' => [5, 6],
                'photo_credit' => self::CREDIT,
            ])
            ->assertStatus(422)
            ->assertJsonPath('errors', ['photo_credit' => ['A new variety has no photo to credit yet.']]);
    }

    public function test_the_database_refuses_a_credit_without_a_photo_whatever_writes_it(): void
    {
        $this->expectException(QueryException::class);

        Variety::factory()->create(['photo_credit' => new PhotoCredit('Ermell', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/', false)]);
    }

    public function test_a_new_photo_drops_the_credit_of_the_old_one(): void
    {
        $variety = Variety::factory()->withPhoto()->create(['photo_credit' => self::CREDIT]);

        $this->actingAs(User::factory()->librarian()->create())
            ->post("/api/varieties/{$variety->id}/photo", ['photo' => UploadedFile::fake()->createWithContent('new.jpg', 'another photographer')], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.photo_credit', null);

        $this->assertNull($variety->fresh()->photo_credit);
    }

    public function test_only_a_librarian_sets_a_credit(): void
    {
        $variety = Variety::factory()->withPhoto()->create();

        $this->actingAs(User::factory()->create())
            ->patchJson("/api/varieties/{$variety->id}", ['photo_credit' => self::CREDIT])
            ->assertForbidden();

        $this->assertNull($variety->fresh()->photo_credit);
    }

    /**
     * The table in credits.md, keyed by slug, in the shape the API answers with.
     *
     * @return array<string, array{author: string, licence: string, source_url: string, modified: bool}>
     */
    private function creditsFile(): array
    {
        $credits = [];

        foreach (file(database_path('seeders/photos/credits.md'), FILE_IGNORE_NEW_LINES) as $line) {
            if (! preg_match('/^\| ([a-z0-9-]+) \| \[[^\]]+\]\((https:\/\/\S+)\) \| (.+?) \| (.+?) \| .+? \| (.+) \|$/', $line, $cell)) {
                continue;
            }

            $credits[$cell[1]] = [
                'author' => $cell[3],
                'licence' => $cell[4],
                'source_url' => $cell[2],
                'modified' => str_starts_with($cell[5], 'MODIFIED'),
            ];
        }

        return $credits;
    }
}
