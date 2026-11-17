// src/components/text-field.tsx
import { Field } from "@base-ui/react/field";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/cn";

const FOCUS_RING_CLASSES =
  "focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";
const FIELD_LABEL_CLASSES =
  "font-medium text-bark text-xs uppercase tracking-wider";
const TEXT_BOX_CLASSES = cn(
  "min-h-11 rounded-2xl border border-stone bg-card px-3 text-ink data-invalid:border-clay",
  FOCUS_RING_CLASSES,
);

interface TextFieldProps {
  label: string;
  type: "text" | "email";
  autoComplete: string;
  // What `register('name')` returned: the box's name, its change handlers and its ref.
  registration: UseFormRegisterReturn;
  error?: string;
}

// One labelled box of a form. Its sentence, from the schema or from the API, stands under it.
export function TextField({
  label,
  type,
  autoComplete,
  registration,
  error,
}: TextFieldProps) {
  return (
    <Field.Root invalid={error !== undefined} className="flex flex-col gap-1.5">
      <Field.Label className={FIELD_LABEL_CLASSES}>{label}</Field.Label>
      <Field.Control
        type={type}
        autoComplete={autoComplete}
        {...registration}
        className={TEXT_BOX_CLASSES}
      />
      <Field.Error match={error !== undefined} className="text-clay text-xs">
        {error}
      </Field.Error>
    </Field.Root>
  );
}
