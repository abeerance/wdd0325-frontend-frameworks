<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Borrowing;
use App\Models\HarvestNote;
use App\Models\User;

/**
 * A harvest note is the grower's own account, so only the member who borrowed the packet
 * may write it, correct it or delete it.
 */
class HarvestNotePolicy
{
    public function create(User $user, Borrowing $borrowing): bool
    {
        return $borrowing->user_id === $user->id;
    }

    public function update(User $user, HarvestNote $harvestNote): bool
    {
        return $harvestNote->borrowing->user_id === $user->id;
    }

    public function delete(User $user, HarvestNote $harvestNote): bool
    {
        return $harvestNote->borrowing->user_id === $user->id;
    }
}
