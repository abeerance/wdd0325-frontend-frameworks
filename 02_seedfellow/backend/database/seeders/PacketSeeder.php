<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\PacketStatus;
use App\Models\Variety;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PacketSeeder extends Seeder
{
    /**
     * How many envelopes of each variety the shelf holds, by variety name.
     *
     * Four varieties hold none, so an empty state is reachable without emptying the library.
     * Two hold exactly one, which is where the conflict between two members borrowing at
     * the same moment becomes real rather than theoretical.
     *
     * @var array<string, int>
     */
    private const SHELF = [
        'Berner Rose' => 6,
        'Cuor di Bue' => 4,
        'Brandywine' => 3,
        'Küttiger Rüebli' => 2,
        'Nantes 2' => 8,
        'Chioggia' => 5,
        'Detroit Dark Red' => 4,
        'Cosse Violette' => 3,
        'Verte de Cambrai' => 1,
        'Forellenschluss' => 4,
        'Lollo Rossa' => 0,
        'Cavolo Nero' => 3,
        'Red Russian' => 2,
        'Marketmore 76' => 0,
        'Ronde de Nice' => 3,
        'Uchiki Kuri' => 2,
        'Genovese' => 5,
        'Moss Curled' => 4,
        'Bouquet' => 3,
        'Bohnenkraut' => 0,
        'Borretsch' => 2,
        'Resina' => 6,
        'Empress of India' => 3,
        'Sensation' => 2,
        'Ringelblume Orange' => 0,
        'Oberkulmer Rotkorn' => 2,
        'Emmer' => 1,
        'Schwarzer Hafer' => 3,
    ];

    public function run(): void
    {
        $varieties = Variety::query()->orderBy('id')->get()->keyBy('name');

        foreach (self::SHELF as $name => $count) {
            $variety = $varieties[$name];

            // A retired variety keeps its envelopes on record; they are off the shelf, not gone.
            $status = $variety->isRetired() ? PacketStatus::Retired : PacketStatus::InStock;

            // DB::table: unlike a member (hashed cast) or a note (its relation), a packet needs nothing from the model, so it goes in as a plain row.
            for ($i = 0; $i < $count; $i++) {
                DB::table('packets')->insert([
                    'variety_id' => $variety->id,
                    'status' => $status->value,
                    'created_at' => $variety->created_at,
                    'updated_at' => $variety->created_at,
                ]);
            }
        }
    }
}
