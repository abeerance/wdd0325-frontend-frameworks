<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\PacketStatus;
use App\Models\Borrowing;
use App\Models\HarvestNote;
use App\Models\Packet;
use App\Models\User;
use App\Models\Variety;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class BorrowingTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_member_borrows_a_packet_and_it_leaves_the_shelf(): void
    {
        $member = User::factory()->create();
        $variety = Variety::factory()->create();
        $packet = Packet::factory()->for($variety)->create();

        $this->actingAs($member)
            ->postJson('/api/borrowings', ['variety_id' => $variety->id])
            ->assertCreated()
            ->assertJsonPath('data.packet_id', $packet->id)
            ->assertJsonPath('data.user_id', $member->id)
            ->assertJsonPath('data.returned_on', null);

        $this->assertSame(PacketStatus::Borrowed, $packet->fresh()->status);
        $this->assertSame(0, $variety->packets()->where('status', PacketStatus::InStock)->count());
    }

    public function test_borrowing_a_variety_with_an_empty_shelf_is_a_conflict(): void
    {
        $member = User::factory()->create();
        $variety = Variety::factory()->create();

        $this->actingAs($member)
            ->postJson('/api/borrowings', ['variety_id' => $variety->id])
            ->assertStatus(409)
            ->assertJsonPath('message', 'That variety has no packets left.');

        $this->assertDatabaseCount('borrowings', 0);
    }

    public function test_borrowing_needs_a_variety_that_exists(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/borrowings', ['variety_id' => 9999])
            ->assertStatus(422)
            ->assertJsonPath('errors.variety_id.0', 'The selected variety id is invalid.');
    }

    public function test_borrowing_is_for_members_only(): void
    {
        $variety = Variety::factory()->create();

        $this->postJson('/api/borrowings', ['variety_id' => $variety->id])
            ->assertUnauthorized();
    }

    public function test_returning_seed_closes_the_borrowing_and_spends_the_packet(): void
    {
        $member = User::factory()->create();
        $borrowing = Borrowing::factory()->for($member)->create();

        $this->actingAs($member)
            ->patchJson("/api/borrowings/{$borrowing->id}")
            ->assertOk()
            ->assertJsonPath('data.returned_on', today()->toDateString());

        $this->assertSame(PacketStatus::Sown, $borrowing->packet->fresh()->status);
    }

    public function test_returning_the_same_packet_twice_is_a_conflict(): void
    {
        $member = User::factory()->create();
        $borrowing = Borrowing::factory()->for($member)->returned()->create();

        $this->actingAs($member)
            ->patchJson("/api/borrowings/{$borrowing->id}")
            ->assertStatus(409)
            ->assertJsonPath('message', 'That packet has already been returned.');
    }

    public function test_a_member_cannot_return_somebody_elses_packet(): void
    {
        $borrowing = Borrowing::factory()->create();

        $this->actingAs(User::factory()->create())
            ->patchJson("/api/borrowings/{$borrowing->id}")
            ->assertForbidden();

        $this->assertNull($borrowing->fresh()->returned_on);
    }

    public function test_a_member_sees_only_their_own_borrowings(): void
    {
        $member = User::factory()->create();
        Borrowing::factory()->for($member)->create();
        Borrowing::factory()->create();

        $this->actingAs($member)
            ->getJson('/api/borrowings')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.user_id', $member->id);
    }

    public function test_each_borrowing_carries_its_harvest_note_or_null(): void
    {
        $member = User::factory()->create();
        $out = Borrowing::factory()->for($member)->create(['due_on' => today()->addMonth()]);
        $returned = Borrowing::factory()->for($member)->returned()->create();
        $note = HarvestNote::factory()->for($returned)->create();

        $response = $this->actingAs($member)
            ->getJson('/api/borrowings')
            ->assertOk()
            ->assertJsonPath('data.0.id', $out->id)
            ->assertJsonPath('data.1.id', $returned->id)
            ->assertJsonPath('data.1.harvest_note.id', $note->id)
            ->assertJsonPath('data.1.harvest_note.borrowing_id', $returned->id)
            ->assertJsonPath('data.1.harvest_note.body', $note->body)
            ->assertJsonPath('data.1.harvest_note.has_photo', false)
            ->assertJsonPath('data.1.harvest_note.photo_version', null);

        // A path to null passes on a key that is missing, so ask for the key itself.
        $this->assertArrayHasKey('harvest_note', $response->json('data.0'));
        $this->assertNull($response->json('data.0.harvest_note'));
    }

    public function test_borrowing_and_returning_answer_with_the_harvest_note_field(): void
    {
        $member = User::factory()->create();
        $variety = Variety::factory()->create();
        Packet::factory()->for($variety)->create();

        $borrowed = $this->actingAs($member)
            ->postJson('/api/borrowings', ['variety_id' => $variety->id])
            ->assertCreated();
        $this->assertArrayHasKey('harvest_note', $borrowed->json('data'));
        $this->assertNull($borrowed->json('data.harvest_note'));

        $returned = $this->actingAs($member)
            ->patchJson('/api/borrowings/'.$borrowed->json('data.id'))
            ->assertOk();
        $this->assertArrayHasKey('harvest_note', $returned->json('data'));
        $this->assertNull($returned->json('data.harvest_note'));
    }

    public function test_listing_borrowings_costs_the_same_queries_however_many_there_are(): void
    {
        $member = User::factory()->create();
        HarvestNote::factory()->for(Borrowing::factory()->for($member)->returned())->create();
        $one = $this->countQueries(fn () => $this->actingAs($member)->getJson('/api/borrowings')->assertJsonCount(1, 'data'));

        HarvestNote::factory()->count(4)->sequence(fn () => [
            'borrowing_id' => Borrowing::factory()->for($member)->returned(),
        ])->create();
        $five = $this->countQueries(fn () => $this->actingAs($member)->getJson('/api/borrowings')->assertJsonCount(5, 'data'));

        $this->assertSame($one, $five);
    }

    private function countQueries(callable $request): int
    {
        DB::flushQueryLog();
        DB::enableQueryLog();
        $request();
        DB::disableQueryLog();

        return count(DB::getQueryLog());
    }
}
