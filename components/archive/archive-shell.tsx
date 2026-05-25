"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useMemo } from "react";
import { useQueryStates } from "nuqs";
import { formatDate } from "@/lib/date";
import { archiveSearchParams, sortModes, viewModes } from "@/lib/archive/search-params";
import {
  BOOK_FORMATS,
  BOOK_GENRES,
  authorKey,
  normalizeAuthor,
  type Book,
} from "@/lib/types/book";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Stats = {
  total: number;
  genres: Record<string, number>;
  formats: Record<string, number>;
  lastUpdated: string | null;
};

type ArchiveShellProps = {
  books: Book[];
  stats: Stats;
};

type AuthorCount = {
  name: string;
  count: number;
};

function viewLabel(view: (typeof viewModes)[number]) {
  return view[0].toUpperCase() + view.slice(1);
}

function sortLabel(sort: (typeof sortModes)[number]) {
  return sort[0].toUpperCase() + sort.slice(1);
}

export function ArchiveShell({ books, stats }: ArchiveShellProps) {
  const [params, setParams] = useQueryStates(archiveSearchParams, {
    shallow: false,
  });

  const authorCounts = useMemo<AuthorCount[]>(() => {
    const counts = new Map<string, number>();
    for (const book of books) {
      const key = authorKey(book.author);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [books]);

  const filteredBooks = useMemo(() => {
    const next = books
      .filter((book) => (params.genre === "All" ? true : book.genre === params.genre))
      .filter((book) => (params.format === "All" ? true : book.format === params.format))
      .filter((book) => (params.author ? authorKey(book.author) === params.author : true))
      .slice();

    next.sort((left, right) => {
      if (params.sort === "recent") {
        return right.dateAdded.localeCompare(left.dateAdded);
      }
      if (params.sort === "author") {
        return authorKey(left.author).localeCompare(authorKey(right.author));
      }
      return left.title.localeCompare(right.title);
    });

    return next;
  }, [books, params.author, params.format, params.genre, params.sort]);

  const selectedBook =
    filteredBooks.find((book) => book.id === params.book) ??
    books.find((book) => book.id === params.book) ??
    null;

  const lastUpdated = stats.lastUpdated ? formatDate(stats.lastUpdated) : "Unpublished";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-4xl tracking-tight sm:text-5xl">
                bkht.library
              </p>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {stats.total} volumes collected across fiction, nonfiction, and poetry.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              <Stat label="Fiction" value={stats.genres.Fiction ?? 0} />
              <Stat label="Nonfiction" value={stats.genres.Nonfiction ?? 0} />
              <Stat label="Poetry" value={stats.genres.Poetry ?? 0} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
            {(["All", ...BOOK_GENRES] as const).map((genre) => (
              <button
                key={genre}
                className={tabClass(params.genre === genre)}
                onClick={() => setParams({ genre, book: null })}
                type="button"
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="grid gap-4 border-t border-border/70 pt-4 lg:grid-cols-[1fr_auto_auto]">
            <ControlGroup label="View by">
              {viewModes.map((view) => (
                <button
                  key={view}
                  className={chipClass(params.view === view)}
                  onClick={() => setParams({ view })}
                  type="button"
                >
                  {viewLabel(view)}
                </button>
              ))}
            </ControlGroup>
            <ControlGroup label="Sort">
              <select
                className={selectClass}
                value={params.sort}
                onChange={(event) => setParams({ sort: event.target.value as (typeof sortModes)[number] })}
              >
                {sortModes.map((sort) => (
                  <option key={sort} value={sort}>
                    {sortLabel(sort)}
                  </option>
                ))}
              </select>
            </ControlGroup>
            <ControlGroup label="Format">
              <select
                className={selectClass}
                value={params.format}
                onChange={(event) => setParams({ format: event.target.value as typeof params.format })}
              >
                {["All", ...BOOK_FORMATS].map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </ControlGroup>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <AuthorRail
            authors={authorCounts}
            selectedAuthor={params.author}
            onSelect={(author) => setParams({ author, book: null })}
          />
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <p className="text-sm text-muted-foreground">
              {filteredBooks.length} books shown
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <button className={chipClass(false)} type="button">
                  Authors ({authorCounts.length})+
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card">
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl">Authors</SheetTitle>
                  <SheetDescription>
                    Filter the archive by author.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <AuthorRail
                    authors={authorCounts}
                    selectedAuthor={params.author}
                    onSelect={(author) => setParams({ author, book: null })}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className={gridClass(params.view)}>
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => setParams({ book: book.id })}
                className={bookCardClass(params.view)}
              >
                <div className={imageWrapClass(params.view)}>
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    sizes={
                      params.view === "gallery"
                        ? "(max-width: 1024px) 50vw, 25vw"
                        : "(max-width: 1024px) 33vw, 18vw"
                    }
                    className="object-cover"
                  />
                </div>
                <div className={metaClass(params.view)}>
                  <p className="font-display text-xl leading-tight">{book.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {authorKey(book.author)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-border/80 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>A personal archive of books I own and keep returning to.</p>
          <div className="flex flex-wrap items-center gap-4">
            <p>Last updated {lastUpdated}</p>
            <Link href="https://github.com/thebkht" className="hover:text-foreground">
              Made by bkht
            </Link>
            <Link href="/admin" className="hover:text-foreground">
              Admin
            </Link>
          </div>
        </div>
      </footer>

      <Dialog
        open={Boolean(selectedBook)}
        onOpenChange={(open) => {
          if (!open) {
            setParams({ book: null });
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border border-border bg-card p-5 sm:p-8">
          {selectedBook ? (
            <div className="grid gap-8 md:grid-cols-[280px_minmax(0,1fr)]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted">
                <Image
                  src={selectedBook.image}
                  alt={selectedBook.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>
              <div>
                <DialogHeader className="space-y-3 text-left">
                  <DialogTitle className="font-display text-4xl leading-none">
                    {selectedBook.title}
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    {authorKey(selectedBook.author)}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 flex flex-wrap gap-2 text-sm">
                  <span className={badgeClass}>{selectedBook.genre}</span>
                  <span className={badgeClass}>{selectedBook.format}</span>
                  <span className={badgeClass}>Added {formatDate(selectedBook.dateAdded)}</span>
                </div>
                <div className="mt-6 space-y-4 text-[15px] leading-7 text-foreground/85">
                  <p>
                    {selectedBook.notes ||
                      "No notes yet. This record exists as part of the public archive."}
                  </p>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Authors
                    </p>
                    <p className="mt-2">{normalizeAuthor(selectedBook.author).join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-2xl text-foreground">{value}</p>
      <p>{label}</p>
    </div>
  );
}

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function AuthorRail({
  authors,
  selectedAuthor,
  onSelect,
}: {
  authors: AuthorCount[];
  selectedAuthor: string | null;
  onSelect: (author: string | null) => void;
}) {
  const visibleAuthors = authors.slice(0, 18);
  const hiddenAuthors = authors.slice(18);

  return (
    <div className="sticky top-40 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Authors ({authors.length})+
        </p>
        {selectedAuthor ? (
          <button
            type="button"
            className="text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground"
            onClick={() => onSelect(null)}
          >
            Clear
          </button>
        ) : null}
      </div>
      <div className="space-y-2 text-sm">
        {visibleAuthors.map((author) => (
          <button
            key={author.name}
            type="button"
            className={authorRowClass(selectedAuthor === author.name)}
            onClick={() => onSelect(selectedAuthor === author.name ? null : author.name)}
          >
            <span>{author.name}</span>
            <span>{author.count}</span>
          </button>
        ))}
      </div>
      {hiddenAuthors.length > 0 ? (
        <details className="group">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            Show {hiddenAuthors.length} more
          </summary>
          <div className="mt-3 space-y-2 text-sm">
            {hiddenAuthors.map((author) => (
              <button
                key={author.name}
                type="button"
                className={authorRowClass(selectedAuthor === author.name)}
                onClick={() => onSelect(selectedAuthor === author.name ? null : author.name)}
              >
                <span>{author.name}</span>
                <span>{author.count}</span>
              </button>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}

const selectClass =
  "min-w-[180px] rounded-full border border-border bg-card px-4 py-2 text-sm outline-none transition focus:border-foreground";
const badgeClass =
  "rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground";

function tabClass(active: boolean) {
  return active
    ? "rounded-full border border-foreground bg-foreground px-4 py-2 text-sm text-background"
    : "rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground hover:border-foreground/50";
}

function chipClass(active: boolean) {
  return active
    ? "rounded-full border border-foreground bg-foreground px-3 py-2 text-sm text-background"
    : "rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground hover:border-foreground/50";
}

function authorRowClass(active: boolean) {
  return active
    ? "flex w-full items-center justify-between rounded-full bg-foreground px-3 py-2 text-left text-background"
    : "flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-foreground hover:bg-background";
}

function gridClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "space-y-4";
  }
  if (view === "gallery") {
    return "grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4";
  }
  return "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
}

function bookCardClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "flex w-full items-center gap-4 border-b border-border/60 pb-4 text-left";
  }
  return "text-left";
}

function imageWrapClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "relative aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-md bg-muted";
  }
  if (view === "gallery") {
    return "relative aspect-[2/3] overflow-hidden rounded-md bg-muted";
  }
  return "relative aspect-[2/3] overflow-hidden rounded-sm bg-muted";
}

function metaClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "min-w-0";
  }
  return "pt-3";
}
