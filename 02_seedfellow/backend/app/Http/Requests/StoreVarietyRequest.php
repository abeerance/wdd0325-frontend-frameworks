<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Kind;
use App\Models\Variety;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVarietyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Variety::class);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100', Rule::unique('varieties', 'name')],
            'species' => ['required', 'string', 'max:100'],
            'kind' => ['required', Rule::enum(Kind::class)],
            'story' => ['required', 'string', 'max:2000'],
            'sowing_months' => ['required', 'array', 'min:1', 'max:12'],
            'sowing_months.*' => ['integer', 'min:1', 'max:12', 'distinct'],
            // Said out loud rather than dropped: a new variety has no photograph yet, and the
            // credit is recorded once one is uploaded.
            'photo_credit' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo_credit.prohibited' => 'A new variety has no photo to credit yet.',
        ];
    }
}
