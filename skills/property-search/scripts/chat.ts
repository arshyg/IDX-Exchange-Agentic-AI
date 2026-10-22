/* The command the OpenClaw skill runs for the conversational search (Week 4).
 *   Each call: parse the message (Week 2) → merge the filters into the user's saved
 *   session → search rets_property (Week 3) once city, budget and type are known.
 *   Claude asks the follow-up questions; this script remembers the answers between messages.
*/

import { parsePropertyQuery } from "./parsePropertyQuery.ts";
import { searchActiveListings } from "./search.ts";
import { formatListingCard } from "./format.ts";
import { closePool } from "./db.ts";
import { getSession, updateSession, clearSession, type UserSession } from "./session.ts";

const USAGE = "Usage: tsx chat.ts --user <id> ['<message>'] [--reset] [--more] [--search]";

const args = process.argv.slice(2);
let userId = "";
let reset = false, more = false, forceSearch = false;
const words: string[] = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--user")        userId = args[++i] ?? "";
  else if (args[i] === "--reset")  reset = true;
  else if (args[i] === "--more")   more = true;
  else if (args[i] === "--search") forceSearch = true;
  else words.push(args[i]);
}

const message = words.join(" ").trim();
if (!userId || (!message && !reset && !more && !forceSearch)) {
  console.error(USAGE);
  process.exit(1);
}

const TYPE_LABELS: Record<string, string> = {
  Condominium: "Condos", Townhouse: "Townhomes", SingleFamilyResidence: "Single family homes", UnimprovedLand: "Land",
};

function describe(s: UserSession): string {
  const parts = [`${(s.type && TYPE_LABELS[s.type]) ?? "Homes"}${s.city ? ` in ${s.city}` : ""}`];
  if (s.maxPrice) parts.push(`under $${s.maxPrice.toLocaleString("en-US")}`);
  if (s.beds)     parts.push(`${s.beds}+ beds`);
  if (s.baths)    parts.push(`${s.baths}+ baths`);
  if (s.sqft)     parts.push(`${s.sqft}+ sqft`);
  if (s.pool)     parts.push("with a pool");
  if (s.hasView)  parts.push("with a view");
  return parts.join(", ");
}

if (reset) {
  clearSession(userId);
  if (!message) {
    console.log("Session cleared.");
    process.exit(0);
  }
}
let session = getSession(userId);

// merge only the filters this message mentions, so earlier answers are kept
const updates: Partial<UserSession> = { conversationStep: session.conversationStep + 1 };
if (message) {
  for (const [key, value] of Object.entries(await parsePropertyQuery(message))) {
    if (value !== null) (updates as Record<string, unknown>)[key] = value;
  }
}
session = updateSession(userId, updates);

const missing = [
  !session.city && "city",
  !session.maxPrice && "budget",
  !session.type && "property type",
].filter(Boolean) as string[];

console.log(`Saved search: ${describe(session)}`);

// city is required; budget and type can be skipped with --search
if (!session.city || (missing.length > 0 && !forceSearch && !more)) {
  console.log(`Still needed: ${missing.join(", ")}`);
  process.exit(0);
}

const page = more ? (session.page ?? 1) + 1 : 1;
try {
  const results = await searchActiveListings({
    city: session.city ?? null, maxPrice: session.maxPrice ?? null, beds: session.beds ?? null,
    baths: session.baths ?? null, sqft: session.sqft ?? null, type: session.type ?? null,
    pool: session.pool ?? null, hasView: session.hasView ?? null,
  }, page);

  if (results.length === 0) {
    console.log(page > 1 ? "No more listings match this search." : "No active listings match this search.");
  } else {
    updateSession(userId, { page, lastResults: results });
    console.log([`Page ${page}:`, ...results.map(formatListingCard)].join("\n\n"));
  }
} catch (err) {
  console.error(`Search failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
} finally {
  await closePool();
}
