<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\Kind;
use App\Models\Borrowing;
use App\Models\Packet;
use App\Models\Variety;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogueTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_catalogue_is_public_and_paginated(): void
    {
        Variety::factory()->count(20)->create();

        $response = $this->getJson('/api/varieties');

        $response->assertOk()
            ->assertJsonPath('meta.total', 20)
            ->assertJsonPath('meta.per_page', 15)
            ->assertJsonCount(15, 'data')
            ->assertJsonMissingPath('meta.links');
    }

    public function test_a_page_size_outside_the_range_is_refused(): void
    {
        $this->getJson('/api/varieties?per_page=999')
            ->assertStatus(422)
            ->assertJsonPath('errors.per_page.0', 'The per page field must not be greater than 50.');

        $this->getJson('/api/varieties?per_page=0')
            ->assertStatus(422)
            ->assertJsonPath('errors.per_page.0', 'The per page field must be at least 1.');
    }

    public function test_the_catalogue_filters_by_kind_sowing_month_and_stock(): void
    {
        $herb = Variety::factory()->create(['kind' => Kind::Herb, 'sowing_months' => [4, 5]]);
        $flower = Variety::factory()->create(['kind' => Kind::Flower, 'sowing_months' => [9]]);
        Packet::factory()->for($herb)->create();

        $this->getJson('/api/varieties?kind=herb')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $herb->id)
            ->assertJsonPath('data.0.packets_available', 1);

        $this->getJson('/api/varieties?sowing_month=9')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $flower->id);

        $this->getJson('/api/varieties?in_stock=true')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $herb->id);

        $this->getJson('/api/varieties?in_stock=false')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $flower->id)
            ->assertJsonPath('data.0.packets_available', 0);
    }

    public function test_the_search_matches_name_and_species_without_case(): void
    {
        $variety = Variety::factory()->create(['name' => 'Berner Rose', 'species' => 'Solanum lycopersicum']);
        Variety::factory()->create(['name' => 'Emmer', 'species' => 'Triticum dicoccum']);

        $this->getJson('/api/varieties?q=solanum')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $variety->id);
    }

    public function test_a_search_for_a_wildcard_character_matches_it_literally(): void
    {
        $percent = Variety::factory()->create(['name' => 'Hundred%Rye']);
        $underscore = Variety::factory()->create(['name' => 'Snake_Bean']);
        Variety::factory()->create(['name' => 'Berner Rose', 'species' => 'Solanum lycopersicum']);

        $this->getJson('/api/varieties?'.http_build_query(['q' => '%']))
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $percent->id);

        $this->getJson('/api/varieties?'.http_build_query(['q' => '_']))
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $underscore->id);
    }

    public function test_a_variety_counts_only_the_packets_on_the_shelf(): void
    {
        $variety = Variety::factory()->create();
        Packet::factory()->for($variety)->count(2)->create();
        Packet::factory()->for($variety)->borrowed()->create();

        $this->getJson("/api/varieties/{$variety->id}")
            ->assertOk()
            ->assertJsonPath('data.packets_available', 2);
    }

    public function test_a_variety_reports_the_germination_rate_of_every_note_written_about_it(): void
    {
        $variety = Variety::factory()->create();
        $first = Packet::factory()->for($variety)->borrowed()->create();
        $second = Packet::factory()->for($variety)->borrowed()->create();

        $first->borrowings()->save(Borrowing::factory()->returned()->make(['packet_id' => $first->id]));
        $second->borrowings()->save(Borrowing::factory()->returned()->make(['packet_id' => $second->id]));

        $first->borrowings()->first()->harvestNote()->create(['body' => 'One', 'seeds_sown' => 20, 'seeds_germinated' => 15]);
        $second->borrowings()->first()->harvestNote()->create(['body' => 'Two', 'seeds_sown' => 30, 'seeds_germinated' => 9]);

        // 24 of 50 came up.
        $this->getJson("/api/varieties/{$variety->id}")
            ->assertOk()
            ->assertJsonPath('data.germination_rate', 0.48)
            ->assertJsonCount(2, 'data.harvest_notes');
    }

    public function test_a_variety_with_no_notes_has_no_germination_rate(): void
    {
        $variety = Variety::factory()->create();

        $this->getJson("/api/varieties/{$variety->id}")
            ->assertOk()
            ->assertJsonPath('data.germination_rate', null);
    }

    public function test_a_variety_that_is_not_there_is_a_404(): void
    {
        $this->getJson('/api/varieties/999')->assertNotFound();
    }
}
