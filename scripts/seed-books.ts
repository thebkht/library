import { existsSync } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import sharp from "sharp";
import { books as legacyBooks } from "../data/book";
import { slugifyBookTitle, type BookFormat, type BookGenre } from "../lib/types/book";

const genreOverrides: Record<string, BookGenre> = {
  "reopening-muslim-mind": "Nonfiction",
  "digital-design": "Nonfiction",
  "operating-system": "Nonfiction",
  "software-engineering": "Nonfiction",
  "cpp-plus-data-structures": "Nonfiction",
  "advanced-engineering-math": "Nonfiction",
  "csharp-7-i-dotnet-core": "Nonfiction",
  "introduction-to-algorithms": "Nonfiction",
  "problem-solving-with-cpp": "Nonfiction",
  "csharp-10-in-a-nutshell": "Nonfiction",
  "csharp-12-in-a-nutshell": "Nonfiction",
  "on-the-treatment-of-the-lust": "Poetry",
};

function mapFormat(type: string): BookFormat {
  switch (type) {
    case "hardcover":
      return "Hardcover";
    case "paperback":
      return "Paperback";
    default:
      return "Other";
  }
}

function inferGenre(slug: string): BookGenre {
  return genreOverrides[slug] ?? "Fiction";
}

async function uploadCover(coverPath: string, id: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return "/placeholder-cover.svg";
  }

  const absolutePath = path.join(process.cwd(), "public", coverPath.replace(/^\//, ""));

  if (!existsSync(absolutePath)) {
    return "/placeholder-cover.svg";
  }

  const buffer = await sharp(absolutePath)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  const blob = await put(`books/${id}.jpg`, buffer, {
    access: "public",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: "image/jpeg",
  });

  return blob.url;
}

async function main() {
  for (const legacy of legacyBooks) {
    const id = legacy.slug || slugifyBookTitle(legacy.title);
    const image = await uploadCover(legacy.cover, id);
    const notes = legacy.description.slice(0, 1200);
    const dateAdded = legacy.purchuaseDate.slice(0, 10);

    await sql`
      INSERT INTO books (id, title, author, genre, format, image, date_added, notes)
      VALUES (
        ${id},
        ${legacy.title},
        ${JSON.stringify(
          legacy.author.includes(",")
            ? legacy.author.split(",").map((entry) => entry.trim())
            : legacy.author
        )}::jsonb,
        ${inferGenre(legacy.slug)},
        ${mapFormat(legacy.type)},
        ${image},
        ${dateAdded}::date,
        ${notes}
      )
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        author = EXCLUDED.author,
        genre = EXCLUDED.genre,
        format = EXCLUDED.format,
        image = EXCLUDED.image,
        date_added = EXCLUDED.date_added,
        notes = EXCLUDED.notes,
        updated_at = NOW()
    `;
  }

  console.log(`Seeded ${legacyBooks.length} books.`);
}

main().catch((error) => {
  if (error && typeof error === "object" && "code" in error && error.code === "42P01") {
    console.error(
      'Books table does not exist. Run "pnpm db:migrate:books" first, then rerun the seed.'
    );
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});
