import { Field } from "@base-ui/react";
import type { SubmitEvent } from "react";
import type { Variety } from "../data/varieties";

interface BorrowFormProps {
	variety: Variety;
	onBorrow: (variety: Variety, packets: number) => void;
}

export function BorrowForm({ variety, onBorrow }: BorrowFormProps) {
	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const packets = Number(new FormData(event.currentTarget).get("packets"));
		onBorrow(variety, packets);
	}

	return (
		<form onSubmit={handleSubmit} className="mt-3 flex max-w-xs flex-col gap-3">
			<Field.Root validationMode="onBlur" className="flex flex-col gap-1">
				<Field.Label className="font-medium text-slate-500 text-sm">
					Packets
				</Field.Label>
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
				<Field.Error className="text-red-600 text-xs">
					You need to select at least 1 packet
				</Field.Error>
			</Field.Root>
			<button
				type="submit"
				className="self-start rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-sm text-white"
			>
				Borrow
			</button>
		</form>
	);
}
