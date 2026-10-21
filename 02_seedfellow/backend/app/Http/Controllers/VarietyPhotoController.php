<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreVarietyPhotoRequest;
use App\Http\Resources\VarietyResource;
use App\Http\Responses\PhotoResponse;
use App\Models\Variety;
use Illuminate\Http\JsonResponse;

class VarietyPhotoController extends Controller
{
    /**
     * The answer is the variety, which now says `has_photo: true` and carries the new
     * `photo_version`. Where the file sits on the disk is the server's business, so the
     * path never leaves it.
     */
    public function store(StoreVarietyPhotoRequest $request, Variety $variety): JsonResponse
    {
        // A new photograph has its own author and licence. The old credit describes a
        // picture that is gone, so it goes with it until a librarian records the new one.
        $variety->photo_credit = null;
        $variety->replacePhoto($request->file('photo'), 'varieties');

        return (new VarietyResource($variety->loadCount('packetsInStock')))->response()->setStatusCode(201);
    }

    public function show(Variety $variety): PhotoResponse
    {
        abort_if($variety->photo_path === null, 404, 'That variety has no photo.');

        return new PhotoResponse($variety->photo_path, $variety->photo_version);
    }
}
