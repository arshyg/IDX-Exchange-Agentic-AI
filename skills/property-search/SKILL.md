---
name: property-search
description: Multi-turn California home search over active MLS listings (rets_property). Remembers each user's city, budget, beds, baths, sqft, type, pool and view across messages, asks follow-ups for what is missing, and returns formatted property cards. Can also show recent sold comps (california_sold).
---

# Property Search

For any message that is part of a home search (a new search, an answer to your follow-up question, a refinement, or "show more"), use the `exec` tool to run:

```bash
/Users/arshiagupta/IDX-Exchange-Agentic-AI/node_modules/.bin/tsx {baseDir}/scripts/chat.ts --user '<sender>' '<query>'
```

- `<sender>`: the WhatsApp number of the person you are talking to. Always the same value for the same person, so their search is remembered.
- `<query>`: the search details from this message only. The script remembers earlier answers.
  - Rewrite short answers into search phrases: "1.2M" → `under 1.2m`, "Irvine" → `in Irvine`, "condo" → `condo`, "3" (to a beds question) → `3 beds`.
  - Keep only letters, digits, spaces, and `$ . , -`. Always wrap it in single quotes.

Flags (put them after the query):
- `--more`: the user wants more results. No query needed.
- `--search`: the user has no preference for budget or type ("any", "doesn't matter"). Searches with what is saved.
- `--reset`: the user starts a new search ("start over", or a different city). Can be combined with a query to start fresh with it.

## Reading the output

- `Saved search: ...` is everything remembered so far.
- `Still needed: ...` means do not show results yet. Ask the user about the first missing item, one question at a time:
  - city → "Which city are you looking in?"
  - budget → "What is your budget?"
  - property type → "Any preferences — condo, townhome, or single family?"
- `Page N:` followed by cards: send the cards as-is. Do not invent listings or fields. Mention they can say "more", add a filter, or start over.
- `No active listings match`: suggest loosening a filter (higher budget, fewer beds, nearby city).

## Sold comps

When the user asks what homes sold for, or for recent sales or comps in a city, run instead:

```bash
/Users/arshiagupta/IDX-Exchange-Agentic-AI/node_modules/.bin/tsx {baseDir}/scripts/cli.ts 'in <city>' --sold
```
