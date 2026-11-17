// src/app/join/page.tsx

import { JoinForm } from "@/components/join-form";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import Link from "next/link";

export default function JoinPage() {
	return (
		<div className="mx-auto flex w-full max-w-md flex-col gap-6">
			<header className="flex flex-col gap-2">
				<p className="font-medium text-moss text-sm uppercase tracking-widest">
					Members
				</p>
				<h1 className="font-semibold text-4xl text-ink sm:text-5xl">
					Join the library
				</h1>
				<Text>
					Borrow a packet, grow it, and bring some of its seed back at the end
					of the season.
				</Text>
			</header>

			<Card>
				<JoinForm />
			</Card>
			<Text className="text-bark text-sm">
				Already a member?{" "}
				<Link
					href="/login"
					className="inline-flex min-h-11 items-center rounded-sm font-medium text-moss underline underline-offset-4 hover:text-moss-deep focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
				>
					Sign in
				</Link>
			</Text>
		</div>
	);
}
