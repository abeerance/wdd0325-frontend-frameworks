import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Variety } from "@/lib/types";
import { getVarieties } from "@/lib/varieties";

const LINK =
  "flex min-h-11 flex-col gap-1 rounded-2xl border border-line bg-card px-5 py-4 transition-colors hover:border-moss hover:bg-dew focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2";

interface VarietyNavProps {
  variety: Variety;
}

export async function VarietyNav({ variety }: VarietyNavProps) {
  const varieties = await getVarieties();
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
