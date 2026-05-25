import { sql } from "@vercel/postgres";
import { randomUUID } from "crypto";
import {
  bookInputSchema,
  bookSchema,
  slugifyBookTitle,
  type Book,
  type BookInput,
  type BookFormat,
  type BookGenre,
} from "@/lib/types/book";

type BookRow = {
  id: string;
  title: string;
  author: string[] | string;
  genre: BookGenre;
  format: BookFormat;
  image: string;
  date_added: Date | string;
  notes: string | null;
  created_at?: Date | string;
  updated_at?: Date | string;
};

function toDateString(value: Date | string): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

function fromRow(row: BookRow): Book {
  return bookSchema.parse({
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    format: row.format,
    image: row.image,
    dateAdded: toDateString(row.date_added),
    notes: row.notes ?? undefined,
  });
}

function toAuthorJson(author: Book["author"]): string[] | string {
  return Array.isArray(author) ? author : author;
}

export async function listBooks(): Promise<Book[]> {
  const { rows } = await sql<BookRow>`
    SELECT id, title, author, genre, format, image, date_added, notes, created_at, updated_at
    FROM books
    ORDER BY date_added DESC, title ASC
  `;

  return rows.map(fromRow);
}

export async function getBook(id: string): Promise<Book | null> {
  const { rows } = await sql<BookRow>`
    SELECT id, title, author, genre, format, image, date_added, notes, created_at, updated_at
    FROM books
    WHERE id = ${id}
    LIMIT 1
  `;

  const row = rows[0];
  return row ? fromRow(row) : null;
}

export async function findBookByLegacySlug(slug: string): Promise<Book | null> {
  const books = await listBooks();
  return books.find((book) => slug === book.id) ??
    books.find((book) => slug === slugifyBookTitle(book.title)) ??
    null;
}

export async function createBook(input: BookInput): Promise<Book> {
  const parsed = bookInputSchema.parse(input);
  const id = randomUUID();

  const { rows } = await sql<BookRow>`
    INSERT INTO books (id, title, author, genre, format, image, date_added, notes)
    VALUES (
      ${id},
      ${parsed.title},
      ${JSON.stringify(toAuthorJson(parsed.author))}::jsonb,
      ${parsed.genre},
      ${parsed.format},
      ${parsed.image},
      ${parsed.dateAdded}::date,
      ${parsed.notes ?? null}
    )
    RETURNING id, title, author, genre, format, image, date_added, notes, created_at, updated_at
  `;

  return fromRow(rows[0]);
}

export async function updateBook(id: string, input: BookInput): Promise<Book | null> {
  const parsed = bookInputSchema.parse(input);

  const { rows } = await sql<BookRow>`
    UPDATE books
    SET
      title = ${parsed.title},
      author = ${JSON.stringify(toAuthorJson(parsed.author))}::jsonb,
      genre = ${parsed.genre},
      format = ${parsed.format},
      image = ${parsed.image},
      date_added = ${parsed.dateAdded}::date,
      notes = ${parsed.notes ?? null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, author, genre, format, image, date_added, notes, created_at, updated_at
  `;

  const row = rows[0];
  return row ? fromRow(row) : null;
}

export async function deleteBook(id: string): Promise<Book | null> {
  const { rows } = await sql<BookRow>`
    DELETE FROM books
    WHERE id = ${id}
    RETURNING id, title, author, genre, format, image, date_added, notes, created_at, updated_at
  `;

  const row = rows[0];
  return row ? fromRow(row) : null;
}

export async function getStats() {
  const books = await listBooks();
  const formats = books.reduce<Record<string, number>>((acc, book) => {
    acc[book.format] = (acc[book.format] ?? 0) + 1;
    return acc;
  }, {});

  const lastUpdated =
    books
      .map((book) => book.dateAdded)
      .sort((left, right) => right.localeCompare(left))[0] ?? null;

  return {
    total: books.length,
    genres: {
      Fiction: books.filter((book) => book.genre === "Fiction").length,
      Nonfiction: books.filter((book) => book.genre === "Nonfiction").length,
      Poetry: books.filter((book) => book.genre === "Poetry").length,
    },
    formats,
    lastUpdated,
  };
}
