<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Borrowing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Borrowing
 */
class BorrowingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'packet_id' => $this->packet_id,
            'user_id' => $this->user_id,
            'borrowed_on' => $this->borrowed_on->toDateString(),
            'due_on' => $this->due_on->toDateString(),
            'returned_on' => $this->returned_on?->toDateString(),
            'variety' => new VarietySummaryResource($this->whenLoaded('packet', fn () => $this->packet->variety)),
            // Null until the member writes one, so a frontend knows whether to offer the form.
            'harvest_note' => new HarvestNoteResource($this->whenLoaded('harvestNote')),
        ];
    }
}
