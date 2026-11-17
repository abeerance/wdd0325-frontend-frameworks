import "server-only";
import type { Borrowing, Member } from "./types";
import { apiAsMember } from "./session";

// The member this request belongs to, or null when nobody is signed in. A 401 is an
// answer, not a failure: the token has expired or been deleted, or it was never real.
export async function currentMember(): Promise<Member | null> {
	const response = await apiAsMember("/api/user");

	if (response === null || response.status === 401) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`The API answered ${response.status} for the member`);
	}

	// The API sends more than this, the email address among it. Only what a page shows is kept.
	const { id, name }: Member = await response.json();

	return { id, name };
}

// Everything the signed-in member has borrowed: what is still out first, by due date, then
// what came back. Null when nobody is signed in.
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
