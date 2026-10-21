<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Borrowing;
use App\Models\HarvestNote;
use App\Models\Packet;
use App\Models\User;
use App\Models\Variety;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PhotoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake();
    }

    /**
     * @return array<string, array{class-string<Variety|HarvestNote>, string}>
     */
    public static function photographs(): array
    {
        return [
            'variety' => [Variety::class, 'varieties'],
            'harvest note' => [HarvestNote::class, 'harvest-notes'],
        ];
    }

    /**
     * @param  class-string<Variety|HarvestNote>  $model
     */
    #[DataProvider('photographs')]
    public function test_the_current_version_in_the_url_is_cached_for_a_year(string $model, string $route): void
    {
        $photo = $model::factory()->withPhoto()->create();

        $response = $this->get("/api/{$route}/{$photo->id}/photo?v={$photo->photo_version}")
            ->assertOk()
            ->assertHeader('ETag', "\"{$photo->photo_version}\"");

        $this->assertCacheControl($response, ['immutable', 'max-age=31536000', 'public']);
    }

    /**
     * @param  class-string<Variety|HarvestNote>  $model
     */
    #[DataProvider('photographs')]
    public function test_a_url_without_the_current_version_is_checked_every_time(string $model, string $route): void
    {
        $photo = $model::factory()->withPhoto()->create();

        foreach (['', '?v=0123456789abcdef', '?v[]=x'] as $query) {
            $response = $this->get("/api/{$route}/{$photo->id}/photo{$query}")
                ->assertOk()
                ->assertHeader('ETag', "\"{$photo->photo_version}\"");

            $this->assertCacheControl($response, ['no-cache', 'public']);
        }
    }

    /**
     * @param  class-string<Variety|HarvestNote>  $model
     */
    #[DataProvider('photographs')]
    public function test_checking_back_on_an_unchanged_photo_sends_no_body(string $model, string $route): void
    {
        $photo = $model::factory()->withPhoto()->create();

        $response = $this->get("/api/{$route}/{$photo->id}/photo", ['If-None-Match' => "\"{$photo->photo_version}\""])
            ->assertStatus(304)
            ->assertHeaderMissing('Content-Type');

        $this->assertSame('', $response->streamedContent());

        $this->get("/api/{$route}/{$photo->id}/photo", ['If-None-Match' => '"0123456789abcdef"'])
            ->assertOk();
    }

    /**
     * The test case sends an Origin that Sanctum treats as the frontend, which is exactly
     * the request that would otherwise start a session and set its cookies.
     *
     * @param  class-string<Variety|HarvestNote>  $model
     */
    #[DataProvider('photographs')]
    public function test_a_photo_never_carries_a_cookie(string $model, string $route): void
    {
        $photo = $model::factory()->withPhoto()->create();

        $this->get("/api/{$route}/{$photo->id}/photo?v={$photo->photo_version}", ['Referer' => 'http://localhost/'])
            ->assertOk()
            ->assertHeaderMissing('Set-Cookie');
    }

    /**
     * @param  class-string<Variety|HarvestNote>  $model
     */
    #[DataProvider('photographs')]
    public function test_the_answer_names_the_version_not_the_stored_file(string $model, string $route): void
    {
        $photo = $model::factory()->withPhoto()->create();

        $this->get("/api/{$route}/{$photo->id}/photo")
            ->assertOk()
            ->assertHeader('Content-Disposition', "inline; filename={$photo->photo_version}.jpg");
    }

    public function test_the_version_is_a_fingerprint_of_the_bytes(): void
    {
        $librarian = User::factory()->librarian()->create();
        $variety = Variety::factory()->create();

        $first = $this->actingAs($librarian)
            ->post("/api/varieties/{$variety->id}/photo", ['photo' => UploadedFile::fake()->createWithContent('one.jpg', 'the first picture')], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.photo_version', substr(hash('sha256', 'the first picture'), 0, 16))
            ->json('data.photo_version');

        $this->actingAs($librarian)
            ->post("/api/varieties/{$variety->id}/photo", ['photo' => UploadedFile::fake()->createWithContent('two.jpg', 'a second picture')], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.photo_version', substr(hash('sha256', 'a second picture'), 0, 16));

        $this->actingAs($librarian)
            ->post("/api/varieties/{$variety->id}/photo", ['photo' => UploadedFile::fake()->createWithContent('three.jpg', 'the first picture')], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.photo_version', $first);
    }

    public function test_a_replaced_harvest_photo_gets_a_new_version_and_the_old_url_stops_being_forever(): void
    {
        $member = User::factory()->create();
        $note = HarvestNote::factory()->withPhoto()->create([
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
        ]);
        $old = $note->photo_version;

        $new = $this->actingAs($member)
            ->post("/api/harvest-notes/{$note->id}/photo", ['photo' => UploadedFile::fake()->createWithContent('new.png', 'a new harvest')], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.photo_version', substr(hash('sha256', 'a new harvest'), 0, 16))
            ->json('data.photo_version');

        $this->assertNotSame($old, $new);

        $this->assertCacheControl($this->get("/api/harvest-notes/{$note->id}/photo?v={$old}"), ['no-cache', 'public']);
        $this->assertCacheControl($this->get("/api/harvest-notes/{$note->id}/photo?v={$new}"), ['immutable', 'max-age=31536000', 'public']);
    }

    public function test_every_answer_that_describes_a_photo_carries_its_version(): void
    {
        $member = User::factory()->create();
        $variety = Variety::factory()->withPhoto()->create();
        $bare = Variety::factory()->create();
        $borrowing = Borrowing::factory()->for($member)->for(Packet::factory()->borrowed()->for($variety))->returned()->create();
        $note = HarvestNote::factory()->withPhoto()->for($borrowing)->create();

        $this->getJson("/api/varieties/{$variety->id}")
            ->assertOk()
            ->assertJsonPath('data.has_photo', true)
            ->assertJsonPath('data.photo_version', $variety->photo_version)
            ->assertJsonPath('data.harvest_notes.0.photo_version', $note->photo_version)
            ->assertJsonMissingPath('data.photo_path');

        $catalogue = collect($this->getJson('/api/varieties')->assertOk()->json('data'))->keyBy('id');
        $this->assertSame($variety->photo_version, $catalogue[$variety->id]['photo_version']);
        $this->assertNull($catalogue[$bare->id]['photo_version']);

        $this->actingAs($member)
            ->getJson('/api/borrowings')
            ->assertOk()
            ->assertJsonPath('data.0.variety.photo_version', $variety->photo_version)
            ->assertJsonPath('data.0.harvest_note.photo_version', $note->photo_version)
            ->assertJsonMissingPath('data.0.variety.photo_path')
            ->assertJsonMissingPath('data.0.harvest_note.photo_path');

        $answer = $this->getJson("/api/varieties/{$bare->id}")
            ->assertOk()
            ->assertJsonPath('data.has_photo', false);
        $this->assertArrayHasKey('photo_version', $answer->json('data'));
        $this->assertNull($answer->json('data.photo_version'));
    }

    /**
     * Symfony writes the directives in alphabetical order, so compare the set, not the string.
     *
     * @param  list<string>  $expected
     */
    private function assertCacheControl(TestResponse $response, array $expected): void
    {
        $directives = array_map(trim(...), explode(',', (string) $response->headers->get('Cache-Control')));
        sort($directives);

        $this->assertSame($expected, $directives);
    }
}
