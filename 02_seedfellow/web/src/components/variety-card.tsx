// src/components/variety-card.tsx
import Link from "next/link";
import { PhotoCredit } from "@/components/photo-credit";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatMonths } from "@/lib/months";
import type { Variety } from "@/lib/types";
import { brief } from "@/lib/varieties";
import { BorrowDialog } from "./borrow-dialog";
import { PacketLine } from "./packet-line";
import { VarietyPhoto } from "./variety-photo";

interface VarietyCardProps {
	variety: Variety;
}

// A server component. It holds no state and passes no handler, so nothing in it has to
// run in the browser. The native disclosure needs no React state. Only the borrow
// dialog is a client component, given the fields its form needs.
export function VarietyCard({ variety }: VarietyCardProps) {
	return (
		<Card as="article" className="flex w-full flex-col gap-4">
			<figure className="flex flex-col gap-1.5">
				<VarietyPhoto variety={variety} />
				{variety.photo_credit ? (
					<PhotoCredit credit={variety.photo_credit} />
				) : null}
			</figure>

			<div className="flex flex-col gap-1">
				<p className="font-medium text-moss text-xs uppercase tracking-wider">
					{variety.kind}
				</p>
				<h2 className="font-semibold text-ink text-xl">
					<Link
						href={`/varieties/${variety.id}`}
						className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
					>
						{variety.name}
					</Link>
				</h2>
				<Text variant="muted">{variety.species}</Text>
			</div>

			<details className="group">
				<summary className="w-fit min-h-11 cursor-pointer rounded-sm py-2 font-medium text-moss text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2">
					<span className="group-open:hidden">Read more</span>
					<span className="hidden group-open:inline">Less</span>
				</summary>
				<Text>{variety.story}</Text>
				<Text>Sow in {formatMonths(variety.sowing_months)}.</Text>
			</details>

			<div className="mt-auto flex flex-col items-start gap-3">
				<PacketLine variety={variety} />
				<BorrowDialog variety={brief(variety)} />
			</div>
		</Card>
	);
}
