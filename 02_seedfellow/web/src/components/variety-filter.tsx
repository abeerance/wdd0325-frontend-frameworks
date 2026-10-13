import { Switch } from "@base-ui/react/switch";
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
			<div className="flex h-9 items-center">
				<Switch.Root
					id="stock"
					nativeButton
					checked={inStock}
					onCheckedChange={onInStock}
					render={
						<button
							type="button"
							className="h-6 w-11 bg-slate-500 shrink-0 rounded-full p-0.5  data-checked:bg-slate-900 motion-safe:transition-colors"
						/>
					}
				>
					<Switch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-sm data-checked:translate-x-5 motion-safe:transition-transform" />
				</Switch.Root>
				<label
					htmlFor="stock"
					className="flex h-9 flex-1 items-center pl-3 text-sm"
				>
					On the shelf
				</label>
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
