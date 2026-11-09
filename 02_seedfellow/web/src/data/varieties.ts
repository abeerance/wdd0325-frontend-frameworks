import "server-only";
import type { Variety } from "@/lib/types";

export const VARIETIES: Variety[] = [
  {
    id: 1,
    name: "Berner Rose",
    species: "Solanum lycopersicum",
    kind: "vegetable",
    story:
      "A pink beefsteak tomato kept around Bern since the 1950s. Thin skin, so it travels badly and tastes like nothing you can buy.",
    sowing: "March and April",
    packets: 4,
  },
  {
    id: 4,
    name: "Küttiger Rüebli",
    species: "Daucus carota",
    kind: "vegetable",
    story:
      "A white carrot from Küttigen in the Aargau, short and blunt and a little peppery. It nearly disappeared when orange carrots took the market.",
    sowing: "April, May and June",
    packets: 2,
  },
  {
    id: 17,
    name: "Genovese",
    species: "Ocimum basilicum",
    kind: "herb",
    story:
      "Large soft leaves, the basil grown for pesto. It hates cold feet, so keep the pot off a stone floor until June.",
    sowing: "April, May and June",
    packets: 5,
  },
  {
    id: 28,
    name: "Schwarzer Hafer",
    species: "Avena sativa",
    kind: "grain",
    story:
      "A black-husked oat, kept by the library as a green manure as much as a grain. Cut it before it seeds and it feeds the soil instead of you.",
    sowing: "March and April",
    packets: 0,
    retired: true,
  },
  {
    id: 22,
    name: "Resina",
    species: "Calendula officinalis",
    kind: "flower",
    story:
      "A single-flowered calendula grown for its resin, which is what makes the salve. Deadhead it and it flowers until the first hard frost.",
    sowing: "March to August",
    packets: 6,
  },
];
