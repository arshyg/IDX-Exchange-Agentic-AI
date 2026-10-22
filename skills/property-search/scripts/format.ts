//formatting cards

import type { ListingRow } from "./types.ts";

export function formatListingCard(l: ListingRow): string {
  return `*${l.L_Address}, ${l.L_City}*\n` +
    `$${l.price.toLocaleString()} | ${l.beds}bd/${l.baths}ba | ${l.sqft} sqft\n` +
    `${l.DaysOnMarket} days on market`;
}