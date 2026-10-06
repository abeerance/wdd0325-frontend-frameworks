// One variety, drawn as a card. It knows how a variety looks, nothing about where
// the list comes from or what borrowing does.
//
// `import type` brings in only the type: it is erased at build time, so no code
// from the data file ends up here.
import type { Variety } from "../data/varieties";
import { Card } from "./ui/card";
import { Text } from "./ui/text";

// The whole variety arrives as one prop rather than six loose ones, so a new field
// on Variety needs no change to this interface.
interface VarietyCardProps {
	variety: Variety;
	// A function prop. The card calls it on click and passes back its own variety,
	// so the parent knows which card was pressed.
	onSelect: (variety: Variety) => void;
}

export function VarietyCard({ variety, onSelect }: VarietyCardProps) {
	return (
		<Card as="article">
			<Text variant="title">{variety.name}</Text>
			<Text variant="muted">{variety.species}</Text>
			<Text className="mt-2">{variety.story}</Text>
			<Text className="mt-2">{variety.sowing}</Text>
			{/* Retired or not: one line or the other, so a ternary. */}
			{variety.retired ? (
				<Text className="mt-2 font-medium text-sm text-amber-700">
					Retired from the library
				</Text>
			) : (
				<Text className="mt-2 font-medium text-sm">
					{variety.packets} packets on the shelf
				</Text>
			)}
			{/* Only something to show, nothing in the else case, so &&. Safe here
			    because the left side is a boolean; a number on the left would print 0. */}
			{!variety.retired && (
				<button
					// Without type="button" a button inside a form submits it.
					type="button"
					// An arrow, not onClick={onSelect}: onClick would hand onSelect the
					// click event, and onSelect wants the variety.
					onClick={() => {
						onSelect(variety);
					}}
					className="mt-3 rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white"
				>
					Borrow a packet
				</button>
			)}
		</Card>
	);
}
