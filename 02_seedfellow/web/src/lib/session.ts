import "server-only";
import { cookies } from "next/headers";

// The one cookie this site sets. It holds the API's token and nothing else.
const TOKEN_COOKIE_NAME = "seedfellow-token";

// What a caller may add to the request: a method, a body, and headers of its own. The
// headers that say who is asking are not on the list, because they are set below and
// nothing a caller passes can replace them.
interface MemberRequest {
	method?: "POST" | "PATCH" | "DELETE";
	headers?: Record<string, string>;
	body?: string | FormData;
}

// A request to the API on behalf of the member whose browser made this request, or null
// when that browser holds no token and there is nobody to ask for. Nothing else the browser
// sent is passed on: it was given to this site, not to the API.
export async function apiAsMember(
	path: string,
	requestOptions: MemberRequest = {},
): Promise<Response | null> {
	const token = (await cookies()).get(TOKEN_COOKIE_NAME)?.value;

	if (token === undefined) {
		return null;
	}

	// the magic where an already logged in user can communicate with the api
	// with different paths and request options
	return fetch(`${process.env.API_URL}${path}`, {
		...requestOptions,
		headers: {
			...requestOptions.headers,
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
}

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
