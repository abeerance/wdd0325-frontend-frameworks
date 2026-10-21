<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\HarvestNote;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateHarvestNoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('harvestNote'));
    }

    /**
     * A partial update: every field is optional, and each one that is sent is held to the
     * same rules as when the note was written.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'body' => ['sometimes', 'required', 'string', 'max:2000'],
            'seeds_sown' => ['sometimes', 'required', 'integer', 'min:1', 'max:10000'],
            'seeds_germinated' => ['sometimes', 'required', 'integer', 'min:0'],
        ];
    }

    /**
     * Germinated can never exceed sown, and either number may be the one that did not
     * change, so the check has to read the stored value for whichever was left out.
     *
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                /** @var HarvestNote $note */
                $note = $this->route('harvestNote');
                $sown = (int) $this->input('seeds_sown', $note->seeds_sown);
                $germinated = (int) $this->input('seeds_germinated', $note->seeds_germinated);

                if ($germinated > $sown) {
                    $validator->errors()->add(
                        'seeds_germinated',
                        'More seeds cannot have germinated than were sown.',
                    );
                }
            },
        ];
    }
}
