<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Kind;
use App\Enums\PacketStatus;
use App\Models\Concerns\HasPhoto;
use App\ValueObjects\PhotoCredit;
use Database\Factories\VarietyFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'species', 'kind', 'story', 'sowing_months', 'photo_credit'])]
class Variety extends Model
{
    /** @use HasFactory<VarietyFactory> */
    use HasFactory;

    use HasPhoto;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kind' => Kind::class,
            'sowing_months' => 'array',
            'photo_credit' => PhotoCredit::class,
            'retired_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<Packet, $this>
     */
    public function packets(): HasMany
    {
        return $this->hasMany(Packet::class);
    }

    /**
     * The envelopes a member could borrow right now. The one place that says what
     * "on the shelf" means: counting them, filtering by them and borrowing all agree.
     *
     * @return HasMany<Packet, $this>
     */
    public function packetsInStock(): HasMany
    {
        return $this->packets()->where('status', PacketStatus::InStock);
    }

    public function isRetired(): bool
    {
        return $this->retired_at !== null;
    }

    /**
     * @param  Builder<$this>  $query
     */
    public function scopeInStock(Builder $query): void
    {
        $query->whereHas('packetsInStock');
    }
}
