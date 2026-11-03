import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PacketLine } from "@/components/packet-line";
import { Text } from "@/components/ui/text";
import { VARIETIES } from "@/data/varieties";

// The folder is called [id], so the address part arrives under the key `id`.
// It arrives as a Promise, because nobody knows the address until a request names it.
// The type is written out by hand. Both components below take the same prop, so it is
// written once.
type VarietyParams = { params: Promise<{ id: string }> };

// [id] matches every string, and Next.js cannot build a page ahead of time without
// knowing which addresses exist. We know them: they are the varieties in the data file.
// One object per address, and the key matches the folder name. The id is turned into text
// because everything in an address is text, even when it looks like a number.
export function generateStaticParams(): { id: string }[] {
  return VARIETIES.map((variety) => ({ id: String(variety.id) }));
}

// This component does not wait for anything. Reading `params` is a wait, and a page that
// waits at its top cannot show even its frame until the wait is over. So the promise is
// handed down untouched, and the part that needs the address waits inside <Suspense>
// while the fallback shows. This is the pattern the Next.js docs recommend for `params`.
// (`export const instant = false` would silence the warning instead of fixing it.)
export default function VarietyPage({ params }: VarietyParams) {
  return (
    <Suspense fallback={<Text variant="muted">Opening the variety.</Text>}>
      <VarietyDetails params={params} />
    </Suspense>
  );
}

async function VarietyDetails({ params }: VarietyParams) {
  const { id } = await params;
  // The address is text, so the comparison is text too: '01' is not variety 1.
  const variety = VARIETIES.find((candidate) => String(candidate.id) === id);

  // notFound() stops rendering and shows the nearest not-found.tsx. The page has already
  // started streaming by now, so the status stays 200, and Next.js adds a noindex tag so
  // search engines skip the address. It returns `never`, so after this `if` TypeScript
  // knows `variety` exists.
  if (!variety) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <p className="font-medium text-moss text-sm uppercase tracking-widest">
            {variety.kind}
          </p>
          <h1 className="font-semibold text-4xl text-ink sm:text-5xl">
            {variety.name}
          </h1>
          <Text variant="muted">{variety.species}</Text>
        </header>

        <Text className="max-w-prose">{variety.story}</Text>
        <Text>Sow in {variety.sowing}.</Text>
        <PacketLine variety={variety} />
      </div>
    </article>
  );
}
