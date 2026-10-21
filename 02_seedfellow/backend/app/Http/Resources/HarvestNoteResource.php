<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\HarvestNote;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin HarvestNote
 */
class HarvestNoteResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'borrowing_id' => $this->borrowing_id,
            'body' => $this->body,
            'seeds_sown' => $this->seeds_sown,
            'seeds_germinated' => $this->seeds_germinated,
            'has_photo' => $this->photo_path !== null,
            'photo_version' => $this->photo_version,
            'written_on' => $this->created_at->toDateString(),
            'grown_by' => $this->whenLoaded('borrowing', fn (): string => $this->borrowing->user->name),
        ];
    }
}
