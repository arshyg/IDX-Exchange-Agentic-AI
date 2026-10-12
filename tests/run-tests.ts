import { parsePropertyQuery } from "../skills/property-search/scripts/parsePropertyQuery.ts";

const queries = [
  "Show me 3-bedroom condos in Irvine under $1.5M with a pool.",
  "2 bed townhome in Newport Beach under 900k",
  "single family home in Pasadena under $2M with 2.5 baths",
  "condo in Laguna Beach with a view",
  "4 bedroom house in San Diego under $1,200,000",
  "land in Temecula under 300k",
  "3 beds 2 baths in Fullerton",
  "homes with a pool in Riverside",
  "1800 sqft single family in Torrance under 1.1m",
  "Find a 2 bedroom condo in Santa Monica under $950k with a view",
];

for (const query of queries) {
  console.log(query);
  console.log(JSON.stringify(await parsePropertyQuery(query), null, 2));
  console.log();
}
