<?php

declare(strict_types=1);

return [

    // Only a bearer token signs a request in. The frontend's server sends one; no browser
    // ever talks to this API, so there is no session to fall back on and no cookie to forge.
    'guard' => [],

    // Minutes until a token stops working: seven days. Login stamps the same moment on the
    // row, so the answer can tell the frontend when its own cookie should expire too.
    'expiration' => 10080,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    // The cookie handshake route (`/sanctum/csrf-cookie`) belongs to the session flow this
    // API no longer has.
    'routes' => false,

];
