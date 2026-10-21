<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\PacketStatus;
use App\Http\Requests\ReturnBorrowingRequest;
use App\Http\Requests\StoreBorrowingRequest;
use App\Http\Resources\BorrowingResource;
use App\Models\Borrowing;
use App\Models\Variety;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class BorrowingController extends Controller
{
    /**
     * What the signed-in member has out, and what they have already given back.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $borrowings = $request->user()
            ->borrowings()
            ->with(['packet.variety', 'harvestNote'])
            ->orderByRaw('returned_on is not null')
            ->orderBy('due_on')
            ->get();

        return BorrowingResource::collection($borrowings);
    }

    public function store(StoreBorrowingRequest $request): BorrowingResource
    {
        $variety = Variety::findOrFail($request->integer('variety_id'));

        abort_if($variety->isRetired(), 409, 'That variety has been retired.');

        $borrowing = DB::transaction(function () use ($variety, $request): Borrowing {
            // The row lock is the whole point: two members clicking at the same moment
            // queue here, and the second one finds no packet left rather than taking the same one.
            $packet = $variety->packetsInStock()
                ->orderBy('id')
                ->lockForUpdate()
                ->first();

            abort_if($packet === null, 409, 'That variety has no packets left.');

            $packet->update(['status' => PacketStatus::Borrowed]);

            return Borrowing::create([
                'packet_id' => $packet->id,
                'user_id' => $request->user()->id,
                'borrowed_on' => today(),
                'due_on' => today()->addMonths(6),
            ]);
        });

        return new BorrowingResource($borrowing->load(['packet.variety', 'harvestNote']));
    }

    /**
     * The member has grown the packet out. The envelope is spent; the seed they return
     * comes back onto the shelf as new packets, which a librarian accepts.
     */
    public function update(ReturnBorrowingRequest $request, Borrowing $borrowing): BorrowingResource
    {
        abort_if($borrowing->isReturned(), 409, 'That packet has already been returned.');

        DB::transaction(function () use ($borrowing): void {
            $borrowing->update(['returned_on' => today()]);
            $borrowing->packet->update(['status' => PacketStatus::Sown]);
        });

        return new BorrowingResource($borrowing->load(['packet.variety', 'harvestNote']));
    }
}
