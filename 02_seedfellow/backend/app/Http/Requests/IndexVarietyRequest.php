<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Kind;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexVarietyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * A query string carries words, not types. "in_stock=true" is how a browser writes a
     * boolean, so turn it into one before the boolean rule looks at it.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('in_stock')) {
            $this->merge(['in_stock' => filter_var($this->query('in_stock'), FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE)]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'kind' => ['sometimes', Rule::enum(Kind::class)],
            'sowing_month' => ['sometimes', 'integer', 'min:1', 'max:12'],
            'in_stock' => ['sometimes', 'boolean'],
            'q' => ['sometimes', 'string', 'max:100'],
        ];
    }
}
