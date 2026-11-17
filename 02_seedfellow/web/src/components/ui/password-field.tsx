// src/components/password-field.tsx
"use client";

import { Field } from "@base-ui/react/field";
import { Switch } from "@base-ui/react/switch";
import { useId, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils/cn";

const FOCUS_RING_CLASSES =
  "focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";
const FIELD_LABEL_CLASSES =
  "font-medium text-bark text-xs uppercase tracking-wider";
const TEXT_BOX_CLASSES = cn(
  "min-h-11 rounded-2xl border border-stone bg-card px-3 text-ink data-invalid:border-clay",
  FOCUS_RING_CLASSES,
);

interface PasswordFieldProps {
  // 'new-password' when joining: a password manager offers to make one up, and the box
  // is asked for twice. 'current-password' when signing in: it fills in the saved one.
  autoComplete: "new-password" | "current-password";
  // What `register('password')` returned.
  password: UseFormRegisterReturn;
  passwordError?: string;
  // Only when joining: the second box, `register('password_confirmation')`.
  confirmation?: UseFormRegisterReturn;
  confirmationError?: string;
}

// A form's password, with one switch under it that shows what was typed. The switch
// changes the boxes' `type` and nothing else: the `name`, the `autoComplete` and the value
// stay, so the form still holds the password and a password manager still knows the box.
// Shown as text, a box must not be spell-checked, capitalised or corrected, or the browser
// would send the password to a spelling service or change it. Whether it is shown lives in
// state and nowhere else, so every page load starts hidden.
export function PasswordField({
  autoComplete,
  password,
  passwordError,
  confirmation,
  confirmationError,
}: PasswordFieldProps) {
  const [isShown, setIsShown] = useState(false);
  // A unique id, so the label below can point at the switch with htmlFor.
  const switchId = useId();
  // Both boxes share one `type`, so one switch shows or hides both.
  const type = isShown ? "text" : "password";
  const isJoining = confirmation !== undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-5">
        <Field.Root
          invalid={passwordError !== undefined}
          className="flex flex-col gap-1.5"
        >
          <Field.Label className={FIELD_LABEL_CLASSES}>Password</Field.Label>
          {/* register gave this box a name, change handlers and a ref. The form reads the typed password from the box, so there is no value state here. */}
          <Field.Control
            type={type}
            autoComplete={autoComplete}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            {...password}
            className={TEXT_BOX_CLASSES}
          />
          {/* Only the joining form states the rule up front. */}
          {isJoining ? (
            <Field.Description className="text-bark text-xs">
              At least 12 characters.
            </Field.Description>
          ) : null}
          <Field.Error
            match={passwordError !== undefined}
            className="text-clay text-xs"
          >
            {passwordError}
          </Field.Error>
        </Field.Root>

        {confirmation === undefined ? null : (
          <Field.Root
            invalid={confirmationError !== undefined}
            className="flex flex-col gap-1.5"
          >
            <Field.Label className={FIELD_LABEL_CLASSES}>
              Repeat password
            </Field.Label>
            <Field.Control
              type={type}
              autoComplete="new-password"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              {...confirmation}
              className={TEXT_BOX_CLASSES}
            />
            <Field.Error
              match={confirmationError !== undefined}
              className="text-clay text-xs"
            >
              {confirmationError}
            </Field.Error>
          </Field.Root>
        )}
      </div>

      <div className="flex items-center">
        {/* A Base UI Switch is a button. type="button" stops it from submitting the form when it is clicked. */}
        <Switch.Root
          id={switchId}
          nativeButton
          render={<button type="button" />}
          checked={isShown}
          onCheckedChange={setIsShown}
          className={cn(
            "h-6 w-11 shrink-0 rounded-full bg-stone p-0.5 data-checked:bg-moss motion-safe:transition-colors",
            FOCUS_RING_CLASSES,
          )}
        >
          <Switch.Thumb className="block size-5 rounded-full bg-card shadow-sm data-checked:translate-x-5 motion-safe:transition-transform" />
        </Switch.Root>
        <label
          htmlFor={switchId}
          className="flex min-h-11 flex-1 items-center pl-3 text-ink text-sm"
        >
          Show password
        </label>
      </div>
    </div>
  );
}
