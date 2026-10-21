<?php

declare(strict_types=1);

namespace App\Enums;

enum Kind: string
{
    case Vegetable = 'vegetable';
    case Herb = 'herb';
    case Flower = 'flower';
    case Grain = 'grain';
}
