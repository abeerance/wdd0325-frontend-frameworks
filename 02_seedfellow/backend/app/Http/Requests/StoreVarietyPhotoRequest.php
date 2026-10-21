<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The variety photograph. Only a librarian may upload one.
 */
class StoreVarietyPhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('variety'));
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
