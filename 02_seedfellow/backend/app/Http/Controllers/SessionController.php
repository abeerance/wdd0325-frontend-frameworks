<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class SessionController extends Controller
{
    public function store(LoginRequest $request): JsonResponse
    {
        abort_unless($request->hasSession(), 400, 'A login needs a session, and this request was not given one. Send it from an allowed origin.');

        if (! Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages(['email' => 'Those details did not match.']);
        }

        $request->session()->regenerate();

        return response()->json($request->user());
    }

    public function destroy(Request $request): Response
    {
        abort_unless($request->hasSession(), 400, 'A logout needs a session, and this request was not given one. Send it from an allowed origin.');

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
