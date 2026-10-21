<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreHarvestNoteRequest;
use App\Http\Requests\UpdateHarvestNoteRequest;
use App\Http\Resources\HarvestNoteResource;
use App\Models\Borrowing;
use App\Models\HarvestNote;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class HarvestNoteController extends Controller
{
    /**
     * What grew, written by the member who grew it. One note per borrowing.
     */
    public function store(StoreHarvestNoteRequest $request, Borrowing $borrowing): HarvestNoteResource
    {
        abort_unless($borrowing->isReturned(), 409, 'A harvest note belongs to a packet that has been returned.');
        abort_if($borrowing->harvestNote()->exists(), 409, 'That borrowing already has a harvest note.');

        $note = $borrowing->harvestNote()->create($request->validated());

        return new HarvestNoteResource($note->load('borrowing.user'));
    }

    /**
     * Correcting a note after the fact. Only the member who grew the packet may.
     */
    public function update(UpdateHarvestNoteRequest $request, HarvestNote $harvestNote): HarvestNoteResource
    {
        $harvestNote->update($request->validated());

        return new HarvestNoteResource($harvestNote->load('borrowing.user'));
    }

    /**
     * Deleting the note and its photograph with it. The borrowing stays: the packet was
     * still lent and still returned, whatever was written about it afterwards.
     */
    public function destroy(HarvestNote $harvestNote): Response
    {
        Gate::authorize('delete', $harvestNote);

        $photo = $harvestNote->photo_path;
        $harvestNote->delete();

        if ($photo !== null) {
            Storage::delete($photo);
        }

        return response()->noContent();
    }
}
