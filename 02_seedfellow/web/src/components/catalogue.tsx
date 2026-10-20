"use client";

import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VarietyCard } from "@/components/variety-card";
import { VarietyFilter } from "@/components/variety-filter";
import { VARIETIES } from "@/data/varieties";
import { useVarietyFilter } from "@/hooks/use-variety-filter";

export function Catalogue() {
	const {
		search,
		setSearch,
		kind,
		setKind,
		inStock,
		setInStock,
		shelf,
		clear,
	} = useVarietyFilter(VARIETIES);

	return (
		<>
			{/* Lifting state up: App owns search, kind and inStock, the filter bar only
			    shows them and reports changes. That is why both the bar and the list
			    below always agree. */}
			<VarietyFilter
				search={search}
				onSearch={setSearch}
				kind={kind}
				onKind={setKind}
				inStock={inStock}
				onInStock={setInStock}
				onClear={clear}
			/>
			{/* How many varieties the filters leave, out of the whole library. One
			    expression with no rule in it, so it stays inline. */}
			<Text variant="muted">
				{shelf.length} of {VARIETIES.length} varieties
			</Text>
			{/* Two outcomes, never both, so a ternary: an empty shelf gets a
			    sentence, a full one gets the list. */}
			{shelf.length === 0 ? (
				<Card>
					<Text>
						Nothing matches those filters. Clear them to see the whole library.
					</Text>
				</Card>
			) : (
				<ul className="flex flex-col gap-4">
					{/* .map turns each variety into an element. The key sits on the
					    outermost element of each item, the <li>, and uses the id:
					    stable across reorders, unlike the index. */}
					{shelf.map((variety) => (
						<li key={variety.id}>
							{/* The card decides when a borrow happens, App decides what a
							    borrow does. The card calls onBorrow with its variety and a
							    count, and this arrow receives them as picked and packets. */}
							<VarietyCard
								variety={variety}
								onBorrow={(picked, packets) =>
									alert(`Borrowing ${packets} of ${picked.name}`)
								}
							/>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
