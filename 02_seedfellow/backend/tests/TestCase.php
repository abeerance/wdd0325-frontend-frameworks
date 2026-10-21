<?php

declare(strict_types=1);

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Sanctum only gives a session to a request that came from the frontend, which it
     * recognises by the Origin header. A browser always sends one; a test has to say so.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->withHeader('Origin', 'http://localhost');
    }
}
