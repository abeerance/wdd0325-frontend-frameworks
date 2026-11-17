"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PasswordField } from "@/components/ui/password-field";
import { TextField } from "@/components/ui/text-field";
import { signIn } from "@/lib/actions/auth";
import { LoginValues, loginSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils/cn";

// The outline a keyboard user sees on the focused control, so they know where they are.
const FOCUS_RING_CLASSES =
  "focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

// The sign-in form. The login page renders it.
export function LoginForm() {
  // useActionState runs the Server Action and keeps what it returned in `state`.
  // `isPending` is true from the moment the action starts until it finishes.
  const [state, signInAction, isPending] = useActionState(signIn, null);
  // The resolver checks the values in the browser with the same Zod schema the server uses.
  // That gives quick feedback. The server still checks again, because a browser check can be skipped.
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // A refusal arrives in `state`; the form keeps its errors in a store of its own. One
  // sentence covers both boxes, for an unknown address and a wrong password alike. The API
  // files it under `email`, but it is shown above the button, under neither box. A success
  // never arrives here: the action redirects.
  useEffect(() => {
    if (state !== null && !state.ok) {
      // "root.server" is an error that belongs to no box. It carries the one sentence for the whole form.
      setError("root.server", { message: state.formError });
    }
  }, [state, setError]);

  // handleSubmit runs the Zod check first, so only valid values reach the callback.
  // startTransition lets React track the action as a transition. That is what keeps `isPending` right,
  // and React asks for it when an action is called outside a form's own `action`.
  return (
    <form
      onSubmit={handleSubmit((values) =>
        startTransition(() => signInAction(values)),
      )}
      method="post"
      noValidate
      className="flex flex-col gap-5"
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="username"
        registration={register("email")}
        error={errors.email?.message}
      />
      {/* register hands the box to React Hook Form, which reads the typed value when the form is submitted. */}
      <PasswordField
        autoComplete="current-password"
        password={register("password")}
        passwordError={errors.password?.message}
      />
      {/* The sentence for the whole form, put there by the effect above. role="alert" makes a screen reader read it out. */}
      {errors.root?.server === undefined ? null : (
        <p
          role="alert"
          className="rounded-2xl border border-clay px-4 py-3 text-clay text-sm"
        >
          {errors.root.server.message}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "min-h-11 rounded-full bg-moss px-5 font-medium text-card text-sm motion-safe:transition-colors hover:bg-moss-deep disabled:cursor-wait disabled:bg-stone",
          FOCUS_RING_CLASSES,
        )}
      >
        {isPending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
