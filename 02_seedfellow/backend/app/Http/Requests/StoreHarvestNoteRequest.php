<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\HarvestNote;
use Illuminate\Foundation\Http\FormRequest;

class StoreHarvestNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', [HarvestNote::class, $this->route('borrowing')]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:2000'],
            'seeds_sown' => ['required', 'integer', 'min:1', 'max:10000'],
            'seeds_germinated' => ['required', 'integer', 'min:0', 'lte:seeds_sown'],
        ];
    }
}
