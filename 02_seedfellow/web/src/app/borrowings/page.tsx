import { Suspense } from "react";
import { BorrowingList } from "@/components/borrowings/borrowing-list";
import { Text } from "@/components/ui/text";

// Not async: the heading is the same for everybody and is built ahead of time. Only the
// list waits for the request, because only the list reads who is asking.
export default function BorrowingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="font-medium text-moss text-sm uppercase tracking-widest">
          Your library card
        </p>
        <h1 className="font-semibold text-4xl text-ink sm:text-5xl">
          My packets
        </h1>
      </header>

      {/* Suspense shows the fallback text while BorrowingList loads, so the heading appears at once. */}
      <Suspense fallback={<Text variant="muted">Opening your packets.</Text>}>
        <BorrowingList />
      </Suspense>
    </div>
  );
}
