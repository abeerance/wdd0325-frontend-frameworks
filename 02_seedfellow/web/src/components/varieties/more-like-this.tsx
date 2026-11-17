import Link from "next/link";
import { Text } from "@/components/ui/text";
import { getVarieties } from "@/lib/api/varieties";
import type { Variety } from "@/lib/types";

interface MoreLikeThisProps {
  variety: Variety;
}

// Up to three other varieties of the same kind (for example other tomatoes), as links. It
// takes the variety being viewed and is used at the bottom of its page. A Server Component,
// so it can `await` the API directly with no effect or loading state of its own.
export async function MoreLikeThis({ variety }: MoreLikeThisProps) {
  const varieties = await getVarieties();
  // Same kind, not the page's own variety, sorted by name so the choice is the same on
  // every visit, then the first three.
  const others = varieties
    .filter(
      (candidate) =>
        candidate.kind === variety.kind && candidate.id !== variety.id,
    )
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .slice(0, 3);

  // Returning null draws nothing, so the page shows no empty "More like this" heading.
  if (others.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5 border-line border-t pt-8">
      <h2 className="font-semibold text-2xl text-ink">More like this</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* The key is the variety id: stable and unique, so React can tell items apart. */}
        {others.map((other) => (
          <li key={other.id} className="flex">
            <Link
              href={`/varieties/${other.id}`}
              className="flex min-h-11 w-full items-center gap-4 rounded-2xl border border-line bg-card p-3 transition-colors hover:border-moss hover:bg-dew focus-visible:outline-2 focus-visible:outline-moss focus-visible:outline-offset-2"
            >
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold text-ink text-lg">
                  {other.name}
                </span>
                <Text as="span" variant="muted">
                  {other.species}
                </Text>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
