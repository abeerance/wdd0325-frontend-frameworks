<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Concerns\HasPhoto;
use Database\Factories\HarvestNoteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['body', 'seeds_sown', 'seeds_germinated'])]
class HarvestNote extends Model
{
    /** @use HasFactory<HarvestNoteFactory> */
    use HasFactory;

    use HasPhoto;

    /**
     * @return BelongsTo<Borrowing, $this>
     */
    public function borrowing(): BelongsTo
    {
        return $this->belongsTo(Borrowing::class);
    }
}
