<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class VarietyCollection extends ResourceCollection
{
    public $collects = VarietyResource::class;

    /**
     * The pager's own list of page links is for a rendered pager, which this API does not have.
     *
     * @return array<string, mixed>
     */
    public function paginationInformation(Request $request, array $paginated, array $default): array
    {
        unset($default['meta']['links']);

        return $default;
    }
}
