<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * A model with one photograph: `photo_path` says where the file is on the private disk,
 * `photo_version` is a fingerprint of its bytes. The path stays on the server; the version
 * goes into the photo's URL, so a changed picture gets a new URL and a cached one can be
 * kept for a year.
 *
 * @property string|null $photo_path
 * @property string|null $photo_version
 */
trait HasPhoto
{
    /**
     * Store the upload, point the model at it, then delete the file it replaces. The old
     * file goes last, so a failed save never leaves the row pointing at nothing.
     */
    public function replacePhoto(UploadedFile $photo, string $directory): void
    {
        $previous = $this->photo_path;

        $this->photo_path = $photo->store($directory);
        $this->photo_version = self::photoVersion($photo->getRealPath());
        $this->save();

        if ($previous !== null) {
            Storage::delete($previous);
        }
    }

    /**
     * The first 16 hex characters of the file's SHA-256: the same bytes always give the same
     * version, and different bytes give a different one. 64 bits is far past any chance of two
     * photographs colliding, and short enough to sit in a URL.
     */
    public static function photoVersion(string $file): string
    {
        return substr(hash_file('sha256', $file), 0, 16);
    }
}
