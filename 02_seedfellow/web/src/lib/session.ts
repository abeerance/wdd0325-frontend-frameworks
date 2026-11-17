// src/lib/session.ts
import "server-only";
import { cookies } from "next/headers";

// The one cookie this site sets. It holds the API's token and nothing else.
const TOKEN_COOKIE_NAME = "seedfellow-token";

// Keeps the token the API just issued, for as long as the API will honour it. A browser
// stores it and sends it back, and no script on any page can read it: `httpOnly`. `lax`
// keeps it off a form post or background request another site starts, and still sends it
// when someone follows a link to this site. It is `secure` wherever the site is served over
// https, which is everywhere but a laptop. Only code that answers a request of its own may set a cookie, which
// is why a page cannot sign anybody in.
export async function keepToken(
  token: string,
  expiresAt: string,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function forgetToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}
