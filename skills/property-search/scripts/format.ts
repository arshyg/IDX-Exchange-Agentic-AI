//formatting cards

import type { ListingRow, SoldRow } from "./types.ts";

// mysql2 returns DECIMAL columns as strings, so coerce before formatting
function money(value: unknown): string {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? `$${n.toLocaleString("en-US")}` : "Price N/A";
}

function orNA(value: unknown): string {
  return value === null || value === undefined || value === "" ? "?" : String(value);
}

export function formatListingCard(l: ListingRow): string {
  return `*${l.L_Address}, ${l.L_City}*\n` +
    `${money(l.price)} | ${orNA(l.beds)}bd/${orNA(l.baths)}ba | ${orNA(l.sqft)} sqft\n` +
    `${orNA(l.DaysOnMarket)} days on market | ${orNA(l.PhotoCount)} photos`;
}

export function formatSoldCard(s: SoldRow): string {
  const closed = s.CloseDate ? new Date(s.CloseDate).toISOString().slice(0, 10) : "?";
  return `*${s.UnparsedAddress}, ${s.City}*\n` +
    `Sold ${money(s.ClosePrice)} on ${closed} (listed ${money(s.ListPrice)})\n` +
    `${orNA(s.BedroomsTotal)}bd/${orNA(s.BathroomsTotalInteger)}ba | ${orNA(s.LivingArea)} sqft | ${orNA(s.DaysOnMarket)} days on market`;
}
