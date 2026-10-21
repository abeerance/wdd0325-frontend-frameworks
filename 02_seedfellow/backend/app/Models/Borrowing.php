<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\BorrowingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['packet_id', 'user_id', 'borrowed_on', 'due_on', 'returned_on'])]
class Borrowing extends Model
{
    /** @use HasFactory<BorrowingFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'borrowed_on' => 'date',
            'due_on' => 'date',
            'returned_on' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Packet, $this>
     */
    public function packet(): BelongsTo
    {
        return $this->belongsTo(Packet::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasOne<HarvestNote, $this>
     */
    public function harvestNote(): HasOne
    {
        return $this->hasOne(HarvestNote::class);
    }

    public function isReturned(): bool
    {
        return $this->returned_on !== null;
    }
}
