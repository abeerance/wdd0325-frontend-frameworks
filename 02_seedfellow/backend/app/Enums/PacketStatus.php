<?php

declare(strict_types=1);

namespace App\Enums;

enum PacketStatus: string
{
    /** On the shelf, available to borrow. */
    case InStock = 'in_stock';

    /** With a member, not yet grown out. */
    case Borrowed = 'borrowed';

    /** Sown by the member the library lent it to. The envelope is spent. */
    case Sown = 'sown';

    /** Withdrawn from the shelf, because the variety was retired. */
    case Retired = 'retired';
}
