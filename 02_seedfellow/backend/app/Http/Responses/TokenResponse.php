<?php

declare(strict_types=1);

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\JsonResponse;

/**
 * What logging in and registering both answer: a fresh token and the member it belongs to.
 *
 * The token is shown once, here, and only its hash is stored, so a frontend that loses it
 * logs in again. `expires_at` is the moment the API stops accepting it, for the frontend to
 * give its own cookie the same lifetime.
 */
final readonly class TokenResponse implements Responsable
{
    public function __construct(
        private User $member,
        private int $status = 200,
    ) {}

    public function toResponse($request): JsonResponse
    {
        $token = $this->member->createToken('frontend', ['*'], now()->addMinutes((int) config('sanctum.expiration')));

        return response()->json([
            'token' => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at,
            'member' => $this->member,
        ], $this->status);
    }
}
