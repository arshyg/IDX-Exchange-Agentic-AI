---
name: property-search
description: Parses a natural-language California home search (city, price, beds, baths, sqft, type, pool, view) into structured filters.
---

# Property Search (filter parser)

When the user describes homes they want to find (for example "3 bed condo in Irvine under $1.5M with a pool"), turn their request into a structured filter object by running the parser with the `exec` tool:

```bash
~/idx-agent/node_modules/.bin/tsx {baseDir}/scripts/parse-query.ts '<query>'
```

Rules for `<query>`:
- Use only the search request itself, not the whole message.
- Keep only letters, digits, spaces, and the characters `$ . , -`. Remove everything else, including quotes, before running the command.
- Always wrap it in single quotes.

Return the JSON the script prints. Briefly list which filters were detected and which were not (null), and ask a follow-up question if no city or price was found.

This skill only parses the request. It does not search listings yet.