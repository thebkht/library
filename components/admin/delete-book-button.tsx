"use client";

import { useRouter } from "next/navigation";

export function DeleteBookButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="text-destructive"
      onClick={async () => {
        if (!window.confirm("Delete this book?")) {
          return;
        }

        await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
        router.refresh();
      }}
    >
      Delete
    </button>
  );
}
