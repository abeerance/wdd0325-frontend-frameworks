import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/cn";

// There is no field to fill, so no form library: a form whose action is the Server Action.
export function SignOutButton() {
	return (
		<form action={signOut}>
			<button
				type="submit"
				className={cn(
					"min-h-11 rounded-full border border-stone px-4 font-medium text-ink text-sm transition-colors hover:bg-dew",
					"focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2",
				)}
			>
				Sign out
			</button>
		</form>
	);
}
