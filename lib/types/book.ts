import { z } from "zod";

const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  cover: z.string(),
  description: z.string(),
  publishedDate: z.string(),
  purchuaseDate: z.string(),
  type: z.enum(["hardcover", "paperback", "ebook", "audiobook"]),
  slug: z.string(),
  isbn: z.string().optional(),
});

export type Book = z.infer<typeof bookSchema>;
