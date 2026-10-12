import { parsePropertyQuery } from "./parsePropertyQuery.ts";

const query = process.argv.slice(2).join(" ").trim();
if (!query) {
  console.error("Usage: tsx cli.ts '<search query>'");
  process.exit(1);
}
console.log(JSON.stringify(await parsePropertyQuery(query), null, 2));
