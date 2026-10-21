<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Variety;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The variety as it appears inside another answer: enough to name it and link to it,
 * without the counts that only a catalogue query knows.
 *
 * @mixin Variety
 */
class VarietySummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'species' => $this->species,
            'kind' => $this->kind->value,
            'has_photo' => $this->photo_path !== null,
            'photo_version' => $this->photo_version,
            'photo_credit' => $this->photo_credit,
        ];
    }
}
