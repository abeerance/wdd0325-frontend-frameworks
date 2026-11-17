"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PasswordField } from "@/components/ui/password-field";
import { TextField } from "@/components/ui/text-field";
import { joinLibrary } from "@/lib/actions/auth";
import { isJoinField, type JoinValues, joinSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils/cn";

// The outline a keyboard user sees on the focused control, so they know where they are.
const FOCUS_RING_CLASSES =
	"focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

// The form for becoming a member. The join page renders it.
export function JoinForm() {
	// useActionState runs the Server Action and keeps what it returned in `state`.
	// `isPending` is true from the moment the action starts until it finishes.
	const [state, submitJoin, isPending] = useActionState(joinLibrary, null);
	// The resolver checks the values in the browser with the same Zod schema the server uses.
	// That gives quick feedback. The server still checks again, because a browser check can be skipped.
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<JoinValues>({ resolver: zodResolver(joinSchema) });

	// A refusal arrives in `state`; the form keeps its errors in a store of its own. Each
	// sentence the API wrote goes under the box it is about. A success never arrives here:
	// the action redirects.
	useEffect(() => {
		if (state === null || state.ok) {
			return;
		}

		let someFieldHasSentence = false;
		// The API names fields in its own words. Each sentence goes under the box it is about.
		for (const [field, message] of Object.entries(state.fieldErrors ?? {})) {
			// setError needs a field this form really has, so a name the form does not know is skipped.
			if (isJoinField(field)) {
				setError(field, { type: "server", message });
				someFieldHasSentence = true;
			}
		}

		// "root.server" is an error that belongs to no box. It carries the one sentence for the whole form.
		// When some box has its own sentence, this line only points the reader down to them.
		setError("root.server", {
			message: someFieldHasSentence
				? "Some details need changing. What to change is written under each box."
				: state.formError,
		});
	}, [state, setError]);

	// handleSubmit runs the Zod check first, so only valid values reach the callback.
	// startTransition lets React track the action as a transition. That is what keeps `isPending` right,
	// and React asks for it when an action is called outside a form's own `action`.
	return (
		<form
			onSubmit={handleSubmit((values) =>
				startTransition(() => submitJoin(values)),
			)}
			method="post"
			noValidate
			className="flex flex-col gap-5"
		>
			{/* register hands the box to React Hook Form, which reads the typed value when the form is submitted. */}
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
				{isPending ? "Joining" : "Join the library"}
			</button>
		</form>
	);
}
