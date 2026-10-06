// Night 6, block 2. The lifting-state-up exercise, as we solved it in the room.
//
// Two rows of seats, one selection. Each row used to keep its own state, so both
// rows could have a seat picked at once. The state moves up into SeatPicker, the
// closest parent both rows share, and each row only shows it and reports clicks.
import { useState } from "react";

interface SeatRowProps {
	rowLabel: string;
	seats: number;
	// 1. Add selectedSeat and onSelect props here. selectedSeat is the label of
	//    the chosen seat, or null when nothing is chosen. onSelect is a function
	//    that takes a seat label and returns nothing: write that signature out
	//    rather than typing it as Function, which describes nothing.
	selectedSeat: string | null;
	onSelect: (seat: string) => void;
}

// SeatRow owns no state any more: what is selected comes in as a prop, and a click
// goes back out through onSelect.
function SeatRow({ rowLabel, seats, selectedSeat, onSelect }: SeatRowProps) {
	return (
		<div className="flex items-center gap-3">
			<span className="w-6 text-sm font-semibold text-slate-500">
				{rowLabel}
			</span>
			<div className="flex gap-2">
				{/* Array.from({ length: seats }) makes an array with one empty slot per seat,
				    and the function turns each slot into a button. The first argument is the
				    slot itself, unused, so it is named _. */}
				{Array.from({ length: seats }, (_, index) => {
					const label = rowLabel + (index + 1);
					// 2. Highlight based on the selectedSeat prop instead. The comparison
					//    itself does not change; the value on the left now arrives as a
					//    prop rather than from useState.
					const isSelected = selectedSeat === label;

					return (
						<button
							key={label}
							type="button"
							// 2. Call onSelect(label) instead of setting local state. Keep the
							//    arrow: onClick={onSelect(label)} would run during the render.
							onClick={() => onSelect(label)}
							// One look or the other, so a ternary picks the whole class string.
							className={
								isSelected
									? "h-10 w-10 rounded-lg bg-emerald-600 text-sm font-medium text-white"
									: "h-10 w-10 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200"
							}
						>
							{index + 1}
						</button>
					);
				})}
			</div>
		</div>
	);
}

function SeatPicker() {
	// 3. Declare the shared selection here, starting as null. One state variable
	//    for both rows, at the top level of SeatPicker. TypeScript cannot work a
	//    type out from null on its own, so pass useState the same type argument
	//    the line you deleted in SeatRow was carrying.
	const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

	return (
		<div className="mx-auto flex max-w-sm flex-col gap-5 px-4 py-10">
			<h1 className="text-xl font-bold text-slate-900">Pick a seat</h1>

			{/* 4. Pass the selection and a change handler to both rows. Both rows get
            the same two props, which is the whole point: one value, two
            displays. The handler takes the label the row reports and stores it
            in the state from step 3. Leave rowLabel and seats as they are. */}
			<SeatRow
				rowLabel="A"
				seats={4}
				selectedSeat={selectedSeat}
				// The setter already has the right shape: it takes a seat label and returns
				// nothing, so it can be passed as onSelect without an arrow around it.
				onSelect={setSelectedSeat}
			/>
			<SeatRow
				rowLabel="B"
				seats={4}
				selectedSeat={selectedSeat}
				onSelect={setSelectedSeat}
			/>

			<p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
				{/* 5. Show the selected seat, or a message when nothing is selected. Two
              outcomes and one slot, so this is a ternary, and the test is
              whether the selection is still null. Replace the word none,
              keeping the Selected: label in front of it. */}
				Selected: {selectedSeat === null ? "none" : selectedSeat}
			</p>
		</div>
	);
}

export default function App() {
	return (
		<div className="min-h-screen bg-white">
			<SeatPicker />
		</div>
	);
}
