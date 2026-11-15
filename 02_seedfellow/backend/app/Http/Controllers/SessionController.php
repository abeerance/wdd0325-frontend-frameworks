<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Responses\TokenResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class SessionController extends Controller
{
    public function store(LoginRequest $request): TokenResponse
    {
        // `validate` checks the details and signs nobody in: there is no session to sign
        // them in to. It keeps the same timing for an unknown address as for a wrong
        // password, so the answer does not say which addresses have an account.
        $guard = Auth::guard('web');

        if (! $guard->validate($request->only('email', 'password'))) {
            throw ValidationException::withMessages(['email' => 'Those details did not match.']);
        }

        return new TokenResponse($guard->getLastAttempted());
    }

    /**
     * Deleting the row is the logout: the token stops working on the next request.
     */
    public function destroy(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
