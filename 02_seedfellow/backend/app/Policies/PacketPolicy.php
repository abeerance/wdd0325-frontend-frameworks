<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;

class PacketPolicy
{
    public function create(User $user): bool
    {
        return $user->is_librarian;
    }
}
