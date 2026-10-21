<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Borrowing;
use App\Models\HarvestNote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class HarvestNoteTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_member_writes_a_note_about_the_packet_they_grew(): void
    {
        $member = User::factory()->create();
        $borrowing = Borrowing::factory()->for($member)->returned()->create();

        $this->actingAs($member)
            ->postJson("/api/borrowings/{$borrowing->id}/harvest-note", [
                'body' => 'Sown in a trough, netted against the pigeons.',
                'seeds_sown' => 16,
                'seeds_germinated' => 11,
            ])
            ->assertCreated()
            ->assertJsonPath('data.seeds_germinated', 11)
            ->assertJsonPath('data.grown_by', $member->name)
            ->assertJsonPath('data.has_photo', false);
    }

    public function test_a_note_needs_the_packet_back_first(): void
    {
        $member = User::factory()->create();
        $borrowing = Borrowing::factory()->for($member)->create();

        $this->actingAs($member)
            ->postJson("/api/borrowings/{$borrowing->id}/harvest-note", [
                'body' => 'Still growing.',
                'seeds_sown' => 10,
                'seeds_germinated' => 5,
            ])
            ->assertStatus(409);
    }

    public function test_a_borrowing_carries_one_note(): void
    {
        $member = User::factory()->create();
        $note = HarvestNote::factory()->create([
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
        ]);

        $this->actingAs($member)
            ->postJson("/api/borrowings/{$note->borrowing_id}/harvest-note", [
                'body' => 'A second note.',
                'seeds_sown' => 10,
                'seeds_germinated' => 5,
            ])
            ->assertStatus(409)
            ->assertJsonPath('message', 'That borrowing already has a harvest note.');
    }

    public function test_more_seeds_cannot_come_up_than_went_in(): void
    {
        $member = User::factory()->create();
        $borrowing = Borrowing::factory()->for($member)->returned()->create();

        $this->actingAs($member)
            ->postJson("/api/borrowings/{$borrowing->id}/harvest-note", [
                'body' => 'Optimistic.',
                'seeds_sown' => 5,
                'seeds_germinated' => 9,
            ])
            ->assertStatus(422)
            ->assertJsonPath('errors.seeds_germinated.0', 'The seeds germinated field must be less than or equal to 5.');
    }

    public function test_only_the_member_who_grew_it_can_write_the_note(): void
    {
        $borrowing = Borrowing::factory()->returned()->create();

        $this->actingAs(User::factory()->create())
            ->postJson("/api/borrowings/{$borrowing->id}/harvest-note", [
                'body' => 'Not mine to write.',
                'seeds_sown' => 10,
                'seeds_germinated' => 5,
            ])
            ->assertForbidden();
    }

    public function test_a_photo_is_uploaded_and_served_back(): void
    {
        Storage::fake();

        $member = User::factory()->create();
        $note = HarvestNote::factory()->create([
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
        ]);

        $this->actingAs($member)
            ->post("/api/harvest-notes/{$note->id}/photo", [
                'photo' => UploadedFile::fake()->create('harvest.png', 8, 'image/png'),
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.id', $note->id)
            ->assertJsonPath('data.has_photo', true)
            ->assertJsonPath('data.grown_by', $member->name)
            ->assertJsonMissingPath('data.photo_path');

        Storage::assertExists($note->fresh()->photo_path);

        $this->get("/api/harvest-notes/{$note->id}/photo")->assertOk();
    }

    public function test_replacing_a_photo_leaves_one_file_behind(): void
    {
        Storage::fake();

        $member = User::factory()->create();
        $note = HarvestNote::factory()->create([
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
        ]);

        $this->actingAs($member)
            ->post("/api/harvest-notes/{$note->id}/photo", ['photo' => UploadedFile::fake()->create('one.png', 8, 'image/png')], ['Accept' => 'application/json'])
            ->assertCreated();
        $first = $note->fresh()->photo_path;

        $this->actingAs($member)
            ->post("/api/harvest-notes/{$note->id}/photo", ['photo' => UploadedFile::fake()->create('two.png', 8, 'image/png')], ['Accept' => 'application/json'])
            ->assertCreated();
        $second = $note->fresh()->photo_path;

        Storage::assertMissing($first);
        Storage::assertExists($second);
    }

    public function test_a_photo_has_to_be_a_photo(): void
    {
        $member = User::factory()->create();
        $note = HarvestNote::factory()->create([
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
        ]);

        $this->actingAs($member)
            ->post("/api/harvest-notes/{$note->id}/photo", [
                'photo' => UploadedFile::fake()->create('notes.txt', 8, 'text/plain'),
            ], ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonPath('errors.photo.0', 'The photo field must be a file of type: jpeg, png.');
    }

    public function test_nobody_attaches_a_photo_to_someone_elses_note_whatever_they_send(): void
    {
        Storage::fake();
        $note = HarvestNote::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post("/api/harvest-notes/{$note->id}/photo", [
                'photo' => UploadedFile::fake()->create('notes.txt', 8, 'text/plain'),
            ], ['Accept' => 'application/json'])
            ->assertForbidden();

        $this->assertNull($note->fresh()->photo_path);
    }

    public function test_a_member_corrects_their_own_note(): void
    {
        $member = User::factory()->create();
        $note = HarvestNote::factory()->create([
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
            'seeds_sown' => 20,
            'seeds_germinated' => 8,
        ]);

        $this->actingAs($member)
            ->patchJson("/api/harvest-notes/{$note->id}", ['seeds_germinated' => 12])
            ->assertOk()
            ->assertJsonPath('data.seeds_germinated', 12)
            ->assertJsonPath('data.seeds_sown', 20);
    }

    public function test_a_correction_cannot_germinate_more_than_was_sown(): void
    {
        $member = User::factory()->create();
        $note = HarvestNote::factory()->create([
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
            'seeds_sown' => 10,
            'seeds_germinated' => 5,
        ]);

        $this->actingAs($member)
            ->patchJson("/api/harvest-notes/{$note->id}", ['seeds_germinated' => 11])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['seeds_germinated']);
    }

    public function test_nobody_edits_someone_elses_note(): void
    {
        $note = HarvestNote::factory()->create();

        $this->actingAs(User::factory()->create())
            ->patchJson("/api/harvest-notes/{$note->id}", ['body' => 'Mine now.'])
            ->assertForbidden();
    }

    public function test_a_member_deletes_their_note_and_its_photo(): void
    {
        Storage::fake();
        $member = User::factory()->create();
        $note = HarvestNote::factory()->withPhoto()->create([
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
        ]);
        Storage::assertExists($note->photo_path);

        $this->actingAs($member)
            ->deleteJson("/api/harvest-notes/{$note->id}")
            ->assertNoContent();

        $this->assertModelMissing($note);
        Storage::assertMissing($note->photo_path);
        $this->assertModelExists($note->borrowing);
    }

    public function test_nobody_deletes_someone_elses_note(): void
    {
        $note = HarvestNote::factory()->create();

        $this->actingAs(User::factory()->create())
            ->deleteJson("/api/harvest-notes/{$note->id}")
            ->assertForbidden();

        $this->assertModelExists($note);
    }

    public function test_deleting_a_note_needs_a_session(): void
    {
        $note = HarvestNote::factory()->create();

        $this->deleteJson("/api/harvest-notes/{$note->id}")->assertUnauthorized();
    }
}
