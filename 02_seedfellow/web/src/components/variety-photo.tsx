// src/components/variety-photo.tsx
import type { Variety } from "@/lib/types";
import { varietyPhotoUrl } from "@/lib/varieties";

interface VarietyPhotoProps {
  variety: Variety;
  /** The photograph is what the page is about, so it loads first instead of when scrolled to. */
  isMain?: boolean;
}

// The picture slot with the variety's photograph in it. The slot is 4:3 before the photo
// arrives, and the photo is cropped to fill it, so nothing on the page moves when it loads.
// A variety without a photo keeps the same reserved picture slot.
export function VarietyPhoto({ variety, isMain = false }: VarietyPhotoProps) {
  const src = varietyPhotoUrl(variety);

  if (src === null) {
    return (
      <div
        aria-hidden="true"
        className="aspect-4/3 w-full rounded-2xl bg-dew"
      />
    );
  }

  return (
    <div className="aspect-4/3 w-full overflow-hidden rounded-2xl bg-dew">
      {/* biome-ignore lint/performance/noImgElement: sent as the API stores it, on purpose */}
      <img
        src={src}
        alt={variety.name}
        loading={isMain ? "eager" : "lazy"}
        fetchPriority={isMain ? "high" : undefined}
        className="size-full object-cover"
      />
    </div>
  );
}
