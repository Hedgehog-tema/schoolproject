// Run with: npm run migrate
// Applies schema.sql then seed.sql to the configured DATABASE_URL.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const seed = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");

  console.log("Applying schema...");
  await pool.query(schema);
  console.log("Applying seed data...");
  await pool.query(seed);
  console.log("Done.");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
