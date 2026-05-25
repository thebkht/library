import { z } from "zod";

export const BOOK_GENRES = ["Fiction", "Nonfiction", "Poetry"] as const;
export const BOOK_FORMATS = [
  "Hardcover",
  "Paperback",
  "Trade Paperback",
  "Mass Market",
  "Other",
] as const;

export const bookSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  author: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
  genre: z.enum(BOOK_GENRES),
  format: z.enum(BOOK_FORMATS),
  image: z.union([z.string().url(), z.string().startsWith("/")]),
  dateAdded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

export const bookInputSchema = bookSchema.omit({ id: true });

export type Book = z.infer<typeof bookSchema>;
export type BookInput = z.infer<typeof bookInputSchema>;
export type BookGenre = (typeof BOOK_GENRES)[number];
export type BookFormat = (typeof BOOK_FORMATS)[number];

export type LegacyBookSeed = {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  publishedDate: string;
  purchuaseDate: string;
  type: "hardcover" | "paperback" | "ebook" | "audiobook";
  slug: string;
  isbn?: string;
};

export function normalizeAuthor(author: Book["author"]): string[] {
  const values = Array.isArray(author) ? author : [author];

  return values
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

export function authorKey(author: Book["author"]): string {
  return normalizeAuthor(author).join(", ");
}

export function formatLabel(format: BookFormat): string {
  return format;
}

export function slugifyBookTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['".,():]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
