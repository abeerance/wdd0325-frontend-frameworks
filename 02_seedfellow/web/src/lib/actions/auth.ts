// src/lib/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionState } from "@/lib/actions/action-state";
import { apiAsMember, forgetToken, keepToken } from "@/lib/api/session";
import { joinSchema, loginSchema } from "@/lib/schemas";

// "use server" at the top makes every exported function here a Server Action. It runs only on the server,
// so the API address and the token cookie never reach the browser.

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
      // A sign-in must never be answered from a saved copy.
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    // Only read JSON when the API says it sent JSON. A proxy error page is HTML and would throw.
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
  // Each branch returns what the form shows. A success never comes through here.
  if (answer.status === "unreachable") {
    return {
      ok: false,
      formError: "The library could not be reached. Try again in a moment.",
    };
  }

  // 422 means the API understood the request, but a value broke one of its rules.
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

  // 429 means too many requests: the API slows down anyone who tries again and again.
  if (answer.status === 429) {
    return {
      ok: false,
      formError: "Too many requests at once. Wait a minute, then try again.",
    };
  }

  // Any other status, such as 500: the member cannot fix it, so the form only reports it.
  return {
    ok: false,
    formError: `Something went wrong. The library answered ${answer.status}.`,
  };
}

// Keeps the token the API issued and moves on. `redirect` ends the action, and the page it
// lands on is rendered with the token already in place.
async function signedIn(answer: Answer): Promise<never> {
  // parse throws if the answer has no token. That is a fault in the API, not something to show a member.
  const { token, expires_at } = tokenAnswerSchema.parse(answer.body);
  await keepToken(token, expires_at);
  redirect("/");
}

// The Server Action behind the join form, which useActionState calls.
// `_previous` is the last result, which this action does not need.
// `values` is `unknown` because anything can be sent to a Server Action, so it is checked again here.
export async function joinLibrary(
  _previous: ActionState | null,
  values: unknown,
): Promise<ActionState> {
  // The same schema the form used in the browser. Someone can skip the browser, never this check.
  const parsed = joinSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, formError: "That request did not make sense." };
  }

  const answer = await postAsVisitor("/api/register", parsed.data);

  // 201 Created: the member exists. Keep the token and redirect.
  if (answer.status === 201) {
    return signedIn(answer);
  }

  return refusalOf(answer);
}

// The Server Action behind the sign-in form. Same shape as joinLibrary.
export async function signIn(
  _previous: ActionState | null,
  values: unknown,
): Promise<ActionState> {
  // The same schema the form used in the browser. Someone can skip the browser, never this check.
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, formError: "That request did not make sense." };
  }

  const answer = await postAsVisitor("/api/login", parsed.data);

  // 200 OK: the email and password matched. Keep the token and redirect.
  if (answer.status === 200) {
    return signedIn(answer);
  }

  return refusalOf(answer);
}

// Ends the member's token at the API, then forgets the cookie. `redirect` ends the action.
// SignOutButton's form calls this. The cookie is httpOnly, so only the server can clear it.
export async function signOut(): Promise<void> {
  await apiAsMember("/api/logout", { method: "POST" });
  await forgetToken();
  redirect("/");
}
