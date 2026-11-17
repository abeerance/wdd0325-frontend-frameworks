import { LoginForm } from "@/components/login-form";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import Link from "next/link";

export default function LoginPage() {
	return (
		<div className="mx-auto flex w-full max-w-md flex-col gap-6">
			<header className="flex flex-col gap-2">
				<p className="font-medium text-moss text-sm uppercase tracking-widest">
					Members
				</p>
				<h1 className="font-semibold text-4xl text-ink sm:text-5xl">Sign in</h1>
				<Text>
					Sign in to borrow a packet and to see the ones you have out.
				</Text>
			</header>

			<Card>
				<LoginForm />
			</Card>

			<Text className="text-bark text-sm">
				Don't have an account yet?
				<Link
					href="/join"
					className="inline-flex min-h-11 items-center rounded-sm font-medium text-moss underline underline-offset-4 hover:text-moss-deep focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
				>
					Join now
				</Link>
			</Text>
		</div>
	);
}
