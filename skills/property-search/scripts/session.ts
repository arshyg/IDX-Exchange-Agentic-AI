/* Per-user session memory for the conversational search (Week 4).
 *   Same interface as the handbook, but saved as one JSON file per user instead of an
 *   in-memory Map, because OpenClaw starts a new process for every message.
*/

import fs from "node:fs";
import path from "node:path";
import type { ListingRow } from "./types.ts";

export interface UserSession {
  city?: string;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  type?: string;
  pool?: string;
  hasView?: string;
  page?: number;
  lastResults?: ListingRow[];
  conversationStep: number;
}

const SESSIONS_DIR = process.env.SESSIONS_DIR
  ?? path.resolve(fs.realpathSync(import.meta.dirname), "../../../.sessions");

// phone numbers / ids become safe file names
function sessionFile(userId: string): string {
  return path.join(SESSIONS_DIR, `${userId.replace(/[^A-Za-z0-9+_-]/g, "_")}.json`);
}

export function getSession(userId: string): UserSession {
  try {
    return JSON.parse(fs.readFileSync(sessionFile(userId), "utf8"));
  } catch {
    return { conversationStep: 0 };
  }
}

export function updateSession(userId: string, updates: Partial<UserSession>): UserSession {
  const session = { ...getSession(userId), ...updates };
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  fs.writeFileSync(sessionFile(userId), JSON.stringify(session, null, 2));
  return session;
}

export function clearSession(userId: string): void {
  fs.rmSync(sessionFile(userId), { force: true });
}
