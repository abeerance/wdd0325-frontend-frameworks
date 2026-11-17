// src/lib/action-state.ts

// What every action answers with. A refusal always carries one sentence for the member.
// When the API named fields, it also carries one message per field, under the API's own
// field names, which are the form's names too.
export type ActionState =
  | { ok: true; message: string }
  | { ok: false; formError: string; fieldErrors?: Record<string, string> };
