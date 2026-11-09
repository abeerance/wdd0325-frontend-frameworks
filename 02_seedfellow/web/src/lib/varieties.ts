import "server-only";
import { VARIETIES } from "@/data/varieties";
import type { Variety } from "@/lib/types";

export async function getVarieties(): Promise<Variety[]> {
  return VARIETIES;
}

export async function getVariety(id: string): Promise<Variety | null> {
  return VARIETIES.find((variety) => String(variety.id) === id) ?? null;
}
