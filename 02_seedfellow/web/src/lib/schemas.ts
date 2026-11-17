// src/lib/schemas.ts
import { z } from "zod";

// What joining needs. The limits are the API's own, so a form this schema passes is a form
// the API will not refuse for its shape. The API still decides: an address that is taken is
// something only it knows.
export const joinSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, "Write your name.")
			.max(255, "Keep it to 255 characters."),
		email: z
			.email("Write an email address, like name@example.org.")
			.max(255, "Keep it to 255 characters."),
		password: z.string().min(12, "At least 12 characters."),
		password_confirmation: z.string(),
	})
	.refine(
		(joinValues) => joinValues.password === joinValues.password_confirmation,
		{
			path: ["password_confirmation"],
			message: "The two passwords differ.",
		},
	);

export const loginSchema = z.object({
	email: z.email("Write an email address, like name@example.org."),
	password: z.string().min(1, "Write your password"),
});

export type JoinValues = z.infer<typeof joinSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
