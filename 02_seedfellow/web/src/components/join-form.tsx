// src/components/join-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PasswordField } from "@/components/password-field";
import { TextField } from "@/components/text-field";
import { joinLibrary } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";
import { type JoinValues, joinSchema } from "@/lib/schemas";

const FOCUS_RING_CLASSES =
  "focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

export function JoinForm() {
  const [state, submitJoin, isPending] = useActionState(joinLibrary, null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<JoinValues>({ resolver: zodResolver(joinSchema) });

  // A refusal arrives in `state`; the form keeps its errors in a store of its own. The
  // sentence the API wrote goes above the button. A success never arrives here: the action
  // redirects. The API also names the fields it refused, in `state.fieldErrors`. Night 17
  // puts each of those sentences under its own box.
  useEffect(() => {
    if (state === null || state.ok) {
      return;
    }

    setError("root.server", { message: state.formError });
  }, [state, setError]);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        startTransition(() => submitJoin(values)),
      )}
      method="post"
      noValidate
      className="flex flex-col gap-5"
    >
      <TextField
        label="Name"
        type="text"
        autoComplete="name"
        registration={register("name")}
        error={errors.name?.message}
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        registration={register("email")}
        error={errors.email?.message}
      />

      <PasswordField
        autoComplete="new-password"
        password={register("password")}
        passwordError={errors.password?.message}
        confirmation={register("password_confirmation")}
        confirmationError={errors.password_confirmation?.message}
      />

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
        {isPending ? "Joining" : "Join the library"}
      </button>
    </form>
  );
}
