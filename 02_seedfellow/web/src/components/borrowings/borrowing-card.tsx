import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { Borrowing } from "@/lib/types";

interface BorrowingCardProps {
  borrowing: Borrowing;
  children: ReactNode;
}

// One borrowed packet: the variety it came from, linked to its page, and whatever the list
// says about it underneath.
// It takes the borrowing and the text to show under the name
// as `children`, because "still out" and "given back" say different things.
// Used only by BorrowingList.
export function BorrowingCard({ borrowing, children }: BorrowingCardProps) {
  return (
    <Card as="article" className="flex flex-col gap-1">
      <h3 className="font-semibold text-ink text-xl">
        <Link
          href={`/varieties/${borrowing.variety.id}`}
          className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
        >
          {borrowing.variety.name}
        </Link>
      </h3>
      <Text variant="muted">{borrowing.variety.species}</Text>
      {children}
    </Card>
  );
}
