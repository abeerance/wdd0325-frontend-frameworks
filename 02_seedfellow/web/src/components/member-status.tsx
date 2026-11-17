// Who the page is for, in the header. It reads the request's cookies, so it only ever

import { currentMember } from "@/lib/member";
import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

// renders inside a Suspense boundary, and the rest of the header is built ahead of time.
export async function MemberStatus() {
	const member = await currentMember();

	if (member === null) {
		return (
			<Link
				href={"/login"}
				className="inline-flex min-h-11 items-center rounded-full bg-moss px-5 font-medium text-card text-sm transition-colors hover:bg-moss-deep focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
			>
				Sign in
			</Link>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<p className="text-bark text-sm">
				Signed in as <span className="font-medium text-ink">{member.name}</span>
			</p>
			<SignOutButton />
		</div>
	);
}
