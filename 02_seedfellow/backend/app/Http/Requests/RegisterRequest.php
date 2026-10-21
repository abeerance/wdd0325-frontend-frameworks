<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Auth\Access\Response;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Registering is how someone becomes a member, so it cannot tell a person apart from
     * someone who already has the address. It says so plainly, and the rate limiter is what
     * stops anyone asking about address after address.
     */
    public const string EMAIL_TAKEN = 'That email already belongs to a member. Log in instead.';

    /**
     * A signed-in member has nothing to register. Refusing here, before the rules run,
     * means they never learn anything from the rules either.
     */
    public function authorize(): Response
    {
        return $this->user() === null
            ? Response::allow()
            : Response::deny('You are already signed in. Log out before registering someone new.');
    }

    /**
     * An address is one mailbox however it is capitalised, and the unique index compares
     * exact text, so store and compare it in one case.
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => Str::lower($this->input('email'))]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email:rfc', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => self::EMAIL_TAKEN,
        ];
    }
}
