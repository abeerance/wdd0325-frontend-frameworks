<?php

declare(strict_types=1);

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PATCH', 'DELETE'],

    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    // The contract tells callers to read their rate-limit budget off the answer.
    // Cross-origin JavaScript can only see a header that is exposed here.
    'exposed_headers' => ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'Retry-After'],

    'max_age' => 3600,

    'supports_credentials' => true,

];
