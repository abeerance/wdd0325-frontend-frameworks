<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\PacketStatus;
use App\Models\Packet;
use App\Models\User;
use App\Models\Variety;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LibrarianTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_ordinary_member_cannot_add_a_variety(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/varieties', [
                'name' => 'Berner Rose',
                'species' => 'Solanum lycopersicum',
                'kind' => 'vegetable',
                'story' => 'A pink beefsteak tomato.',
                'sowing_months' => [3, 4],
            ])
            ->assertForbidden();

        $this->assertDatabaseCount('varieties', 0);
    }

    public function test_a_librarian_adds_a_variety(): void
    {
        $this->actingAs(User::factory()->librarian()->create())
            ->postJson('/api/varieties', [
                'name' => 'Berner Rose',
                'species' => 'Solanum lycopersicum',
                'kind' => 'vegetable',
                'story' => 'A pink beefsteak tomato.',
                'sowing_months' => [3, 4],
            ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Berner Rose')
            ->assertJsonPath('data.packets_available', 0)
            ->assertJsonPath('data.retired', false);
    }

    public function test_a_librarian_accepts_returned_seed_onto_the_shelf(): void
    {
        $variety = Variety::factory()->create();

        $this->actingAs(User::factory()->librarian()->create())
            ->postJson("/api/varieties/{$variety->id}/packets", ['count' => 3])
            ->assertCreated()
            ->assertJsonPath('data.packets_available', 3);

        $this->assertSame(3, $variety->packets()->where('status', PacketStatus::InStock)->count());
    }

    public function test_retiring_a_variety_takes_its_shelf_packets_out_of_circulation(): void
    {
        $librarian = User::factory()->librarian()->create();
        $variety = Variety::factory()->create();
        $onShelf = Packet::factory()->for($variety)->create();
        $withAMember = Packet::factory()->for($variety)->borrowed()->create();

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['retired' => true])
            ->assertOk()
            ->assertJsonPath('data.retired', true)
            ->assertJsonPath('data.packets_available', 0);

        $this->assertSame(PacketStatus::Retired, $onShelf->fresh()->status);
        $this->assertSame(PacketStatus::Borrowed, $withAMember->fresh()->status, 'a packet already out is not touched');

        $this->actingAs($librarian)
            ->patchJson("/api/varieties/{$variety->id}", ['retired' => false])
            ->assertOk()
            ->assertJsonPath('data.retired', false)
            ->assertJsonPath('data.packets_available', 1);
    }

    public function test_a_retired_variety_cannot_be_borrowed_or_restocked(): void
    {
        $variety = Variety::factory()->retired()->create();

        $this->actingAs(User::factory()->create())
            ->postJson('/api/borrowings', ['variety_id' => $variety->id])
            ->assertStatus(409)
            ->assertJsonPath('message', 'That variety has been retired.');

        $this->actingAs(User::factory()->librarian()->create())
            ->postJson("/api/varieties/{$variety->id}/packets", ['count' => 2])
            ->assertStatus(409)
            ->assertJsonPath('message', 'That variety has been retired.');
    }

    public function test_a_librarian_uploads_a_variety_photo_and_the_answer_hides_where_it_is_kept(): void
    {
        Storage::fake();
        $variety = Variety::factory()->create();
        Packet::factory()->for($variety)->create();

        $this->actingAs(User::factory()->librarian()->create())
            ->post("/api/varieties/{$variety->id}/photo", [
                'photo' => UploadedFile::fake()->create('tomato.jpg', 8, 'image/jpeg'),
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.id', $variety->id)
            ->assertJsonPath('data.has_photo', true)
            ->assertJsonPath('data.packets_available', 1)
            ->assertJsonMissingPath('data.photo_path');

        Storage::assertExists($variety->fresh()->photo_path);
        $this->get("/api/varieties/{$variety->id}/photo")->assertOk();
    }

    public function test_an_ordinary_member_is_refused_before_the_photo_is_validated(): void
    {
        Storage::fake();
        $variety = Variety::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post("/api/varieties/{$variety->id}/photo", [
                'photo' => UploadedFile::fake()->create('notes.txt', 8, 'text/plain'),
            ], ['Accept' => 'application/json'])
            ->assertForbidden();

        $this->assertNull($variety->fresh()->photo_path);
    }
}
