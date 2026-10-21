<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Kind;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVarietyRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:100', Rule::unique('varieties', 'name')->ignore($this->route('variety'))],
            'species' => ['sometimes', 'string', 'max:100'],
            'kind' => ['sometimes', Rule::enum(Kind::class)],
            'story' => ['sometimes', 'string', 'max:2000'],
            'sowing_months' => ['sometimes', 'array', 'min:1', 'max:12'],
            'sowing_months.*' => ['integer', 'min:1', 'max:12', 'distinct'],
            'retired' => ['sometimes', 'boolean'],
            // Null clears the credit. A credit needs a photograph to describe, so a variety
            // without one refuses anything else.
            'photo_credit' => [
                'sometimes',
                'nullable',
                Rule::prohibitedIf($this->route('variety')->photo_path === null),
                'array:author,licence,source_url,modified',
                'required_array_keys:author,licence,source_url,modified',
            ],
            'photo_credit.author' => ['string', 'max:255'],
            'photo_credit.licence' => ['string', 'max:100'],
            'photo_credit.source_url' => ['string', 'max:2048', 'url:https'],
            'photo_credit.modified' => ['boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo_credit.prohibited' => 'That variety has no photo to credit.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'photo_credit.author' => 'author',
            'photo_credit.licence' => 'licence',
            'photo_credit.source_url' => 'source URL',
            'photo_credit.modified' => 'modified',
        ];
    }
}
