import type { Metadata } from "next";
import { ArchiveShell } from "@/components/archive/archive-shell";
import { getBook, getStats, listBooks } from "@/lib/db/books";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ book?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const selectedId = params.book;

  if (!selectedId) {
    return {
      title: siteConfig.name,
      description: siteConfig.description,
    };
  }

  const book = await getBook(selectedId);

  if (!book) {
    return {
      title: siteConfig.name,
      description: siteConfig.description,
    };
  }

  return {
    title: `${book.title} | ${siteConfig.name}`,
    description: book.notes || `${book.title} by ${Array.isArray(book.author) ? book.author.join(", ") : book.author}`,
    openGraph: {
      title: `${book.title} | ${siteConfig.name}`,
      description: book.notes || siteConfig.description,
      images: [book.image],
    },
  };
}

export default async function HomePage() {
  const [books, stats] = await Promise.all([listBooks(), getStats()]);

  return <ArchiveShell books={books} stats={stats} />;
}
