import Link from "next/link";
import { getVarieties } from "@/lib/api/varieties";
import type { Variety } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

// Classes shared by the Previous and Next links, so the two boxes always look the same.
const LINK =
  "flex min-h-11 flex-col gap-1 rounded-2xl border border-line bg-card px-5 py-4 transition-colors hover:border-moss hover:bg-dew focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

interface VarietyNavProps {
  variety: Variety;
}

// Previous and next links that walk through the whole library in name order. It takes the
// variety being viewed and is used at the bottom of its page. A Server Component, so it
// reads the API directly with `await`.
export async function VarietyNav({ variety }: VarietyNavProps) {
  const varieties = await getVarieties();
  // Sort by name, find where this variety sits, and take its neighbours. The first variety
  // has no previous and the last has no next, so those are `undefined` and draw nothing.
  const byName = varieties.toSorted((a, b) => a.name.localeCompare(b.name));
  const index = byName.findIndex((candidate) => candidate.id === variety.id);
  const previous = index > 0 ? byName[index - 1] : undefined;
  const next = index < byName.length - 1 ? byName[index + 1] : undefined;

  return (
    <nav aria-label="Varieties by name" className="border-line border-t pt-8">
      <ul className="grid gap-3 sm:grid-cols-2">
        {previous ? (
          <li>
            <Link href={`/varieties/${previous.id}`} className={LINK}>
              <span className="flex items-center gap-1 text-bark text-sm">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="size-4 stroke-bark"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 3 5 8l5 5" />
                </svg>
                Previous
              </span>
              <span className="font-semibold text-ink text-lg">
                {previous.name}
              </span>
            </Link>
          </li>
        ) : null}
        {next ? (
          <li className="sm:col-start-2">
            <Link
              href={`/varieties/${next.id}`}
              className={cn(LINK, "sm:items-end sm:text-right")}
            >
              <span className="flex items-center gap-1 text-bark text-sm">
                Next
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="size-4 stroke-bark"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 3 5 5-5 5" />
                </svg>
              </span>
              <span className="font-semibold text-ink text-lg">
                {next.name}
              </span>
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
