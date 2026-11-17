// src/lib/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionState } from "@/lib/action-state";
import { joinSchema } from "@/lib/schemas";
import { keepToken } from "@/lib/session";

// What the API answers a registration with. The member comes too, and is not kept: the next
// page asks for it with the token.
const tokenAnswerSchema = z.object({
  token: z.string(),
  expires_at: z.string(),
});

// What a refusal carries: one sentence for the whole request and, for a 422, a list of
// sentences for every field the API refused.
interface RefusalBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export async function joinLibrary(
  _previous: ActionState | null,
  values: unknown,
): Promise<ActionState> {
  const parsed = joinSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, formError: "That request did not make sense." };
  }

  let response: Response;
  try {
    response = await fetch(`${process.env.API_URL}/api/register`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });
  } catch {
    // No answer came back at all: the API is down, or the network to it is.
    return {
      ok: false,
      formError: "The library could not be reached. Try again in a moment.",
    };
  }

  if (response.status === 201) {
    // Keeps the token the API issued and moves on. `redirect` ends the action, and the page
    // it lands on is rendered with the token already in place.
    const { token, expires_at } = tokenAnswerSchema.parse(
      await response.json(),
    );
    await keepToken(token, expires_at);
    redirect("/");
  }

  if (response.status === 422) {
    // Laravel lists every rule a field broke. The first is the one to fix first.
    const body: RefusalBody = await response.json();
    const fieldErrors: Record<string, string> = {};
    for (const [field, messages] of Object.entries(body.errors ?? {})) {
      fieldErrors[field] = messages[0];
    }
    return {
      ok: false,
      formError: body.message ?? "The library refused that.",
      fieldErrors,
    };
  }

  if (response.status === 429) {
    return {
      ok: false,
      formError: "Too many requests at once. Wait a minute, then try again.",
    };
  }

  return {
    ok: false,
    formError: `Something went wrong. The library answered ${response.status}.`,
  };
}
