// Who the page is for, in the header. It reads the request's cookies, so it only ever

import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { currentMember } from "@/lib/api/member";

// renders inside a Suspense boundary, and the rest of the header is built ahead of time.
// The header calls this. A visitor sees a link to sign in; a member sees their name and a sign out button.
export async function MemberStatus() {
  // Asks the API who the cookie's token belongs to. `null` means nobody is signed in.
  const member = await currentMember();

  // Nobody signed in: offer the way in.
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

  // A member: show the name and the sign out button. The email is never shown, because only id and name are kept.
  return (
    <div className="flex items-center gap-3">
      <p className="text-bark text-sm">
        Signed in as <span className="font-medium text-ink">{member.name}</span>
      </p>
      <SignOutButton />
    </div>
  );
}
