<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreHarvestNotePhotoRequest;
use App\Http\Resources\HarvestNoteResource;
use App\Http\Responses\PhotoResponse;
use App\Models\HarvestNote;
use Illuminate\Http\JsonResponse;

class HarvestNotePhotoController extends Controller
{
    /**
     * The answer is the note, which now says `has_photo: true` and carries the new
     * `photo_version`. Where the file sits on the disk is the server's business, so the
     * path never leaves it.
     */
    public function store(StoreHarvestNotePhotoRequest $request, HarvestNote $harvestNote): JsonResponse
    {
        $harvestNote->replacePhoto($request->file('photo'), 'harvest-notes');

        return (new HarvestNoteResource($harvestNote->load('borrowing.user')))->response()->setStatusCode(201);
    }

    public function show(HarvestNote $harvestNote): PhotoResponse
    {
        abort_if($harvestNote->photo_path === null, 404, 'That harvest note has no photo.');

        return new PhotoResponse($harvestNote->photo_path, $harvestNote->photo_version);
    }
}
