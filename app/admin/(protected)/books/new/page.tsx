import { BookForm } from "@/components/admin/book-form";

export default function NewBookPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-4xl tracking-tight">Add a book</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a new public archive entry.
        </p>
      </div>
      <BookForm mode="create" />
    </div>
  );
}
