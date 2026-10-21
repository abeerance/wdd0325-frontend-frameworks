<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\PacketStatus;
use App\Http\Requests\IndexVarietyRequest;
use App\Http\Requests\StoreVarietyRequest;
use App\Http\Requests\UpdateVarietyRequest;
use App\Http\Resources\VarietyCollection;
use App\Http\Resources\VarietyResource;
use App\Models\HarvestNote;
use App\Models\Variety;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class VarietyController extends Controller
{
    public function index(IndexVarietyRequest $request): VarietyCollection
    {
        $varieties = Variety::query()
            ->withCount('packetsInStock')
            ->when($request->has('kind'), fn (Builder $query) => $query->where('kind', $request->string('kind')))
            ->when($request->has('sowing_month'), fn (Builder $query) => $query->whereJsonContains('sowing_months', $request->integer('sowing_month')))
            ->when($request->has('q'), fn (Builder $query) => $query->where(function (Builder $match) use ($request): void {
                // % and _ are wildcards to ilike, and \ is its escape character. Escaping all
                // three makes a search for "100%" look for those four characters.
                $term = '%'.addcslashes($request->string('q')->value(), '\\%_').'%';
                $match->where('name', 'ilike', $term)->orWhere('species', 'ilike', $term);
            }))
            ->when($request->has('in_stock'), fn (Builder $query) => $request->boolean('in_stock')
                ? $query->inStock()
                : $query->whereDoesntHave('packetsInStock'))
            ->orderBy('name')
            ->paginate($request->integer('per_page', 15))
            ->withQueryString();

        return new VarietyCollection($varieties);
    }

    public function show(Variety $variety): VarietyResource
    {
        $variety->loadCount('packetsInStock');

        $notes = HarvestNote::query()
            ->whereHas('borrowing.packet', fn (Builder $packets) => $packets->where('variety_id', $variety->id))
            ->with('borrowing.user')
            ->latest('id')
            ->get();

        // A note hangs off a borrowing, which hangs off a packet, so there is no single
        // relation from a variety to its notes. The query above finds them; this attaches them.
        $variety->setRelation('harvestNotes', $notes);

        return new VarietyResource($variety);
    }

    public function store(StoreVarietyRequest $request): VarietyResource
    {
        $variety = Variety::create($request->validated());

        return new VarietyResource($variety->loadCount('packetsInStock'));
    }

    public function update(UpdateVarietyRequest $request, Variety $variety): VarietyResource
    {
        DB::transaction(function () use ($request, $variety): void {
            $variety->fill($request->safe()->except('retired'));

            if ($request->has('retired')) {
                $this->setRetirement($variety, $request->boolean('retired'));
            }

            $variety->save();
        });

        return new VarietyResource($variety->loadCount('packetsInStock'));
    }

    /**
     * Retiring a variety takes its unborrowed packets off the shelf; bringing it back puts them there again.
     * Packets already out with a member are untouched either way.
     */
    private function setRetirement(Variety $variety, bool $retired): void
    {
        if ($retired && ! $variety->isRetired()) {
            $variety->retired_at = now();
            $variety->packetsInStock()->update(['status' => PacketStatus::Retired]);
        }

        if (! $retired && $variety->isRetired()) {
            $variety->retired_at = null;
            $variety->packets()->where('status', PacketStatus::Retired)->update(['status' => PacketStatus::InStock]);
        }
    }
}
