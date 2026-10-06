import type { Kind } from "../data/varieties";

// this is the constant for the filtering group
const KINDS: Kind[] = ["vegetable", "herb", "flower", "grain"];

interface VarietyFilterProps {
	search: string;
	onSearch: (search: string) => void;
	kind: Kind | "all";
	onKind: (kind: Kind | "all") => void;
	inStock: boolean;
	onInStock: (inStock: boolean) => void;
	onClear: () => void;
}

export function VartietyFilter({
	search,
	onSearch,
	kind,
	onKind,
	inStock,
	onInStock,
	onClear,
}: VarietyFilterProps) {
	return (
		<div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 p-4 mb-4">
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
				<label htmlFor="kind" className="font-medium text-slate-500 text-xs">
					On the shelf
				</label>
				<input
					id="stock"
					type="checkbox"
					checked={inStock}
					onChange={(event) => {
						onInStock(event.target.checked);
					}}
					className="h-9 w-5"
				/>
			</div>
			<button
				type="button"
				onClick={onClear}
				className="h-9 rounded-lg border border-slate-300 px-3 font-medium text-sm"
			>
				Clear
			</button>
		</div>
	);
}
