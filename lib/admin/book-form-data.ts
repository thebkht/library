import { z } from "zod";
import { BOOK_FORMATS, BOOK_GENRES, type BookInput } from "@/lib/types/book";

const formSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  genre: z.enum(BOOK_GENRES),
  format: z.enum(BOOK_FORMATS),
  dateAdded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
  existingImage: z.string().optional(),
});

export async function parseBookFormData(formData: FormData): Promise<{
  input: BookInput;
  file: File | null;
  existingImage?: string;
}> {
  const fileValue = formData.get("image");
  const file =
    fileValue instanceof File && fileValue.size > 0 ? fileValue : null;

  const parsed = formSchema.parse({
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    format: formData.get("format"),
    dateAdded: formData.get("dateAdded"),
    notes: formData.get("notes") || undefined,
    existingImage: formData.get("existingImage") || undefined,
  });

  const authors = parsed.author
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return {
    input: {
      title: parsed.title,
      author: authors.length > 1 ? authors : authors[0],
      genre: parsed.genre,
      format: parsed.format,
      dateAdded: parsed.dateAdded,
      notes: parsed.notes,
      image: parsed.existingImage || "/placeholder-cover.svg",
    },
    file,
    existingImage: parsed.existingImage,
  };
}
