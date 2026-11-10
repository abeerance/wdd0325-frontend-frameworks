import "server-only";
import type {
	Paginated,
	Variety,
	VarietyBrief,
	VarietyDetail,
} from "@/lib/types";

// The library lives in the API. Nothing outside this file knows that: every page asks
// through the functions below.
const HEADERS = { Accept: "application/json" };

// The only way pages get data. `server-only` keeps these functions out of the browser bundle.
// They are async although the array is already in memory: on night 15 the body becomes a request
// to the API, and a function that already returns a Promise changes no caller.
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
// changes whenever the photograph does, so a replacement has its own address.
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
