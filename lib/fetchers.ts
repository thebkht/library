import { sql } from "@vercel/postgres";

export async function getBooks() {
  const { rows } = await sql`SELECT * FROM books`;
  return rows;
}
