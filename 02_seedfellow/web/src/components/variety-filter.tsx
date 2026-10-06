import type { Kind } from "../data/varieties";
import { Card } from "./ui/card";

// The kinds the select offers, in the order they appear. A constant outside the
// component, because it never changes and does not need to be rebuilt every render.
const KINDS: Kind[] = ["vegetable", "herb", "flower", "grain"];

// The filter bar owns nothing. App holds the three values (lifting state up) and
// passes each one down with a function to change it: value in, change out.
interface VarietyFilterProps {
	search: string;
	onSearch: (search: string) => void;
	kind: Kind | "all";
	onKind: (kind: Kind | "all") => void;
	inStock: boolean;
	onInStock: (inStock: boolean) => void;
	onClear: () => void;
}

export function VarietyFilter({
	search,
	onSearch,
	kind,
	onKind,
	inStock,
	onInStock,
	onClear,
}: VarietyFilterProps) {
	return (
		<Card className="flex flex-wrap items-end gap-3">
			{/* This is the search bar from the previous night 6 */}
			<div className="flex flex-col gap-1">
				<label htmlFor="search" className="font-medium text-slate-500 text-xs">
					Search
				</label>
				<input
					id="search"
					type="text"
					// Controlled input: the field always shows what search holds.
					value={search}
					// Each keystroke goes up to App -> re-render -> shelf refilters.
					onChange={(event) => {
						onSearch(event.target.value);
					}}
					placeholder="z.B. Berner Rose"
					className="h-9 rounded-lg border border-slate-300 px-2 text-sm"
				/>
			</div>
			{/* Tag filter bar, to filter it accordingly */}
			<div className="flex flex-col gap-1">
				<label htmlFor="kind" className="font-medium text-slate-500 text-xs">
					Kind
				</label>
				<select
					id="kind"
					value={kind}
					onChange={(event) => {
						// A select always hands back a string. `as` tells TypeScript it is
						// one of the options above, which is true because we wrote them.
						onKind(event.target.value as Kind | "all");
					}}
					className="h-9 rounded-lg border border-slate-300 px-2 text-sm"
				>
					<option value="all">Everything</option>
					{KINDS.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			</div>
			{/* inStock boolean filter */}
			<div className="flex flex-col gap-1">
				<label htmlFor="stock" className="font-medium text-slate-500 text-xs">
					On the shelf
				</label>
				<input
					id="stock"
					type="checkbox"
					// A checkbox is a yes or no, so it reads `checked`, not `value`.
					checked={inStock}
					onChange={(event) => {
						onInStock(event.target.checked);
					}}
					className="h-9 w-5"
				/>
			</div>
			{/* No arrow needed here: onClear takes nothing, so the click event it
			    receives is simply ignored. */}
			<button
				type="button"
				onClick={onClear}
				className="h-9 rounded-lg border border-slate-300 px-3 font-medium text-sm"
			>
				Clear
			</button>
		</Card>
	);
}
