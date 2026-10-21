<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\Kind;
use App\Models\Variety;
use App\ValueObjects\PhotoCredit;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class VarietySeeder extends Seeder
{
    /**
     * The catalogue, in the order the library accessioned it.
     *
     * Rows are written out rather than generated, so every id, name and count
     * below is the same in every copy of this database. Scripts and lessons
     * quote these values.
     *
     * `photo_credit` is copied from photos/credits.md, one row per photograph: the author and
     * licence verbatim, the Commons file page, and whether the file was changed from its source.
     *
     * @var list<array{name: string, species: string, kind: Kind, sowing_months: list<int>, story: string, retired: bool, photo_credit: array{author: string, licence: string, source_url: string, modified: bool}}>
     */
    private const CATALOGUE = [
        [
            'name' => 'Berner Rose',
            'species' => 'Solanum lycopersicum',
            'kind' => Kind::Vegetable,
            'sowing_months' => [3, 4],
            'story' => 'A pink beefsteak tomato kept around Bern since the 1950s. Thin skin, so it travels badly and tastes like nothing you can buy. Start it indoors and plant it out once the nights hold above ten degrees.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Frank C. Müller',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Tomate_Berner_Rose_01_(fcm).jpg',
                'modified' => true,
            ],
        ],
        [
            'name' => 'Cuor di Bue',
            'species' => 'Solanum lycopersicum',
            'kind' => Kind::Vegetable,
            'sowing_months' => [3, 4],
            'story' => 'The oxheart tomato, pointed at the base and almost hollow inside. It came to the library from a member whose grandmother grew it in Ticino.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Fructibus',
                'licence' => 'CC0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Tom%C3%A0quet_cor_de_bou_2017_A1.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Brandywine',
            'species' => 'Solanum lycopersicum',
            'kind' => Kind::Vegetable,
            'sowing_months' => [3, 4],
            'story' => 'An American heirloom with potato-shaped leaves and a long wait for the first fruit. Worth the wait, and reliable enough that we keep it as the variety we lend to first-time growers.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'David.moreno72',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Brandywine-Tomato.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Küttiger Rüebli',
            'species' => 'Daucus carota',
            'kind' => Kind::Vegetable,
            'sowing_months' => [4, 5, 6],
            'story' => 'A white carrot from Küttigen in the Aargau, short and blunt and a little peppery. It nearly disappeared when orange carrots took the market.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Irmgard',
                'licence' => 'CC BY-SA 3.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:KuettigerRueebli.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Nantes 2',
            'species' => 'Daucus carota',
            'kind' => Kind::Vegetable,
            'sowing_months' => [3, 4, 5, 6, 7],
            'story' => 'The carrot most people picture: cylindrical, blunt-tipped, sweet. It forgives shallow soil and a late sowing, which is why the library keeps a lot of it.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Schlaghecken Josef',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:M%C3%B6hren_am_3._Januar_2023_in_der_Pfalz_geerntet_und_gewaschen.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Chioggia',
            'species' => 'Beta vulgaris',
            'kind' => Kind::Vegetable,
            'sowing_months' => [4, 5, 6, 7],
            'story' => 'Cut one across and it is ringed white and pink like a target. The rings fade when cooked, so it is at its best raw and sliced thin.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Michel Chauvet',
                'licence' => 'CC BY-SA 3.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Betterave_Rossa_di_Chioggia_Montpellier.JPG',
                'modified' => true,
            ],
        ],
        [
            'name' => 'Detroit Dark Red',
            'species' => 'Beta vulgaris',
            'kind' => Kind::Vegetable,
            'sowing_months' => [4, 5, 6, 7],
            'story' => 'A beetroot that stores all winter in a box of sand. Sow it in July for roots that keep, or in April for leaves you can cut as chard.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Evan-Amos',
                'licence' => 'CC0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Beets-Bundle.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Cosse Violette',
            'species' => 'Phaseolus vulgaris',
            'kind' => Kind::Vegetable,
            'sowing_months' => [5, 6],
            'story' => 'A purple climbing bean that turns green the moment it hits boiling water, which makes it easy to tell when it is cooked and easy to spot on the plant.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Patafisik',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Saint-Paul-l%C3%A8s-Monestier_abc10_haricot_vert_variet%C3%A9_violet.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Verte de Cambrai',
            'species' => 'Valerianella locusta',
            'kind' => Kind::Vegetable,
            'sowing_months' => [8, 9],
            'story' => 'The Nüsslisalat sown when everything else is coming out. Small dark rosettes that sit under snow and are cut through the winter, a handful at a time.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Schwäbin',
                'licence' => 'CC BY-SA 3.0 de',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Ackersalat02.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Forellenschluss',
            'species' => 'Lactuca sativa',
            'kind' => Kind::Vegetable,
            'sowing_months' => [3, 4, 5, 8, 9],
            'story' => 'An Austrian romaine speckled like a trout. It bolts in high summer, so sow it early and again at the end of August.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Shuvaev',
                'licence' => 'CC BY 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Lactuca_sativa_%27Forellenschluss%27,_Longwood_Gardens_2023_01.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Lollo Rossa',
            'species' => 'Lactuca sativa',
            'kind' => Kind::Vegetable,
            'sowing_months' => [3, 4, 5, 8, 9],
            'story' => 'A loose-leaf lettuce with frilled red edges. Cut the outer leaves and the plant keeps going for weeks instead of ending in one salad.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Krzysztof Ziarnek, Kenraiz',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Lactuca_sativa_var._crispa_%27Lollo_Rosso%27_kz01.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Cavolo Nero',
            'species' => 'Brassica oleracea',
            'kind' => Kind::Vegetable,
            'sowing_months' => [4, 5, 6],
            'story' => 'Tuscan kale, dark and blistered, sweeter after the first frost. One plant feeds a household through a winter of soup.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'goldlocki',
                'licence' => 'CC BY-SA 3.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:PalmkohlPflanze.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Red Russian',
            'species' => 'Brassica napus',
            'kind' => Kind::Vegetable,
            'sowing_months' => [4, 5, 6, 7],
            'story' => 'A flat-leaved kale with purple stems, tender enough to eat raw when young. It overwinters outdoors here without protection.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Evan-Amos',
                'licence' => 'Public domain',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:CSA-Red-Russian-Kale.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Marketmore 76',
            'species' => 'Cucumis sativus',
            'kind' => Kind::Vegetable,
            'sowing_months' => [5, 6],
            'story' => 'An outdoor cucumber bred to shrug off mildew. Sow it where it can sprawl, or give it a net and it will climb.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Forest and Kim Starr',
                'licence' => 'CC BY 2.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Starr-220604-0503-Cucumis_sativus-Marketmore_flowers_fruit_leaves-Hawea_Pl_Olinda-Maui_(52449241945).jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Ronde de Nice',
            'species' => 'Cucurbita pepo',
            'kind' => Kind::Vegetable,
            'sowing_months' => [5, 6],
            'story' => 'A round courgette from the south of France, picked at the size of a tennis ball. Leave one on the plant a fortnight too long and you have a football.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Fructibus',
                'licence' => 'CC0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Round_zucchini_2017_A1.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Uchiki Kuri',
            'species' => 'Cucurbita maxima',
            'kind' => Kind::Vegetable,
            'sowing_months' => [5],
            'story' => 'The orange Hokkaido squash. The skin is thin enough to eat, which saves the argument about peeling it.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'fotogoocom',
                'licence' => 'CC BY 3.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Hokkaido_K%C3%BCrbis_-_panoramio.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Genovese',
            'species' => 'Ocimum basilicum',
            'kind' => Kind::Herb,
            'sowing_months' => [4, 5, 6],
            'story' => 'Large soft leaves, the basil grown for pesto. It hates cold feet, so keep the pot off a stone floor until June.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Nicole Bratt from Seattle, WA, USA',
                'licence' => 'CC BY-SA 2.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Genovese_basil_(7669494794).jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Moss Curled',
            'species' => 'Petroselinum crispum',
            'kind' => Kind::Herb,
            'sowing_months' => [3, 4, 5, 6, 7],
            'story' => 'Curly parsley, slow to germinate and worth the patience. Soak the seed overnight and sow it thinly where it is to grow.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Noebse',
                'licence' => 'Public domain',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Krause_Petersilie_dichtwachsend.JPG',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Bouquet',
            'species' => 'Anethum graveolens',
            'kind' => Kind::Herb,
            'sowing_months' => [4, 5, 6, 7],
            'story' => 'Dill for leaf and for seed head. Sow a short row every three weeks, because each plant runs to flower quickly and then stops making leaves.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Ermell',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Dill_Bluete_7080848-PSD-2.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Bohnenkraut',
            'species' => 'Satureja hortensis',
            'kind' => Kind::Herb,
            'sowing_months' => [4, 5],
            'story' => 'Summer savory, sown next to beans by tradition and by sense: it is the herb that goes in the pot with them, and it keeps blackfly off the row.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'H. Zell',
                'licence' => 'CC BY-SA 3.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Satureja_hortensis_002.JPG',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Borretsch',
            'species' => 'Borago officinalis',
            'kind' => Kind::Herb,
            'sowing_months' => [4, 5, 6],
            'story' => 'Borage, with blue star flowers the bees find before you do. It seeds itself around the plot forever, which is either a feature or a warning.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Hans Hillewaert',
                'licence' => 'CC BY-SA 3.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Borago_officinalis_(flower).jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Resina',
            'species' => 'Calendula officinalis',
            'kind' => Kind::Flower,
            'sowing_months' => [3, 4, 5, 6, 7, 8],
            'story' => 'A single-flowered calendula grown for its resin, which is what makes the salve. Deadhead it and it flowers until the first hard frost.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Dejean2000',
                'licence' => 'CC BY 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Ringelblume_Calendula_officinalis_L.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Empress of India',
            'species' => 'Tropaeolum majus',
            'kind' => Kind::Flower,
            'sowing_months' => [4, 5, 6],
            'story' => 'A compact nasturtium with dark leaves and deep red flowers. Both are edible and peppery, and the plant draws aphids away from the beans.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'AlternativesLebensglück',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Gro%C3%9Fe_Kapuzinerkresse_mit_roter_Bl%C3%BCte.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Sensation',
            'species' => 'Cosmos bipinnatus',
            'kind' => Kind::Flower,
            'sowing_months' => [4, 5, 6],
            'story' => 'Cosmos that reaches shoulder height by August. Poor soil gives more flowers and fewer leaves, so plant it in the difficult corner.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Ermell',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Cosmos_bipinnatus_Bl%C3%BCte-20230819-RM-123333.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Ringelblume Orange',
            'species' => 'Calendula officinalis',
            'kind' => Kind::Flower,
            'sowing_months' => [3, 4, 5, 6],
            'story' => 'The orange calendula most gardens here already have somewhere. We keep it because members ask for it by name and because it is impossible to kill.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Ermell',
                'licence' => 'CC BY-SA 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Ringelblume_(Calendula_officinalis)_Bl%C3%BCte_focus_stack-20220619-RM-165610.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Oberkulmer Rotkorn',
            'species' => 'Triticum spelta',
            'kind' => Kind::Grain,
            'sowing_months' => [9, 10],
            'story' => 'A Swiss spelt landrace, tall enough to fall over in a wet June and grown anyway for the flavour of the flour.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Robert Flogaus-Faust',
                'licence' => 'CC BY 4.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Triticum_spelta_RF.jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Emmer',
            'species' => 'Triticum dicoccum',
            'kind' => Kind::Grain,
            'sowing_months' => [10, 11],
            'story' => 'One of the oldest wheats still eaten. A square metre of it gives a loaf, which is the point of growing it in a garden: you learn what a loaf costs.',
            'retired' => false,
            'photo_credit' => [
                'author' => 'Magnus Hagdorn from UK',
                'licence' => 'CC BY-SA 2.0',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Hohenloher_Freilandmuseum_-_Emmer_(28548061457).jpg',
                'modified' => false,
            ],
        ],
        [
            'name' => 'Schwarzer Hafer',
            'species' => 'Avena sativa',
            'kind' => Kind::Grain,
            'sowing_months' => [3, 4],
            'story' => 'A black-husked oat, kept by the library as a green manure as much as a grain. Cut it before it seeds and it feeds the soil instead of you.',
            'retired' => true,
            'photo_credit' => [
                'author' => 'Andreas Trepte',
                'licence' => 'CC BY-SA 2.5',
                'source_url' => 'https://commons.wikimedia.org/wiki/File:Avena_sativa_II.jpg',
                'modified' => false,
            ],
        ],
    ];

    /**
     * The library accessioned one variety a week from the day it opened. Fixed dates,
     * so "newest first" and every printed timestamp are the same in every copy.
     */
    private const OPENED_ON = '2026-01-12 09:00:00';

    public function run(): void
    {
        $accessioned = CarbonImmutable::parse(self::OPENED_ON);

        foreach (self::CATALOGUE as $index => $row) {
            $at = $accessioned->addWeeks($index);

            DB::table('varieties')->insert([
                'name' => $row['name'],
                'species' => $row['species'],
                'kind' => $row['kind']->value,
                'story' => $row['story'],
                'sowing_months' => json_encode($row['sowing_months']),
                ...$this->storePhoto($row),
                'retired_at' => $row['retired'] ? $at->addMonths(6) : null,
                'created_at' => $at,
                'updated_at' => $at,
            ]);
        }
    }

    /**
     * Copy the variety's photograph onto the disk the API serves from, and answer with the
     * columns that describe it. A seeded photo keeps the variety's own slug rather than the
     * random name an upload gets, so the path is the same in every copy of this database,
     * and its version is the fingerprint an upload of the same file would get.
     *
     * @param  array{name: string, photo_credit: array{author: string, licence: string, source_url: string, modified: bool}}  $row
     * @return array{photo_path: ?string, photo_version: ?string, photo_credit: ?string}
     */
    private function storePhoto(array $row): array
    {
        $slug = Str::slug($row['name']);
        $source = database_path("seeders/photos/{$slug}.jpg");

        if (! file_exists($source)) {
            return ['photo_path' => null, 'photo_version' => null, 'photo_credit' => null];
        }

        $path = "varieties/{$slug}.jpg";
        Storage::put($path, file_get_contents($source));

        return [
            'photo_path' => $path,
            'photo_version' => Variety::photoVersion($source),
            'photo_credit' => json_encode(PhotoCredit::fromArray($row['photo_credit']), JSON_THROW_ON_ERROR),
        ];
    }
}
