import Link from "next/link";
import type { Variety } from "@/lib/types";
import { getVarieties } from "@/lib/varieties";
import { Text } from "./ui/text";

interface MoreLikeThisProps {
  variety: Variety;
}

export async function MoreLikeThis({ variety }: MoreLikeThisProps) {
  const varieties = await getVarieties();
  const others = varieties
    .filter(
      (candidate) =>
        candidate.kind === variety.kind && candidate.id !== variety.id,
    )
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .slice(0, 3);

  if (others.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5 border-line border-t pt-8">
      <h2 className="font-semibold text-2xl text-ink">More like this</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
