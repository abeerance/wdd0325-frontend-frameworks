<?php

declare(strict_types=1);

namespace App\ValueObjects;

use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use JsonSerializable;

/**
 * Who took a photograph and on what terms it may be shown. Most of the seeded photographs
 * are CC BY or CC BY-SA, which allow reuse only with this attribution visible beside them,
 * and CC BY-SA also asks that a changed picture says so.
 */
final readonly class PhotoCredit implements Castable, JsonSerializable
{
    public function __construct(
        public string $author,
        public string $licence,
        public string $sourceUrl,
        public bool $modified,
    ) {}

    /**
     * @param  array{author: string, licence: string, source_url: string, modified: bool|int|string}  $credit
     */
    public static function fromArray(array $credit): self
    {
        return new self(
            $credit['author'],
            $credit['licence'],
            $credit['source_url'],
            // A multipart form sends "1" and "0"; the validator has already refused anything else.
            filter_var($credit['modified'], FILTER_VALIDATE_BOOLEAN),
        );
    }

    /**
     * @return array{author: string, licence: string, source_url: string, modified: bool}
     */
    public function jsonSerialize(): array
    {
        return [
            'author' => $this->author,
            'licence' => $this->licence,
            'source_url' => $this->sourceUrl,
            'modified' => $this->modified,
        ];
    }

    /**
     * Stored as one jsonb column. The model reads a PhotoCredit and accepts either a
     * PhotoCredit or the validated array a request sends.
     *
     * @param  array<int, mixed>  $arguments
     * @return CastsAttributes<self, self|array<string, mixed>>
     */
    public static function castUsing(array $arguments): CastsAttributes
    {
        return new class implements CastsAttributes
        {
            public function get(Model $model, string $key, mixed $value, array $attributes): ?PhotoCredit
            {
                return $value === null
                    ? null
                    : PhotoCredit::fromArray(json_decode($value, true, flags: JSON_THROW_ON_ERROR));
            }

            public function set(Model $model, string $key, mixed $value, array $attributes): ?string
            {
                if ($value === null) {
                    return null;
                }

                $credit = $value instanceof PhotoCredit ? $value : PhotoCredit::fromArray($value);

                return json_encode($credit, JSON_THROW_ON_ERROR);
            }
        };
    }
}
