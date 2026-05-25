"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { BOOK_FORMATS, BOOK_GENRES, authorKey, type Book } from "@/lib/types/book";

type BookFormProps = {
  book?: Book;
  mode: "create" | "edit";
};

export function BookForm({ book, mode }: BookFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [preview, setPreview] = useState(book?.image ?? null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const endpoint =
      mode === "create" ? "/api/admin/books" : `/api/admin/books/${book?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Unable to save book.");
      setPending(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-muted-foreground">Title</span>
          <input
            name="title"
            defaultValue={book?.title}
            required
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none transition focus:border-foreground"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-muted-foreground">Author</span>
          <input
            name="author"
            defaultValue={book ? authorKey(book.author) : ""}
            required
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none transition focus:border-foreground"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-muted-foreground">Genre</span>
          <select
            name="genre"
            defaultValue={book?.genre ?? BOOK_GENRES[0]}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none transition focus:border-foreground"
          >
            {BOOK_GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-muted-foreground">Format</span>
          <select
            name="format"
            defaultValue={book?.format ?? BOOK_FORMATS[0]}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none transition focus:border-foreground"
          >
            {BOOK_FORMATS.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-muted-foreground">Date added</span>
          <input
            type="date"
            name="dateAdded"
            defaultValue={book?.dateAdded}
            required
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none transition focus:border-foreground"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-muted-foreground">Cover image</span>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-background"
            onChange={(event) => {
              const nextFile = event.target.files?.[0];
              if (nextFile) {
                setPreview(URL.createObjectURL(nextFile));
              }
            }}
          />
        </label>
      </div>

      <input type="hidden" name="existingImage" value={book?.image ?? "/placeholder-cover.svg"} />

      <label className="block space-y-2">
        <span className="text-sm text-muted-foreground">Notes</span>
        <textarea
          name="notes"
          defaultValue={book?.notes}
          rows={8}
          className="w-full rounded-[1.5rem] border border-border bg-card px-4 py-3 outline-none transition focus:border-foreground"
        />
      </label>

      {preview ? (
        <div className="relative aspect-[2/3] w-52 overflow-hidden rounded-xl border border-border bg-muted">
          {preview.startsWith("blob:") ? (
            <img src={preview} alt="Book preview" className="h-full w-full object-cover" />
          ) : (
            <Image src={preview} alt="Book preview" fill className="object-cover" sizes="208px" />
          )}
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-foreground px-5 py-3 text-sm text-background disabled:opacity-60"
        >
          {pending ? "Saving..." : mode === "create" ? "Create book" : "Save changes"}
        </button>
        <button
          type="button"
          className="rounded-full border border-border px-5 py-3 text-sm"
          onClick={() => router.push("/admin")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
