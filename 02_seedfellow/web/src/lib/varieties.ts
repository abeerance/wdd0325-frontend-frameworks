import "server-only";
import { VARIETIES } from "@/data/varieties";
import type { Variety } from "@/lib/types";

// The only way pages get data. `server-only` keeps these functions out of the browser bundle.
// They are async although the array is already in memory: on night 15 the body becomes a request
// to the API, and a function that already returns a Promise changes no caller.
export async function getVarieties(): Promise<Variety[]> {
  return VARIETIES;
}

// The id arrives from the address, and an address is always text, so the comparison is on text:
// "01" must not find variety 1. An unknown id returns null, and the page turns that into notFound().
export async function getVariety(id: string): Promise<Variety | null> {
  return VARIETIES.find((variety) => String(variety.id) === id) ?? null;
}
