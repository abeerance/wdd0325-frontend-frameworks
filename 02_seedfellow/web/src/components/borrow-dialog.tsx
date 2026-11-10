// src/components/borrow-dialog.tsx
"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import type { SubmitEvent } from "react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { VarietyBrief } from "@/lib/types";

interface BorrowDialogProps {
  variety: VarietyBrief;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

export function BorrowDialog({ variety }: BorrowDialogProps) {
  // Base UI owns whether the dialog is open. This is ours: the form has to close it after
  // a successful submit, so we need to be able to say so.
  const [isOpen, setIsOpen] = useState(false);

  // The browser refuses to submit a form whose controls are invalid, so this only runs on
  // a value that already passed `required`, `min` and `max`.
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // What borrowing does lives here, beside the form that asks for it, so every page that
    // shows the dialog passes it data and nothing else. It records nothing yet: it only
    // reports what was asked for.
    const packets = Number(new FormData(event.currentTarget).get("packets"));
    console.log("borrow", packets, variety.name);
    setIsOpen(false);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* Disabled instead of hidden when there is nothing to borrow, so the page layout
			    stays the same and the button still shows that borrowing exists. */}
      <Dialog.Trigger
        disabled={variety.retired || variety.packets_available === 0}
        className={cn(
          "min-h-11 rounded-full bg-moss px-5 font-medium text-card text-sm motion-safe:transition-colors hover:bg-moss-deep disabled:cursor-not-allowed disabled:bg-stone",
          FOCUS,
        )}
      >
        Borrow a packet
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-ink/40 backdrop-blur-[2px] motion-safe:transition-opacity data-closed:opacity-0 data-starting-style:opacity-0" />

        <Dialog.Popup className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 w-[min(26rem,calc(100vw-2rem))] rounded-3xl border border-line bg-card p-6 shadow-xl shadow-ink/10">
          <Dialog.Title className="font-semibold text-ink text-xl">
            Borrow {variety.name}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-bark text-sm leading-relaxed">
            {variety.packets_available}{" "}
            {variety.packets_available === 1 ? "packet" : "packets"} on the
            shelf. Bring seed back at the end of the season.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <Field.Root
              validationMode="onBlur"
              className="flex flex-col gap-1.5"
            >
              <Field.Label className="font-medium text-bark text-xs uppercase tracking-wider">
                Packets
              </Field.Label>
              <Field.Control
                name="packets"
                type="number"
                inputMode="numeric"
                required
                min={1}
                max={variety.packets_available}
                defaultValue={1}
                className={cn(
                  "min-h-11 rounded-2xl border border-stone bg-card px-3 text-ink data-invalid:border-clay",
                  FOCUS,
                )}
              />
              <Field.Description className="text-bark text-xs">
                One to {variety.packets_available}.
              </Field.Description>
              <Field.Error className="text-clay text-xs" />
            </Field.Root>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Dialog.Close
                className={cn(
                  "min-h-11 rounded-full border border-stone px-5 font-medium text-ink text-sm hover:bg-dew",
                  FOCUS,
                )}
              >
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                className={cn(
                  "min-h-11 rounded-full bg-moss px-5 font-medium text-card text-sm hover:bg-moss-deep",
                  FOCUS,
                )}
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
