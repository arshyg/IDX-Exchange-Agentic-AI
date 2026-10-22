// mySQL connection module from the handbook 

import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

// load the repo's .env no matter which folder OpenClaw runs the script from
// (realpath follows the ~/.openclaw/workspace/skills symlink back to the repo)
dotenv.config({ path: path.resolve(fs.realpathSync(import.meta.dirname), "../../../.env"), quiet: true });

const pool = mysql.createPool({
  host:     process.env.MYSQL_HOST,
  user:     process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

export async function closePool(): Promise<void> {
  await pool.end();
}
