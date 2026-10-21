<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PacketStatus;
use Database\Factories\PacketFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['variety_id', 'status'])]
class Packet extends Model
{
    /** @use HasFactory<PacketFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => PacketStatus::class,
        ];
    }

    /**
     * @return BelongsTo<Variety, $this>
     */
    public function variety(): BelongsTo
    {
        return $this->belongsTo(Variety::class);
    }

    /**
     * @return HasMany<Borrowing, $this>
     */
    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class);
    }
}
