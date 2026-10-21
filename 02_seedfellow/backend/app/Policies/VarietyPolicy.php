<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\Variety;

class VarietyPolicy
{
    public function create(User $user): bool
    {
        return $user->is_librarian;
    }

    public function update(User $user, Variety $variety): bool
    {
        return $user->is_librarian;
    }
}
