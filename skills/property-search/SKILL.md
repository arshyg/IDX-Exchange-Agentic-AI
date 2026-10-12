---
name: property-search
description: Converts a free-text California home search (city, price, beds, baths, sqft, type, pool, view) into a structured filter object.
---

# Property Search

When the user describes homes they want to find, use the `exec` tool to run:

```bash
/Users/arshiagupta/IDX-Exchange-Agentic-AI/node_modules/.bin/tsx {baseDir}/scripts/cli.ts '<query>'
```

Rules for `<query>`:
- Use only the search request, not the whole message.
- Keep only letters, digits, spaces, and the characters `$ . , -`. Remove everything else, including quotes.
- Always wrap it in single quotes.

Return the JSON filter object the script prints. Unspecified filters are `null`.
