#!/usr/bin/env bash
# Week 4 live WhatsApp test: preflight checks, then the messages to send.
# Run from the repo root:  bash tests/whatsapp-test.sh
set -u
cd "$(dirname "$0")/.."
CHAT="node_modules/.bin/tsx skills/property-search/scripts/chat.ts"

echo "== 1. Skill is visible to OpenClaw"
openclaw skills info property-search | head -1

echo; echo "== 2. Database works (a full search through chat.ts, using a throwaway session)"
export SESSIONS_DIR="$(mktemp -d)"
$CHAT --user preflight 'single family in Irvine under 1.2m' | head -12
unset SESSIONS_DIR

echo; echo "== 3. Restarting the gateway so new chats load the updated skill"
openclaw gateway restart
sleep 3
openclaw gateway status | head -5

cat <<'EOF'

== 4. Send these from your phone to the OpenClaw WhatsApp number, one at a time.
      Wait for each reply before sending the next.

   1. start over
   2. Find homes in Irvine                      → expect: asks for your budget
   3. Under $1.2M                               → expect: asks condo / townhome / single family
   4. Single family with at least 3 beds        → expect: property cards (address, price, beds/baths, photos)
   5. with a pool                               → expect: new cards, all with pools
   6. more                                      → expect: page 2 (or "no more listings")
   7. how about Pasadena, any type, under 900k  → expect: new search in Pasadena

== 5. While you test, in a second terminal:
   openclaw logs --follow          # shows each chat.ts command Claude runs
   cat .sessions/*.json            # after a few messages: your saved search, in a file named after your number
EOF
