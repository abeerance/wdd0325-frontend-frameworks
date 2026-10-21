<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\PacketStatus;
use App\Models\Borrowing;
use App\Models\Packet;
use App\Models\User;
use App\Models\Variety;
use Illuminate\Database\Seeder;

class BorrowingSeeder extends Seeder
{
    /**
     * A season's lending, with fixed dates so the same rows mean the same thing in every copy:
     * two packets still out (one of them overdue), three grown out and given back.
     *
     * @var list<array{variety: string, member: string, borrowed_on: string, due_on: string, returned_on: ?string}>
     */
    private const LENDING = [
        ['variety' => 'Berner Rose', 'member' => 'tomas@example.org', 'borrowed_on' => '2026-03-02', 'due_on' => '2026-09-02', 'returned_on' => '2026-08-20'],
        ['variety' => 'Berner Rose', 'member' => 'marit@example.org', 'borrowed_on' => '2026-02-09', 'due_on' => '2026-08-09', 'returned_on' => '2026-08-02'],
        ['variety' => 'Genovese', 'member' => 'marit@example.org', 'borrowed_on' => '2026-02-16', 'due_on' => '2026-08-16', 'returned_on' => '2026-07-30'],
        ['variety' => 'Nantes 2', 'member' => 'tomas@example.org', 'borrowed_on' => '2026-01-26', 'due_on' => '2026-07-26', 'returned_on' => null],
        ['variety' => 'Chioggia', 'member' => 'tomas@example.org', 'borrowed_on' => '2026-04-06', 'due_on' => '2026-10-06', 'returned_on' => null],
    ];

    public function run(): void
    {
        $members = User::query()->get()->keyBy('email');
        $varieties = Variety::query()->get()->keyBy('name');

        foreach (self::LENDING as $row) {
            $packet = Packet::query()
                ->where('variety_id', $varieties[$row['variety']]->id)
                ->where('status', PacketStatus::InStock)
                ->orderBy('id')
                ->firstOrFail();

            $packet->update([
                'status' => $row['returned_on'] === null ? PacketStatus::Borrowed : PacketStatus::Sown,
            ]);

            Borrowing::create([
                'packet_id' => $packet->id,
                'user_id' => $members[$row['member']]->id,
                'borrowed_on' => $row['borrowed_on'],
                'due_on' => $row['due_on'],
                'returned_on' => $row['returned_on'],
            ]);
        }
    }
}
