import Link from "next/link";
import { DeleteBookButton } from "@/components/admin/delete-book-button";
import { formatDate } from "@/lib/date";
import { getStats, listBooks } from "@/lib/db/books";
import { authorKey, genreKey } from "@/lib/types/book";

export default async function AdminDashboardPage() {
  const [books, stats] = await Promise.all([listBooks(), getStats()]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-4xl tracking-tight">Archive dashboard</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {stats.total} books indexed. Last updated{" "}
            {stats.lastUpdated ? formatDate(stats.lastUpdated) : "not yet"}.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/books/new"
            className="rounded-full bg-foreground px-5 py-3 text-sm text-background"
          >
            Add book
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[1.75rem] border border-border bg-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-border bg-background/70 text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-normal">Title</th>
              <th className="px-5 py-4 font-normal">Author</th>
              <th className="px-5 py-4 font-normal">Genre</th>
              <th className="px-5 py-4 font-normal">Format</th>
              <th className="px-5 py-4 font-normal">Added</th>
              <th className="px-5 py-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-border/70 last:border-b-0">
                <td className="px-5 py-4 font-display text-lg">{book.title}</td>
                <td className="px-5 py-4">{authorKey(book.author)}</td>
                <td className="px-5 py-4">{genreKey(book.genre)}</td>
                <td className="px-5 py-4">{book.format}</td>
                <td className="px-5 py-4">{formatDate(book.dateAdded)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/books/${book.id}/edit`} className="hover:text-muted-foreground">
                      Edit
                    </Link>
                    <DeleteBookButton id={book.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
