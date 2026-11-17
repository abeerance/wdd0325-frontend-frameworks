// Makes the build fail if a client component imports this file, so the token stays on the server.
import "server-only";
import { apiAsMember } from "@/lib/api/session";
import type { Borrowing, Member } from "@/lib/types";

// The member this request belongs to, or null when nobody is signed in. A 401 is an
// answer, not a failure: the token has expired or been deleted, or it was never real.
// The header's MemberStatus calls this on every request.
export async function currentMember(): Promise<Member | null> {
  // apiAsMember sends the token from the cookie. A `null` result means there was no token to send.
  const response = await apiAsMember("/api/user");

  if (response === null || response.status === 401) {
    return null;
  }

  // Anything other than success or 401 is a real fault. Throwing keeps it loud instead of hiding it.
  if (!response.ok) {
    throw new Error(`The API answered ${response.status} for the member`);
  }

  // The API sends more than this, the email address among it. Only what a page shows is kept.
  // A page cannot show or pass on what it never received.
  const { id, name }: Member = await response.json();

  return { id, name };
}

// Everything the signed-in member has borrowed: what is still out first, by due date, then
// what came back. Null when nobody is signed in.
// The borrowings page calls this.
export async function myBorrowings(): Promise<Borrowing[] | null> {
  const response = await apiAsMember("/api/borrowings");

  if (response === null || response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`The API answered ${response.status} for the member`);
  }

  // The API sends more than this, the email address among it. Only what a page shows is kept.
  const { data }: { data: Borrowing[] } = await response.json();

  return data;
}
