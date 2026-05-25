import { readFile } from "fs/promises";
import path from "path";
import { createPool } from "@vercel/postgres";
import { loadLocalEnv } from "./load-env";

loadLocalEnv();

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
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'books'
            AND column_name = 'genre'
            AND data_type <> 'jsonb'
        ) THEN
          ALTER TABLE books ADD COLUMN genre_jsonb jsonb;

          UPDATE books
          SET genre_jsonb = to_jsonb(
            ARRAY(
              SELECT trimmed
              FROM unnest(string_to_array(genre::text, ',')) AS entry(raw)
              CROSS JOIN LATERAL (SELECT nullif(trim(entry.raw), '') AS trimmed) AS cleaned
              WHERE trimmed IS NOT NULL
            )
          );

          ALTER TABLE books DROP COLUMN genre;
          ALTER TABLE books RENAME COLUMN genre_jsonb TO genre;
        END IF;
      END
      $$;
    `);
    await pool.query("DROP INDEX IF EXISTS books_genre_idx");
    await pool.query(`
      CREATE INDEX IF NOT EXISTS books_genre_idx
      ON books USING GIN (genre)
    `);

    console.log("Applied books schema.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
