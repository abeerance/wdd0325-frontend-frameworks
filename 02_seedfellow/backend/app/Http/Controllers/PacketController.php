<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\PacketStatus;
use App\Http\Requests\StorePacketRequest;
use App\Http\Resources\VarietyResource;
use App\Models\Variety;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PacketController extends Controller
{
    /**
     * A librarian accepting returned seed onto the shelf: one envelope, one packet.
     */
    public function store(StorePacketRequest $request, Variety $variety): JsonResponse
    {
        abort_if($variety->isRetired(), 409, 'That variety has been retired.');

        $count = $request->integer('count');

        DB::transaction(function () use ($variety, $count): void {
            foreach (range(1, $count) as $ignored) {
                $variety->packets()->create(['status' => PacketStatus::InStock]);
            }
        });

        // New packets are new rows, so the answer is a 201 even though it carries the variety.
        return (new VarietyResource($variety->loadCount('packetsInStock')))->response()->setStatusCode(201);
    }
}
