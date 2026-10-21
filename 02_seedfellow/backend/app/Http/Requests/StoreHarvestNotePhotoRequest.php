<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * A photograph of the harvest. Only the member who wrote the note may attach one.
 */
class StoreHarvestNotePhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('harvestNote'));
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'photo' => ['required', 'file', 'mimes:jpeg,png', 'max:1024'],
        ];
    }
}
