import Link from "next/link";
import { BorrowingCard } from "@/components/borrowings/borrowing-card";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { myBorrowings } from "@/lib/api/member";
import type { Borrowing } from "@/lib/types";

// The API sends dates as plain text like "2026-05-01". Formatting in UTC keeps the day
// the same for every reader, whatever the server's time zone is.
const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
	dateStyle: "long",
	timeZone: "UTC",
});

// The signed-in member's own packets: the ones still out, then the ones given back. It reads
// the request's cookies, so it renders inside a Suspense boundary.
// Suspense shows a fallback
// while a part of the page waits for its data. This is a Server Component: it runs on the
// server, so it can wait for data directly with `await`. Used on the borrowings page.
export async function BorrowingList() {
	const borrowings = await myBorrowings();

	// null means the API said nobody is signed in. That is not an error and not an empty
	// list, so we explain it and link to the sign-in page instead of showing nothing.

	if (borrowings === null) {
		return (
			<Card className="flex flex-col items-start gap-4">
				<Text>
					You are not signed in. Sign in to see the packets you have out.
				</Text>
				<Link
					href="/login"
					className="inline-flex min-h-11 items-center rounded-full bg-moss px-5 font-medium text-card text-sm transition-colors hover:bg-moss-deep focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
				>
					Sign in
				</Link>
			</Card>
		);
	}

	// A packet is still out until it has a return date. `returned_on === null` means the
	// member has not given it back yet, so one list is split into two groups here.
	const packetsStillOut = borrowings.filter(
		(borrowing) => borrowing.returned_on === null,
	);
	// A type predicate, so TypeScript knows every borrowing in `packetsGivenBack` has a return date.
	const packetsGivenBack = borrowings.filter(
		(borrowing): borrowing is Borrowing & { returned_on: string } =>
			borrowing.returned_on !== null,
	);

	return (
		<div className="grid gap-10 lg:grid-cols-2">
			<section className="flex flex-col gap-3">
				<h2 className="font-semibold text-2xl text-ink">Out with you</h2>
				{packetsStillOut.length === 0 ? (
					<Text variant="muted">Nothing out right now.</Text>
				) : (
					<ul className="flex flex-col gap-4">
						{/* A key tells React which item is which when the list changes. The id is stable;
						    an index would shift when items move. */}
						{packetsStillOut.map((borrowing) => (
							<li key={borrowing.id}>
								<BorrowingCard borrowing={borrowing}>
									<Text className="font-medium">
										Bring seed back by{" "}
										{LONG_DATE_FORMATTER.format(new Date(borrowing.due_on))}.
									</Text>
								</BorrowingCard>
							</li>
						))}
					</ul>
				)}
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="font-semibold text-2xl text-ink">Given back</h2>
				{packetsGivenBack.length === 0 ? (
					<Text variant="muted">Nothing given back yet.</Text>
				) : (
					<ul className="flex flex-col gap-4">
						{packetsGivenBack.map((borrowing) => (
							<li key={borrowing.id}>
								<BorrowingCard borrowing={borrowing}>
									<Text className="font-medium">
										Given back on{" "}
										{LONG_DATE_FORMATTER.format(
											new Date(borrowing.returned_on),
										)}
										.
									</Text>
									<Text>
										{borrowing.harvest_note === null
											? "No harvest note yet."
											: "Harvest note written."}
									</Text>
								</BorrowingCard>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
