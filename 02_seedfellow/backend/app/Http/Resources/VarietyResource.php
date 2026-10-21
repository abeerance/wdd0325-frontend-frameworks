<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\HarvestNote;
use App\Models\Variety;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Variety
 */
class VarietyResource extends JsonResource
{
    /**
     * `packets_in_stock_count` exists only when the query asked for it with
     * `withCount('packetsInStock')` or `loadCount('packetsInStock')`. It is read without a
     * fallback on purpose: an endpoint that forgets the count answers null, and its test fails,
     * instead of quietly reporting an empty shelf.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'species' => $this->species,
            'kind' => $this->kind->value,
            'story' => $this->story,
            'sowing_months' => $this->sowing_months,
            'packets_available' => $this->packets_in_stock_count,
            'retired' => $this->isRetired(),
            'has_photo' => $this->photo_path !== null,
            'photo_version' => $this->photo_version,
            'photo_credit' => $this->photo_credit,
            'germination_rate' => $this->whenLoaded('harvestNotes', fn (Collection $notes): ?float => $this->germinationRate($notes)),
            'harvest_notes' => HarvestNoteResource::collection($this->whenLoaded('harvestNotes')),
        ];
    }

    /**
     * Seeds that came up, over seeds that went in, across every harvest note the variety has.
     * Null until somebody has written a note, because a rate of nothing is not zero.
     *
     * @param  Collection<int, HarvestNote>  $notes
     */
    private function germinationRate(Collection $notes): ?float
    {
        $sown = $notes->sum('seeds_sown');

        if ($sown === 0) {
            return null;
        }

        return round($notes->sum('seeds_germinated') / $sown, 2);
    }
}
