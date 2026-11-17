"use client";

import { signIn } from "@/lib/actions/auth";
import { loginSchema, LoginValues } from "@/lib/schemas";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField } from "./text-field";
import { PasswordField } from "./password-field";
import { cn } from "@/lib/cn";
import { zodResolver } from "@hookform/resolvers/zod";

const FOCUS_RING_CLASSES =
	"focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

export function LoginForm() {
	const [state, signInAction, isPending] = useActionState(signIn, null);
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
			setError("root.server", { message: state.formError });
		}
	}, [state, setError]);

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
			<PasswordField
				autoComplete="current-password"
				password={register("password")}
				passwordError={errors.password?.message}
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
				{isPending ? "Signing in" : "Sign in"}
			</button>
		</form>
	);
}
