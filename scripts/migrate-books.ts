import { readFile } from "fs/promises";
import path from "path";
import { createPool } from "@vercel/postgres";

async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is required.");
  }

  const schemaPath = path.join(process.cwd(), "lib", "db", "schema.sql");
  const schemaSql = await readFile(schemaPath, "utf8");
  const statements = schemaSql
    .split(/;\s*\n/g)
    .map((statement) => statement.trim())
    .filter(Boolean);

  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    for (const statement of statements) {
      await pool.query(statement);
    }

    await pool.query("ALTER TABLE books DROP CONSTRAINT IF EXISTS books_genre_check");

    console.log("Applied books schema.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
