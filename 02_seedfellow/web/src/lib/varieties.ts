import "server-only";
import type {
  Paginated,
  Variety,
  VarietyBrief,
  VarietyDetail,
} from "@/lib/types";

// The library lives in the API. Nothing outside this file knows that: every page asks
// through the functions below. API_URL is read on the server only, from `.env.local`.
// Asking for JSON makes Laravel answer errors as JSON too, not as an HTML page.
const HEADERS = { Accept: "application/json" };

// The only way pages get data. `server-only` keeps these functions out of the browser bundle.
// Every read goes to the API at request time (`no-store`): the library changes whenever a
// packet is borrowed, and caching is not part of this project yet.
// 50 is the most the API gives per page. The catalogue is one page by design, so a
// second page fails loudly below instead of silently dropping varieties.
export async function getVarieties(): Promise<Variety[]> {
  const response = await fetch(
    `${process.env.API_URL}/api/varieties?per_page=50`,
    {
      headers: HEADERS,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`The API answered ${response.status} for the catalogue`);
  }

  const page: Paginated<Variety> = await response.json();

  if (page.meta.last_page > 1) {
    throw new Error("The catalogue no longer fits on one page of 50");
  }

  return page.data;
}

// One variety by the id in its address, or null when the library has never held it.
// The address is text. Only a whole number written without a leading zero names a
// variety: 'abc', '01' and '1.5' never reach the API, and neither does a number too
// large for JavaScript to hold exactly.
export async function getVariety(id: string): Promise<VarietyDetail | null> {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return null;
  }

  const response = await fetch(`${process.env.API_URL}/api/varieties/${id}`, {
    headers: HEADERS,
    cache: "no-store",
  });

  // A variety the library never held is a normal answer, so it becomes null and the page
  // shows not-found. Any other failure is a real fault and throws.
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`The API answered ${response.status} for variety ${id}`);
  }

  const { data }: { data: VarietyDetail } = await response.json();

  return data;
}

// Where the browser loads a variety's photograph, or null when it has none. The version
// changes whenever the photograph does, so a replacement has its own address, and the
// API lets the browser keep a versioned address for a year. The browser fetches it
// straight from the API, so API_URL has to be an address the browser can reach too.
export function varietyPhotoUrl({ id, photo_version }: Variety): string | null {
  return photo_version === null
    ? null
    : `${process.env.API_URL}/api/varieties/${id}/photo?v=${photo_version}`;
}

// The brief of a variety, built field by field. A type only describes an object: handing
// over the whole variety would still publish every field of it.
export function brief({
  id,
  name,
  kind,
  packets_available,
  retired,
}: Variety): VarietyBrief {
  return { id, name, kind, packets_available, retired };
}
