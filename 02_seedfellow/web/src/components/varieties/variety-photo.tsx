// src/components/variety-photo.tsx
import Image from "next/image";
import { varietyPhotoUrl } from "@/lib/api/varieties";
import type { Variety } from "@/lib/types";

interface VarietyPhotoProps {
  variety: Variety;
  /** How wide the slot is at each screen width, as the page lays it out. */
  sizes: string;
  /** The photograph is the largest thing on the page, so the browser fetches it from the head. */
  preload?: boolean;
}

// The picture slot with the variety's photograph in it. The slot is 4:3 before the photo
// arrives, and the photo is cropped to fill it, so nothing on the page moves when it loads.
// The optimizer fetches the photograph from the API and sends the browser only the width
// the slot needs. A variety without a photo keeps the same reserved slot.
export function VarietyPhoto({
  variety,
  sizes,
  preload = false,
}: VarietyPhotoProps) {
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
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-dew">
      <Image
        src={src}
        alt={variety.name}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    </div>
  );
}
