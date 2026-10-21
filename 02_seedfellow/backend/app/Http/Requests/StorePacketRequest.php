<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Packet;
use Illuminate\Foundation\Http\FormRequest;

class StorePacketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Packet::class);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'count' => ['required', 'integer', 'min:1', 'max:50'],
        ];
    }
}
