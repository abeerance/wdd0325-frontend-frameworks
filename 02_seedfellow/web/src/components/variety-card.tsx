import { BorrowDialog } from "@/components/borrow-dialog";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { Variety } from "@/data/varieties";

interface VarietyCardProps {
	variety: Variety;
}

// Shares VarietyCardProps: both take one variety and nothing else.
function PacketLine({ variety }: VarietyCardProps) {
	// Early return: the retired case is answered first, the rest is the normal case.
	if (variety.retired) {
		return (
			<Text className="mt-2 font-medium text-sm text-amber-700">
				Retired from the library
			</Text>
		);
	}

	return (
		<Text className="mt-2 font-medium text-sm">
			{variety.packets} packets on the shelf
		</Text>
	);
}

// No "use client" any more: the card has no state or handlers, so it renders on
// the server and ships as HTML. BorrowDialog is the one interactive island inside.
export function VarietyCard({ variety }: VarietyCardProps) {
	return (
		<Card as="article">
			<Text variant="title">{variety.name}</Text>
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
