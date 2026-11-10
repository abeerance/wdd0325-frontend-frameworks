// src/app/varieties/[id]/page.tsx
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BorrowDialog } from "@/components/borrow-dialog";
import { HarvestNotes } from "@/components/harvest-notes";
import { MoreLikeThis } from "@/components/more-like-this";
import { PacketLine } from "@/components/packet-line";
import { PhotoCredit } from "@/components/photo-credit";
import { Text } from "@/components/ui/text";
import { VarietyNav } from "@/components/variety-nav";
import { VarietyPhoto } from "@/components/variety-photo";
import { formatMonths } from "@/lib/months";
import { brief, getVariety } from "@/lib/varieties";

type VarietyParams = { params: Promise<{ id: string }> };

// The page itself does not wait. Reading `params` is a wait, and the variety comes from the
// API, which is another. A page that waits at its top cannot show even its frame until
// both are over. So the promise is handed down untouched, and the part that needs the
// address waits inside <Suspense> while the fallback shows.
export default function VarietyPage({ params }: VarietyParams) {
  return (
    <Suspense fallback={<Text variant="muted">Opening the variety.</Text>}>
      <VarietyDetails params={params} />
    </Suspense>
  );
}

async function VarietyDetails({ params }: VarietyParams) {
  const { id } = await params;
  const variety = await getVariety(id);

  // notFound() stops rendering and shows the nearest not-found.tsx. The page has already
  // started streaming by now, so the status stays 200, and Next.js adds a noindex tag so
  // search engines skip the address. It returns `never`, so after this `if` TypeScript
  // knows `variety` exists.
  if (!variety) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-12">
      <article className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <figure className="flex flex-col gap-1">
          <VarietyPhoto variety={variety} isMain />
          {variety.photo_credit ? (
            <PhotoCredit credit={variety.photo_credit} />
          ) : null}
        </figure>

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
          <Text>Sow in {formatMonths(variety.sowing_months)}.</Text>
          <div className="flex flex-col items-start gap-3">
            <PacketLine variety={variety} />
            {/* brief() hands the client dialog only the fields it needs, not the whole variety. */}
            <BorrowDialog variety={brief(variety)} />
          </div>
        </div>
      </article>
      <HarvestNotes id={id} />
      <MoreLikeThis variety={variety} />
      <VarietyNav variety={variety} />
    </div>
  );
}
