import { useState } from "react";
import type { ChangeEvent } from "react";

interface Item {
	id: number;
	label: string;
	packed: boolean;
}

let nextId = 3;

function PackingList() {
	const [items, setItems] = useState<Item[]>([
		{ id: 1, label: "Passport", packed: false },
		{ id: 2, label: "Charger", packed: true },
	]);
	const [draft, setDraft] = useState("");

	function handleAdd(): void {
		// 1. Three steps, in this order.
		//    First bail out when draft.trim() is empty, so a blank item never reaches
		//    the list. Then call setItems with a NEW array: spread the current items
		//    into an array literal and put the new object after them. push adds to
		//    the array React already holds, so React sees the same array and skips
		//    the render. The new object is
		//      { id: nextId++, label: draft.trim(), packed: false }
		//    Finish by clearing the text field with the draft setter, or the word you
		//    just added stays in the box.
	}

	function handleToggle(id: number): void {
		// 2. Produce a new array where the matching item has packed flipped. map
		//    returns a new array and visits every item, so return a changed COPY for
		//    the one whose id matches and the untouched item for all the rest:
		//      items.map(item => (item.id === id ? copyOfIt : item))
		//    The copy spreads the old item and overrides the one field, so label and
		//    id survive. Assigning to item.packed edits the object the old array is
		//    still pointing at, and nothing re-renders.
	}

	function handleRemove(id: number): void {
		// 3. Produce a new array without the matching item. filter keeps every item
		//    whose test comes back true, so keep the ones whose id is NOT this id.
		//    splice edits the array in place, so it does not belong here.
	}

	function handleDraftChange(event: ChangeEvent<HTMLInputElement>): void {
		setDraft(event.target.value);
	}

	// 4. Count the items that are not packed yet. Work it out here, on every
	//    render, from items: filter the unpacked ones and read the length of what
	//    comes back. Replace the 0 on the right. Do not add a state variable for
	//    it, or the number stops agreeing with the list after the next toggle.
	const unpacked = 0;

	return (
		<div className="mx-auto max-w-sm px-4 py-10">
			<h1 className="mb-4 text-xl font-bold text-slate-900">Packing list</h1>

			<div className="mb-6 flex gap-2">
				<input
					value={draft}
					onChange={handleDraftChange}
					placeholder="Add an item"
					className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
				/>
				<button
					type="button"
					onClick={handleAdd}
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Add
				</button>
			</div>

			<ul className="space-y-2">
				{items.map((item) => (
					<li
						key={item.id}
						className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
					>
						<input
							type="checkbox"
							checked={item.packed}
							onChange={() => handleToggle(item.id)}
							className="h-4 w-4"
						/>
						<span
							className={
								item.packed
									? "flex-1 text-sm text-slate-400 line-through"
									: "flex-1 text-sm text-slate-800"
							}
						>
							{item.label}
						</span>
						<button
							type="button"
							onClick={() => handleRemove(item.id)}
							className="text-slate-400 hover:text-red-600"
						>
							Remove
						</button>
					</li>
				))}
			</ul>

			<p className="mt-4 text-center text-xs text-slate-500">
				{unpacked} item(s) still to pack
			</p>
		</div>
	);
}

export default function App() {
	return (
		<div className="min-h-screen bg-white">
			<PackingList />
		</div>
	);
}
