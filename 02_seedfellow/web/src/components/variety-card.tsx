import Link from "next/link";
import { BorrowDialog } from "@/components/borrow-dialog";
import { PacketLine } from "@/components/packet-line";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { Variety } from "@/lib/types";

interface VarietyCardProps {
  variety: Variety;
}

// No "use client" any more: the card has no state or handlers, so it renders on
// the server and ships as HTML. BorrowDialog is the one interactive island inside.
export function VarietyCard({ variety }: VarietyCardProps) {
  return (
    <Card as="article">
      <h2 className="font-medium text-lg">
        <Link
          href={`/varieties/${variety.id}`}
          className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
        >
          {variety.name}
        </Link>
      </h2>
      <Text variant="muted">{variety.species}</Text>
      <details className="group mt-3">
        <summary className="w-fit cursor-pointer list-none rounded-lg border border-stone px-3 py-1.5 font-medium text-sm focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2">
          <span className="group-open:hidden">Read more</span>
          <span className="hidden group-open:inline">Less</span>
        </summary>
        <Text className="mt-2">{variety.story}</Text>
        <Text className="mt-2">{variety.sowing}</Text>
      </details>
      <PacketLine variety={variety} />
      {!variety.retired && (
        <div className="mt-3 flex gap-2">
          <BorrowDialog
            name={variety.name}
            packetsAvailable={variety.packets}
          />
        </div>
      )}
    </Card>
  );
}
