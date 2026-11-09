import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BorrowDialog } from "@/components/borrow-dialog";
import { PacketLine } from "@/components/packet-line";
import { Text } from "@/components/ui/text";
import { getVarieties, getVariety } from "@/lib/varieties";

// One entry per variety the library holds, so each of their pages is built ahead of time.
export async function generateStaticParams(): Promise<{ id: string }[]> {
	const varieties = await getVarieties();
	return varieties.map((variety) => ({ id: String(variety.id) }));
}

type VarietyParams = { params: Promise<{ id: string }> };

// The page does not await params; the part inside <Suspense> does.
export default function VarietyPage({ params }: VarietyParams) {
	return (
		<Suspense fallback={<Text variant="muted">Opening the variety.</Text>}>
			<VarietyDetails params={params} />
		</Suspense>
	);
}

async function VarietyDetails({ params }: VarietyParams) {
	const { id } = await params;
	// The address is text, so the comparison is text too: '01' is not variety 1.
	const variety = await getVariety(id);

	// notFound() stops rendering and shows the nearest not-found.tsx. The page has already
	// started streaming by now, so the status stays 200, and Next.js adds a noindex tag so
	// search engines skip the address. It returns `never`, so after this `if` TypeScript
	// knows `variety` exists.
	if (!variety) {
		notFound();
	}

	return (
		<article className="flex flex-col gap-8">
			<div className="flex flex-col gap-4">
				<header className="flex flex-col gap-1">
					<p className="font-medium text-moss text-sm uppercase tracking-widest">
						{variety.kind}
					</p>
					<h1 className="font-semibold text-4xl text-ink sm:text-5xl">
						{variety.name}
					</h1>
					<Text variant="muted">{variety.species}</Text>
				</header>

				<Text className="max-w-prose">{variety.story}</Text>
				<Text>Sow in {variety.sowing}.</Text>
				<PacketLine variety={variety} />
				{!variety.retired && (
					<BorrowDialog
						name={variety.name}
						packetsAvailable={variety.packets}
					/>
				)}
			</div>
		</article>
	);
}
