"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";
import { useQueryStates } from "nuqs";
import { formatDate } from "@/lib/date";
import {
  archiveSearchParams,
  sortModes,
  viewModes,
} from "@/lib/archive/search-params";
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
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [authorsOpen, setAuthorsOpen] = useState(true);

  const authorCounts = useMemo<AuthorCount[]>(() => {
    const counts = new Map<string, number>();
    for (const book of books) {
      for (const author of normalizeAuthor(book.author)) {
        counts.set(author, (counts.get(author) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [books]);

  const filteredBooks = useMemo(() => {
    const next = books
      .filter((book) =>
        params.genre === "All" ? true : book.genre === params.genre,
      )
      .filter((book) =>
        params.format === "All" ? true : book.format === params.format,
      )
      .filter((book) =>
        params.author ? normalizeAuthor(book.author).includes(params.author) : true,
      )
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

  const lastUpdated = stats.lastUpdated
    ? formatDate(stats.lastUpdated)
    : "Unpublished";
  const isListView = params.view === "list";

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="flex-1">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 pb-16 pt-8 sm:px-6 md:flex-row md:gap-12 md:pb-24 md:pt-14">
            <aside className="md:sticky md:top-14 md:max-h-[calc(100vh-3.5rem)] md:w-48 md:shrink-0 md:overflow-y-auto md:pr-2">
              <Link
                href="/"
                className="block text-[14px] font-semibold leading-none tracking-tight text-ink"
              >
                bkht.library
              </Link>

              <nav className="mt-7 hidden flex-col gap-[3px] text-[13px] font-semibold leading-none md:flex">
                {(["All", ...BOOK_GENRES] as const).map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    className={navButtonClass(params.genre === genre)}
                    onClick={() => setParams({ genre, book: null })}
                  >
                    {genre}
                  </button>
                ))}
              </nav>

              <div className="mt-7 hidden flex-col gap-[3px] text-[13px] font-semibold leading-none md:flex">
                <div className="mb-0.5 text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted-foreground">
                  View by
                </div>
                {viewModes.map((view) => (
                  <button
                    key={view}
                    type="button"
                    className={navButtonClass(params.view === view)}
                    onClick={() => setParams({ view })}
                  >
                    {viewLabel(view)}
                  </button>
                ))}
              </div>

              <div className="mt-7 hidden flex-col gap-[3px] text-[13px] font-semibold leading-none md:flex">
                <div className="mb-0.5 text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted-foreground">
                  Sort
                </div>
                {sortModes.map((sort) => (
                  <button
                    key={sort}
                    type="button"
                    className={navButtonClass(params.sort === sort)}
                    onClick={() => setParams({ sort })}
                  >
                    {sortLabel(sort)}
                  </button>
                ))}
              </div>

              <div className="mt-7 hidden text-[12px] font-semibold leading-snug md:block">
                <AuthorRail
                  authors={authorCounts}
                  selectedAuthor={params.author}
                  onSelect={(author) => setParams({ author, book: null })}
                  open={authorsOpen}
                  onToggle={() => setAuthorsOpen((open) => !open)}
                />
              </div>

              <div className="mt-7 hidden text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted-foreground md:block">
                {stats.total} volumes
              </div>

              <div className="mt-4 flex flex-col gap-3 md:hidden">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-semibold">
                  {(["All", ...BOOK_GENRES] as const).map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      className={mobileInlineClass(params.genre === genre)}
                      onClick={() => setParams({ genre, book: null })}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted-foreground">
                  <span>View by</span>
                  {viewModes.map((view) => (
                    <button
                      key={view}
                      type="button"
                      className={mobileInlineClass(params.view === view)}
                      onClick={() => setParams({ view })}
                    >
                      {viewLabel(view)}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted-foreground">
                  <span>Sort</span>
                  {sortModes.map((sort) => (
                    <button
                      key={sort}
                      type="button"
                      className={mobileInlineClass(params.sort === sort)}
                      onClick={() => setParams({ sort })}
                    >
                      {sortLabel(sort)}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5 text-[12px] font-semibold leading-snug">
                  <MobileAuthors
                    authors={authorCounts}
                    selectedAuthor={params.author}
                    onSelect={(author) => setParams({ author, book: null })}
                    open={authorsOpen}
                    onToggle={() => setAuthorsOpen((open) => !open)}
                  />
                </div>
              </div>
            </aside>

            <section className="min-w-0 flex-1">
              {isListView ? (
                <div className="book-list flex flex-col">
                  {filteredBooks.map((book, index) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => setParams({ book: book.id })}
                      className={[
                        "grid grid-cols-[3fr_2fr] items-baseline gap-6 py-2.5 text-left",
                        index === 0 ? "" : "border-t border-border/70",
                      ].join(" ")}
                    >
                      <div className="min-w-0 text-[14px] font-semibold leading-tight text-ink">
                        {book.title}
                      </div>
                      <div className="break-words text-right text-[11px] font-medium uppercase leading-snug tracking-[0.04em] text-muted-foreground">
                        {authorKey(book.author)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={gridClass(params.view)}>
                  {filteredBooks.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => setParams({ book: book.id })}
                      onMouseEnter={() => {
                        setHoveredBookId(book.id);
                      }}
                      onMouseLeave={() => {
                        setHoveredBookId(null);
                      }}
                      onFocus={() => {
                        setHoveredBookId(book.id);
                      }}
                      onBlur={() => {
                        setHoveredBookId(null);
                      }}
                      className={bookCardClass(
                        params.view,
                        hoveredBookId !== null && hoveredBookId !== book.id,
                      )}
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
                          className={imageClass(
                            params.view,
                            hoveredBookId !== null && hoveredBookId !== book.id,
                          )}
                        />
                      </div>
                      <figcaption className={metaClass(params.view)}>
                        <div className="text-[11px] font-semibold leading-tight text-ink">
                          {book.title}
                        </div>
                        <div className="mt-0.5 text-[10px] font-medium uppercase leading-none tracking-[0.04em] text-muted-foreground">
                          {authorKey(book.author)}
                        </div>
                      </figcaption>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <footer className="mx-auto w-full max-w-[1400px] px-4 pb-8 sm:px-6 sm:pb-10">
          <p className="mb-3 max-w-2xl text-[12px] leading-snug text-muted-foreground sm:mb-4">
            an archive of physical books I own, not including art books, photo
            books, or zines
          </p>
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 text-[12px] font-medium leading-snug text-muted-foreground">
            <div className="flex flex-col gap-0.5">
              <span>Last updated {lastUpdated}</span>
              <span>
                Made by{" "}
                <Link
                  href="https://github.com/thebkht"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 hover:text-ink sm:py-0"
                >
                  @thebkht
                </Link>
              </span>
            </div>
            <Link
              href="/admin"
              className="inline-block py-1 text-[11px] uppercase leading-none tracking-[0.04em] hover:text-ink sm:py-0"
            >
              Admin
            </Link>
          </div>
        </footer>
      </main>

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
                  <span className={badgeClass}>
                    Added {formatDate(selectedBook.dateAdded)}
                  </span>
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
                    <p className="mt-2">
                      {normalizeAuthor(selectedBook.author).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function AuthorRail({
  authors,
  selectedAuthor,
  onSelect,
  open,
  onToggle,
}: {
  authors: AuthorCount[];
  selectedAuthor: string | null;
  onSelect: (author: string | null) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-[3px]">
      <button
        type="button"
        className="mb-0.5 flex items-center justify-between gap-3 text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted hover:text-ink"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="flex items-baseline gap-2">
          <span>Authors</span>
          <span className="text-[10px] tabular-nums">({authors.length})</span>
        </span>
        <span className="text-[14px] font-bold leading-none tabular-nums text-ink">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <>
          {authors.map((author) => (
            <button
              key={author.name}
              type="button"
              className={sidebarAuthorClass(selectedAuthor === author.name)}
              onClick={() =>
                onSelect(selectedAuthor === author.name ? null : author.name)
              }
            >
              {author.name}
            </button>
          ))}
        </>
      ) : null}
    </div>
  );
}

function MobileAuthors({
  authors,
  selectedAuthor,
  onSelect,
  open,
  onToggle,
}: {
  authors: AuthorCount[];
  selectedAuthor: string | null;
  onSelect: (author: string | null) => void;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 text-[12px] font-semibold leading-snug">
      <button
        type="button"
        className="flex items-center gap-2 py-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>Authors</span>
        <span className="text-[14px] font-bold leading-none tabular-nums text-ink">
          {open ? "−" : "+"}
        </span>
        <span className="text-[10px] text-muted">({authors.length})</span>
      </button>
      {open ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {authors.map((author) => (
            <button
              key={author.name}
              type="button"
              className={mobileAuthorClass(selectedAuthor === author.name)}
              onClick={() =>
                onSelect(selectedAuthor === author.name ? null : author.name)
              }
            >
              {author.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const badgeClass =
  "rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted";

function navButtonClass(active: boolean) {
  return active
    ? "py-1.5 text-left transition-colors md:py-[2px] text-ink"
    : "py-1.5 text-left transition-colors md:py-[2px] text-muted hover:text-ink";
}

function mobileInlineClass(active: boolean) {
  return active
    ? "py-1.5 text-left transition-colors md:py-[2px] text-ink"
    : "py-1.5 text-left transition-colors md:py-[2px] text-muted hover:text-ink";
}

function authorRowClass(active: boolean) {
  return active
    ? "flex w-full items-center justify-between py-1.5 text-left text-[13px] font-semibold leading-none text-ink md:py-[2px]"
    : "flex w-full items-center justify-between py-1.5 text-left text-[13px] font-semibold leading-none text-muted transition-colors hover:text-ink md:py-[2px]";
}

function sidebarAuthorClass(active: boolean) {
  return active
    ? "text-left transition-colors text-ink"
    : "text-left transition-colors text-muted hover:text-ink";
}

function mobileAuthorClass(active: boolean) {
  return active
    ? "py-1 transition-colors text-ink"
    : "py-1 transition-colors text-muted hover:text-ink";
}

function gridClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "space-y-4";
  }
  if (view === "gallery") {
    return "grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4";
  }
  return "book-grid grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6";
}

function bookCardClass(view: (typeof viewModes)[number], dimmed: boolean) {
  return [
    "group relative flex flex-col items-center text-left transition duration-300",
    dimmed ? "opacity-30 blur-[2px]" : "opacity-100 blur-0",
  ].join(" ");
}

function imageWrapClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "relative aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-md bg-muted";
  }
  if (view === "gallery") {
    return "relative h-44 w-full overflow-hidden sm:h-48 lg:h-56";
  }
  return "relative h-28 w-full overflow-hidden sm:h-32 md:h-36 lg:h-40 xl:h-44";
}

function metaClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "min-w-0";
  }
  if (view === "gallery") {
    return "pointer-events-none absolute inset-x-2 bottom-2 rounded-md bg-paper/92 px-3 py-2 text-center opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100";
  }
  return "pointer-events-none absolute inset-x-1 bottom-1 rounded-md bg-paper/92 px-2 py-2 text-center opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100";
}

function imageClass(view: (typeof viewModes)[number], dimmed: boolean) {
  if (view === "list") {
    return "object-cover";
  }
  return [
    "object-contain object-bottom drop-shadow-[0_6px_14px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out group-hover:scale-[1.03]",
    dimmed ? "saturate-[0.85]" : "saturate-100",
  ].join(" ");
}
