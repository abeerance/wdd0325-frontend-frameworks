"use client";

import { Switch } from "@base-ui/react/switch";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { Kind } from "@/lib/types";

// The kinds the select offers, in the order they appear. A constant outside the component,
// because it never changes and does not need to be rebuilt every render.
const KINDS: Kind[] = ["vegetable", "herb", "flower", "grain"];

// Class strings that more than one control shares, written once so the controls look alike.
// min-h-11 is 44px, the smallest comfortable size to hit with a finger, and every control shows
// a focus ring so a keyboard user can see where they are.
const FIELD = "flex flex-col gap-1.5";
const LABEL = "font-medium text-bark text-xs uppercase tracking-wider";
const CONTROL =
  "min-h-11 rounded-2xl border border-stone bg-card px-3 text-ink text-sm focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

// "use client": this part runs in the browser because it handles typing and clicks. The filter bar owns
// nothing. CatalogueFilter holds the three values (lifting state up) and passes each one down with a
// function to change it: value in, change out. That is what makes these controlled inputs.
interface VarietyFilterProps {
  search: string;
  onSearch: (search: string) => void;
  kind: Kind | "all";
  onKind: (kind: Kind | "all") => void;
  inStock: boolean;
  onInStock: (inStock: boolean) => void;
  onClear: () => void;
}

export function VarietyFilter({
  search,
  onSearch,
  kind,
  onKind,
  inStock,
  onInStock,
  onClear,
}: VarietyFilterProps) {
  return (
    <Card className="grid gap-4 bg-dew sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
      <div className={cn(FIELD, "lg:min-w-64 lg:flex-1")}>
        <label htmlFor="search" className={LABEL}>
          Search
        </label>
        <input
          id="search"
          type="search"
          // Controlled input: the field always shows what search holds.
          value={search}
          // Each keystroke goes up to CatalogueFilter, which re-renders and refilters the list.
          // type="search" tells the browser and screen readers this is a search field.
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Berner Rose"
          className={CONTROL}
        />
      </div>

      <div className={FIELD}>
        <label htmlFor="kind" className={LABEL}>
          Kind
        </label>
        <select
          id="kind"
          value={kind}
          // A select always hands back a string. `as` tells TypeScript it is one of the options above, which
          // is true because we wrote them.
          onChange={(event) => onKind(event.target.value as Kind | "all")}
          className={CONTROL}
        >
          <option value="all">Everything</option>
          {KINDS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-h-11 items-center sm:self-end">
        <Switch.Root
          id="stock"
          // Base UI supplies the switch behaviour (keyboard, aria-checked, the checked state). Here it is
          // rendered as a real <button> that never submits a form; the classes below only style it.
          nativeButton
          render={<button type="button" />}
          checked={inStock}
          onCheckedChange={onInStock}
          className="h-6 w-11 shrink-0 rounded-full bg-stone p-0.5 data-checked:bg-moss focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2 motion-safe:transition-colors"
        >
          <Switch.Thumb className="block size-5 rounded-full bg-card shadow-sm data-checked:translate-x-5 motion-safe:transition-transform" />
        </Switch.Root>
        <label
          htmlFor="stock"
          className="flex min-h-11 flex-1 items-center pl-3 text-ink text-sm"
        >
          On the shelf
        </label>
      </div>

      <button
        type="button"
        // onClear takes nothing, so the click event it receives is simply ignored.
        onClick={onClear}
        className="min-h-11 rounded-full px-4 font-medium text-moss text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2 sm:justify-self-start"
      >
        Clear filters
      </button>
    </Card>
  );
}
