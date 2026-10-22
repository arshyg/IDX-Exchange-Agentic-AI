/* The command the OpenClaw skill runs. It connects every piece of the
 *   pipeline in one call:
 *     free-text query → parsePropertyQuery (Week 2) → searchActiveListings
 *     (MySQL) → formatListingCard → printed property cards
 *   With --sold it also pulls recent closed sales from california_sold via getSoldComps.
 *   This is what makes the skill meet the Week 3 deliverable: it accepts NLP filters from Week 2, queries rets_property and/or california_sold, and
 *   returns formatted property cards.
*/

import { parsePropertyQuery } from "./parsePropertyQuery.ts";
import { searchActiveListings, getSoldComps } from "./search.ts";
import { formatListingCard, formatSoldCard } from "./format.ts";
import { closePool } from "./db.ts";

const USAGE = "Usage: tsx cli.ts '<search query>' [--page N] [--sold] [--filters-only]";

const args = process.argv.slice(2);
let page = 1;
let includeSold = false;
let filtersOnly = false;
const words: string[] = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--page")              page = Number(args[++i]);
  else if (args[i] === "--sold")         includeSold = true;
  else if (args[i] === "--filters-only") filtersOnly = true;
  else words.push(args[i]);
}

const queryText = words.join(" ").trim();
if (!queryText || !Number.isInteger(page) || page < 1) {
  console.error(USAGE);
  process.exit(1);
}

const filters = await parsePropertyQuery(queryText);

if (filtersOnly) {
  console.log(JSON.stringify(filters, null, 2));
  process.exit(0);
}

try {
  const listings = await searchActiveListings(filters, page);
  const out: string[] = [];

  if (listings.length === 0) {
    out.push(page > 1 ? "No more active listings match this search." : "No active listings match this search.");
  } else {
    out.push(`Active listings (page ${page}):`);
    out.push(...listings.map(formatListingCard));
  }

  if (includeSold) {
    if (!filters.city) {
      out.push("Recent sales need a city. Add one to the search (e.g. 'in Irvine').");
    } else {
      const sold = await getSoldComps(filters.city);
      out.push(sold.length
        ? `Recent sales in ${filters.city} (last 12 months):`
        : `No residential sales in ${filters.city} in the last 12 months.`);
      out.push(...sold.slice(0, 5).map(formatSoldCard));
    }
  }

  console.log(out.join("\n\n"));
} catch (err) {
  console.error(`Search failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
} finally {
  await closePool();
}
