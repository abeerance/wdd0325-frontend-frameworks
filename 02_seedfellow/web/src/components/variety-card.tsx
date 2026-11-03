import Link from "next/link";
import { BorrowDialog } from "@/components/borrow-dialog";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { Variety } from "@/data/varieties";
import { PacketLine } from "./packet-line";

interface VarietyCardProps {
  variety: Variety;
}

// No "use client" any more: the card has no state or handlers, so it renders on
// the server and ships as HTML. BorrowDialog is the one interactive island inside.
export function VarietyCard({ variety }: VarietyCardProps) {
  return (
    <Card as="article">
      {/* The link sits inside the heading, not around the card: the heading keeps its
			    place in the page outline, and a screen reader's list of links reads
			    "Genovese", not a whole card. min-h-11 makes the name a tap target of at
			    least 44px without changing how big the text looks. */}
      <h2 className="font-medium text-lg">
        <Link
          href={`/varieties/${variety.id}`}
          className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
        >
          {variety.name}
        </Link>
      </h2>
      <Text variant="muted">{variety.species}</Text>
      {/* <details> replaces the isOpen state: the browser opens and closes it,
			    and tells screen readers whether it is expanded, with no JavaScript.
			    group-open: styles the summary label from the details' open state. */}
      <details className="group mt-3">
        <summary className="w-fit cursor-pointer list-none rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-sm focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2">
          <span className="group-open:hidden">Read more</span>
          <span className="hidden group-open:inline">Less</span>
        </summary>
        <Text className="mt-2">{variety.story}</Text>
        <Text className="mt-2">{variety.sowing}</Text>
      </details>
      <PacketLine variety={variety} />
      {!variety.retired && (
        <div className="mt-3 flex gap-2">
          {/* Only plain values cross from this server component into the
					    client dialog; see BorrowDialogProps for why. */}
          <BorrowDialog
            name={variety.name}
            packetsAvailable={variety.packets}
          />
        </div>
      )}
    </Card>
  );
}
