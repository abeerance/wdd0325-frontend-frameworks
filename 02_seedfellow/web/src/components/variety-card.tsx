// One variety, drawn as a card. It knows how a variety looks, nothing about where
// the list comes from or what borrowing does.
//
// `import type` brings in only the type: it is erased at build time, so no code
// from the data file ends up here.
import { useState } from "react";
import type { Variety } from "../data/varieties";
import { Card } from "./ui/card";
import { Text } from "./ui/text";

// The packet line, named because you would name it out loud. It stays in this
// file and is not exported: only VarietyCard uses it.
interface PacketLineProps {
	variety: Variety;
}

function PacketLine({ variety }: PacketLineProps) {
	// An early return instead of a ternary: the retired case is answered first, and
	// everything after it is the normal case. Same logic, read top to bottom.
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

// The whole variety arrives as one prop rather than six loose ones, so a new field
// on Variety needs no change to this interface.
interface VarietyCardProps {
	variety: Variety;
	// A function prop. The card calls it on click and passes back its own variety,
	// so the parent knows which card was pressed.
	onSelect: (variety: Variety) => void;
}

export function VarietyCard({ variety, onSelect }: VarietyCardProps) {
	// Each card has its own isOpen: opening one card does not open the others.
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Card as="article">
			<Text variant="title">{variety.name}</Text>
			<Text variant="muted">{variety.species}</Text>
			{/* The story and the sowing months only while the card is open. <> is a
			    fragment: it groups two elements without adding one to the page. */}
			{isOpen && (
				<>
					<Text className="mt-2">{variety.story}</Text>
					<Text className="mt-2">{variety.sowing}</Text>
				</>
			)}
			<PacketLine variety={variety} />
			<div className="mt-3 flex gap-2">
				<button
					type="button"
					// Tells a screen reader whether the content this button controls is
					// showing, which sighted readers see for themselves.
					aria-expanded={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-sm"
				>
					{isOpen ? "Less" : "Read more"}
				</button>
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
						className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white"
					>
						Borrow a packet
					</button>
				)}
			</div>
		</Card>
	);
}
