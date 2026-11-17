// src/lib/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { joinSchema, loginSchema } from "@/lib/schemas";
import { apiAsMember, forgetToken, keepToken } from "@/lib/session";

// What the API answers a registration and a login with. The member comes too, and is not
// kept: the next page asks for it with the token.
const tokenAnswerSchema = z.object({
	token: z.string(),
	expires_at: z.string(),
});

// What came of a request to the API. A number is the status the API answered with, and
// `body` is what it sent when that was JSON, with the two keys a refusal carries named.
// `unreachable` is the case with no answer at all.
type Answer =
	| {
			status: number;
			body: { message?: string; errors?: Record<string, string[]> } | null;
	  }
	| { status: "unreachable"; body: null };

// A request from somebody who has no token yet, which is what joining and signing in are.
// A refusal is an answer, not an exception, so it is read like any other.
async function postAsVisitor(path: string, payload: unknown): Promise<Answer> {
	try {
		const response = await fetch(`${process.env.API_URL}${path}`, {
			method: "POST",
			cache: "no-store",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		const isJson =
			response.headers.get("Content-Type")?.includes("application/json") ??
			false;

		return {
			status: response.status,
			body: isJson ? await response.json() : null,
		};
	} catch {
		// No answer came back at all: the API is down, or the network to it is.
		return { status: "unreachable", body: null };
	}
}

// The refusals that mean the same thing whichever action met them.
function refusalOf(answer: Answer): ActionState {
	if (answer.status === "unreachable") {
		return {
			ok: false,
			formError: "The library could not be reached. Try again in a moment.",
		};
	}

	if (answer.status === 422) {
		// Laravel lists every rule a field broke. The first is the one to fix first.
		const fieldErrors: Record<string, string> = {};
		for (const [field, messages] of Object.entries(answer.body?.errors ?? {})) {
			fieldErrors[field] = messages[0];
		}
		return {
			ok: false,
			formError: answer.body?.message ?? "The library refused that.",
			fieldErrors,
		};
	}

	if (answer.status === 429) {
		return {
			ok: false,
			formError: "Too many requests at once. Wait a minute, then try again.",
		};
	}

	return {
		ok: false,
		formError: `Something went wrong. The library answered ${answer.status}.`,
	};
}

// Keeps the token the API issued and moves on. `redirect` ends the action, and the page it
// lands on is rendered with the token already in place.
async function signedIn(answer: Answer): Promise<never> {
	const { token, expires_at } = tokenAnswerSchema.parse(answer.body);
	await keepToken(token, expires_at);
	redirect("/");
}

export async function joinLibrary(
	_previous: ActionState | null,
	values: unknown,
): Promise<ActionState> {
	const parsed = joinSchema.safeParse(values);

	if (!parsed.success) {
		return { ok: false, formError: "That request did not make sense." };
	}

	const answer = await postAsVisitor("/api/register", parsed.data);

	if (answer.status === 201) {
		return signedIn(answer);
	}

	return refusalOf(answer);
}

export async function signIn(
	_previous: ActionState | null,
	values: unknown,
): Promise<ActionState> {
	const parsed = loginSchema.safeParse(values);

	if (!parsed.success) {
		return { ok: false, formError: "That request did not make sense." };
	}

	const answer = await postAsVisitor("/api/login", parsed.data);

	if (answer.status === 200) {
		return signedIn(answer);
	}

	return refusalOf(answer);
}

// Ends the member's token at the API, then forgets the cookie. `redirect` ends the action.
export async function signOut(): Promise<void> {
	await apiAsMember("/api/logout", { method: "POST" });
	await forgetToken();
	redirect("/");
}
