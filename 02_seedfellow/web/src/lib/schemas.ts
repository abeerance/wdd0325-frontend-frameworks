// src/lib/schemas.ts
// src/lib/schemas.ts
import { z } from "zod";

// What joining needs. The limits are the API's own, so a form this schema passes is a form
// the API will not refuse for its shape. The API still decides: an address that is taken is
// something only it knows.
// The join form checks it in the browser. joinLibrary checks it again on the server.
export const joinSchema = z
	.object({
		// trim cuts spaces from both ends before the length check, so a name of only spaces counts as empty.
		name: z
			.string()
			.trim()
			.min(1, "Write your name.")
			.max(255, "Keep it to 255 characters."),
		// z.email checks only the shape. Whether the address is taken is for the API to say.
		email: z
			.email("Write an email address, like name@example.org.")
			.max(255, "Keep it to 255 characters."),
		password: z.string().min(12, "At least 12 characters."),
		password_confirmation: z.string(),
	})
	// refine compares two fields, which one field's own rule cannot do.
	// `path` puts the error under the repeat box.
	.refine(
		(joinValues) => joinValues.password === joinValues.password_confirmation,
		{
			path: ["password_confirmation"],
			message: "The two passwords differ.",
		},
	);

// What signing in needs. The API checks the pair, so the form only asks that both are there.
// The login form checks it in the browser. signIn checks it again on the server.
export const loginSchema = z.object({
	email: z.email("Write an email address, like name@example.org."),
	password: z.string().min(1, "Write your password."),
});

// Types come from the schemas, so the form's values and the rules cannot drift apart.
export type JoinValues = z.infer<typeof joinSchema>;
export type LoginValues = z.infer<typeof loginSchema>;

// Whether a field name the API sent back is one of the join form's own. Only the schema's
// own keys count: `'constructor' in shape` is true of every object.
// Object.hasOwn asks about the schema's own keys only. `name is keyof JoinValues` tells TypeScript
// that after a true answer `name` is a real field, which is what setError needs.
export function isJoinField(name: string): name is keyof JoinValues {
	return Object.hasOwn(joinSchema.shape, name);
}
