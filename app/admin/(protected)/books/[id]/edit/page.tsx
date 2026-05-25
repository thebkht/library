import { notFound } from "next/navigation";
import { BookForm } from "@/components/admin/book-form";
import { getBook } from "@/lib/db/books";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-4xl tracking-tight">Edit book</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Update metadata, notes, and cover art.
        </p>
      </div>
      <BookForm mode="edit" book={book} />
    </div>
  );
}
