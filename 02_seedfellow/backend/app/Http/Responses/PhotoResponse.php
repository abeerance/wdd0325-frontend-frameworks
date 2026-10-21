<?php

declare(strict_types=1);

namespace App\Http\Responses;

use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * A photograph off the private disk, with the caching its URL has earned.
 *
 * `?v=` carrying the current version names these exact bytes, which can never change, so
 * any cache may keep them for a year without asking again. Any other URL for the photo may
 * be replaced at any moment, so a cache must check back every time; the ETag makes that
 * check a `304` with no body while the picture is unchanged.
 */
final readonly class PhotoResponse implements Responsable
{
    private const ONE_YEAR = 31536000;

    public function __construct(
        private string $path,
        private string $version,
    ) {}

    public function toResponse($request): StreamedResponse
    {
        // Named after the version, not the stored file, so the answer carries no part of the path.
        $response = Storage::response($this->path, $this->version.'.'.pathinfo($this->path, PATHINFO_EXTENSION));

        $response->setPublic();
        $response->setEtag($this->version);

        if ($this->isVersioned($request)) {
            $response->setMaxAge(self::ONE_YEAR);
            $response->setImmutable();
        } else {
            $response->headers->addCacheControlDirective('no-cache');
        }

        $response->isNotModified($request);

        return $response;
    }

    private function isVersioned(Request $request): bool
    {
        return $request->query('v') === $this->version;
    }
}
