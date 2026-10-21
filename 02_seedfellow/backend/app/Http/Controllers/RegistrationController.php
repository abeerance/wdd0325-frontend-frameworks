<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
    /**
     * A new member, signed in on the same session, the way a login would leave them.
     */
    public function store(RegisterRequest $request): JsonResponse
    {
        abort_unless($request->hasSession(), 400, 'A registration needs a session, and this request was not given one. Send it from an allowed origin.');

        // Only the validated fields reach the model, and `is_librarian` is not fillable, so a
        // new account is always a plain member whatever the request sent.
        try {
            $member = User::create($request->validated());
        } catch (UniqueConstraintViolationException) {
            // Two registrations for one address can both pass the unique rule before either
            // is saved. The index lets only one of them in; the other hears what a later
            // attempt would have.
            throw ValidationException::withMessages(['email' => RegisterRequest::EMAIL_TAKEN]);
        }

        // Read the row back, so the answer carries what the database filled in
        // (`is_librarian`) and is exactly what `GET /api/user` will say.
        $member->refresh();

        Auth::login($member);
        $request->session()->regenerate();

        return response()->json($member, 201);
    }
}
