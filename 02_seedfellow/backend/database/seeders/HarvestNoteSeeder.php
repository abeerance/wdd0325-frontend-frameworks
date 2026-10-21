<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Borrowing;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;

class HarvestNoteSeeder extends Seeder
{
    /**
     * What came back with the seed, so the germination figures on a variety page are a
     * real sum of real notes. Each note names the borrowing it belongs to by variety and
     * member, the same pair BorrowingSeeder lends by, so reordering either list cannot
     * move a note onto somebody else's packet.
     *
     * Each note is dated the day the seed came back, not the day the seeder ran: the
     * variety page prints `written_on`.
     *
     * @var list<array{variety: string, member: string, body: string, seeds_sown: int, seeds_germinated: int, written_on: string}>
     */
    private const NOTES = [
        [
            'variety' => 'Berner Rose',
            'member' => 'tomas@example.org',
            'body' => 'Sown on the kitchen windowsill at the start of March, potted on twice, outside after the ice saints. Four plants carried fruit until the first frost. The seed here is from the earliest two.',
            'seeds_sown' => 24,
            'seeds_germinated' => 19,
            'written_on' => '2026-08-20 18:40:00',
        ],
        [
            'variety' => 'Berner Rose',
            'member' => 'marit@example.org',
            'body' => 'A cold spring and a colder greenhouse. Half of them never came up, and the ones that did sulked until June. Still ended with more tomatoes than the household could eat.',
            'seeds_sown' => 30,
            'seeds_germinated' => 12,
            'written_on' => '2026-08-02 11:15:00',
        ],
        [
            'variety' => 'Genovese',
            'member' => 'marit@example.org',
            'body' => 'Sown thickly in a trough and thinned to six. Cut back three times before it flowered. The seed is from the plant that held out longest before bolting.',
            'seeds_sown' => 40,
            'seeds_germinated' => 33,
            'written_on' => '2026-07-30 08:05:00',
        ],
    ];

    public function run(): void
    {
        $members = User::query()->get()->keyBy('email');

        foreach (self::NOTES as $note) {
            $written = CarbonImmutable::parse($note['written_on']);

            // sole() fails loudly unless exactly one borrowing matches, so a note can
            // never land on the wrong one or silently go missing.
            Borrowing::query()
                ->whereBelongsTo($members[$note['member']], 'user')
                ->whereHas('packet.variety', fn (Builder $variety) => $variety->where('name', $note['variety']))
                ->sole()
                ->harvestNote()
                ->make([
                    'body' => $note['body'],
                    'seeds_sown' => $note['seeds_sown'],
                    'seeds_germinated' => $note['seeds_germinated'],
                ])
                ->forceFill(['created_at' => $written, 'updated_at' => $written])
                ->save();
        }
    }
}
