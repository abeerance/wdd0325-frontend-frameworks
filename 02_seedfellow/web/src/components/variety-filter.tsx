"use client";

import { Switch } from "@base-ui/react/switch";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { Kind } from "@/lib/types";

/** Every kind a variety can be, in the order the filter offers them. */
const KINDS: Kind[] = ["vegetable", "herb", "flower", "grain"];

const FIELD = "flex flex-col gap-1.5";
const LABEL = "font-medium text-bark text-xs uppercase tracking-wider";
const CONTROL =
  "min-h-11 rounded-2xl border border-stone bg-card px-3 text-ink text-sm focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

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
          value={search}
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
        onClick={onClear}
        className="min-h-11 rounded-full px-4 font-medium text-moss text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2 sm:justify-self-start"
      >
        Clear filters
      </button>
    </Card>
  );
}
