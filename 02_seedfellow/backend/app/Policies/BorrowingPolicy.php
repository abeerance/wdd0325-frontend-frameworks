<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Borrowing;
use App\Models\User;

class BorrowingPolicy
{
    /**
     * Returning seed belongs to the member who borrowed the packet.
     */
    public function update(User $user, Borrowing $borrowing): bool
    {
        return $borrowing->user_id === $user->id;
    }
}
