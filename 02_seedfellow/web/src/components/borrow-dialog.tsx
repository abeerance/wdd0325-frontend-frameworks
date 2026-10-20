"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { type FormEvent, useState } from "react";
import type { Variety } from "../data/varieties";

interface BorrowDialogProps {
	variety: Variety;
	onBorrow: (variety: Variety, packets: number) => void;
}

export function BorrowDialog({ variety, onBorrow }: BorrowDialogProps) {
	const [isOpen, setIsOpen] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const packets = Number(new FormData(event.currentTarget).get("packets"));
		onBorrow(variety, packets);
		setIsOpen(false);
	}

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Trigger className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-sm text-white focus-visible:outline-2 focus-visible:outline-slate-900 focus-visible:outline-offset-2">
				Borrow a packet
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Backdrop className="fixed inset-0 bg-slate-900/40 transition-opacity data-closed:opacity-0" />
				<Dialog.Popup className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-80 rounded-xl bg-white p-5">
					<Dialog.Title className="font-medium text-lg">
						Borrow {variety.name}
					</Dialog.Title>
					<Dialog.Description className="mt-1 text-slate-500 text-sm">
						{variety.packets} packets on the shelf. Bring seed back at the end
						of the season.
					</Dialog.Description>
					<form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
						<Field.Root validationMode="onBlur" className="flex flex-col gap-1">
							<Field.Label className="font-medium text-slate-500 text-xs">
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
							<Field.Error className="text-red-600 text-xs" />
						</Field.Root>
						<div className="flex justify-end gap-2">
							<Dialog.Close className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-sm">
								Cancel
							</Dialog.Close>
							<button
								type="submit"
								className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-sm text-white"
							>
								Borrow
							</button>
						</div>
					</form>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
