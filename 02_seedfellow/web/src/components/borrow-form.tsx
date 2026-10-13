// The borrow form for one variety: how many packets, then submit. It knows the
// limits of one variety, nothing about what borrowing does; the parent decides that.
import { Field } from "@base-ui/react/field";
import type { SubmitEvent } from "react";
import type { Variety } from "../data/varieties";

interface BorrowFormProps {
	variety: Variety;
	// Same shape as the card's prop: the form passes it straight through, so the
	// card does not need a handler of its own.
	onBorrow: (variety: Variety, packets: number) => void;
}

export function BorrowForm({ variety, onBorrow }: BorrowFormProps) {
	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		// A form's default is to reload the page with the values in the URL. We
		// handle the borrow here instead.
		event.preventDefault();

		// The input is uncontrolled: no useState, the browser holds the value. We read
		// it once, on submit, by its name. FormData gives back a string, so Number().
		const packets = Number(new FormData(event.currentTarget).get("packets"));
		onBorrow(variety, packets);
	}

	return (
		<form onSubmit={handleSubmit} className="mt-3 flex max-w-xs flex-col gap-3">
			{/* Field.Root wires label, input, description and error together (ids,
			    aria attributes) so we do not have to. onBlur: check when the reader
			    leaves the input, not on every keystroke. */}
			<Field.Root validationMode="onBlur" className="flex flex-col gap-1">
				<Field.Label className="font-medium text-slate-500 text-sm">
					Packets
				</Field.Label>
				{/* required, min and max are plain HTML rules: the browser refuses a
				    submit outside them, and Field reads the same rules to show the
				    error. max comes from the data, so it is never more than the shelf
				    holds. data-invalid is set by Field when a rule fails. */}
				<Field.Control
					name="packets"
					type="number"
					required
					min={1}
					max={variety.packets}
					defaultValue={1}
					className="h-9 rounded-lg border border-slate-300 px-2 text-sm data-invalid:border-red-500"
				/>
				<Field.Description className="text-slate-500 text-xs">
					One to {variety.packets}.
				</Field.Description>
				{/* Only rendered while the input is invalid. */}
				<Field.Error className="text-red-600 text-xs" />
			</Field.Root>
			{/* type="submit": pressing it, or Enter in the input, fires onSubmit. */}
			<button
				type="submit"
				className="self-start rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-sm text-white"
			>
				Borrow
			</button>
		</form>
	);
}
