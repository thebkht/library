"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useQueryStates } from "nuqs";
import { formatDate } from "@/lib/date";
import {
  archiveSearchParams,
  sortModes,
  viewModes,
} from "@/lib/archive/search-params";
import {
  BOOK_FORMATS,
  authorKey,
  genreKey,
  normalizeGenres,
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
  const [authorsOpen, setAuthorsOpen] = useState(false);
  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const genreOptions = useMemo(
    () =>
      Array.from(
        new Set(books.flatMap((book) => normalizeGenres(book.genre))),
      ).sort((a, b) => a.localeCompare(b)),
    [books],
  );

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
        params.genre === "All"
          ? true
          : normalizeGenres(book.genre).includes(params.genre),
      )
      .filter((book) =>
        params.format === "All" ? true : book.format === params.format,
      )
      .filter((book) =>
        params.author
          ? normalizeAuthor(book.author).includes(params.author)
          : true,
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
  const galleryIndex = Math.max(
    0,
    filteredBooks.findIndex((book) => book.id === hoveredBookId),
  );

  useEffect(() => {
    if (
      params.view !== "gallery" ||
      hoveredBookId ||
      filteredBooks.length === 0
    ) {
      return;
    }

    setHoveredBookId(filteredBooks[0]?.id ?? null);
  }, [filteredBooks, hoveredBookId, params.view]);

  function scrollGalleryTo(index: number) {
    const viewport = galleryViewportRef.current;
    if (!viewport) {
      return;
    }

    const nextIndex = Math.max(0, Math.min(index, filteredBooks.length - 1));
    const child = viewport.children.item(nextIndex) as HTMLElement | null;

    if (!child) {
      return;
    }

    child.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    setHoveredBookId(filteredBooks[nextIndex]?.id ?? null);
  }

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
                {(["All", ...genreOptions] as const).map((genre) => (
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
                  {(["All", ...genreOptions] as const).map((genre) => (
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
                      <div className="wrap-break-words text-right text-[11px] font-medium uppercase leading-snug tracking-[0.04em] text-muted-foreground">
                        {authorKey(book.author)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : params.view === "icons" ? (
                <div className={gridClass(params.view)}>
                  {filteredBooks.map((book) => (
                    <figure
                      key={book.id}
                      className={bookCardClass(params.view, false)}
                    >
                      <button
                        type="button"
                        onClick={() => setParams({ book: book.id })}
                        className="flex w-full flex-col items-center"
                      >
                        <div className={imageWrapClass(params.view)}>
                          <Image
                            src={book.image}
                            alt={book.title}
                            width={400}
                            height={600}
                            sizes="(max-width: 1024px) 33vw, 18vw"
                            className={imageClass(params.view, false)}
                          />
                        </div>
                        <figcaption className={metaClass(params.view)}>
                          <div className="text-[11px] font-semibold leading-tight text-ink">
                            {book.title}
                          </div>
                          <div className="mt-0.5 text-[10px] font-medium uppercase leading-none tracking-[0.04em] text-muted">
                            {authorKey(book.author)}
                          </div>
                        </figcaption>
                      </button>
                    </figure>
                  ))}
                </div>
              ) : params.view === "gallery" ? (
                <div className="flex flex-col gap-6">
                  <div
                    ref={galleryViewportRef}
                    className="-mx-4 flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 sm:-mx-6 sm:px-6"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {filteredBooks.map((book, index) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => {
                          setHoveredBookId(book.id);
                          setParams({ book: book.id });
                        }}
                        onFocus={() => setHoveredBookId(book.id)}
                        className="flex w-full shrink-0 snap-center flex-col items-center justify-end gap-5 pb-2"
                        aria-label={`Open ${book.title}`}
                      >
                        <div className="flex h-[55vh] max-h-[520px] w-full items-end justify-center px-4">
                          <Image
                            src={book.image}
                            alt={book.title}
                            width={600}
                            height={900}
                            priority={index === 0}
                            sizes="100vw"
                            className="h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                          />
                        </div>
                        <div className="px-4 text-center">
                          <div className="text-[15px] font-semibold leading-tight text-ink">
                            {book.title}
                          </div>
                          <div className="mt-1 text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted">
                            {authorKey(book.author)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 text-[11px] font-medium uppercase leading-none tracking-[0.04em] text-muted">
                    <button
                      type="button"
                      disabled={galleryIndex <= 0}
                      className="hover:text-ink disabled:opacity-30"
                      aria-label="Previous book"
                      onClick={() => scrollGalleryTo(galleryIndex - 1)}
                    >
                      ← Prev
                    </button>
                    <span className="tabular-nums text-muted">
                      {filteredBooks.length === 0
                        ? "0 / 0"
                        : `${galleryIndex + 1} / ${filteredBooks.length}`}
                    </span>
                    <button
                      type="button"
                      disabled={
                        filteredBooks.length === 0 ||
                        galleryIndex >= filteredBooks.length - 1
                      }
                      className="hover:text-ink disabled:opacity-30"
                      aria-label="Next book"
                      onClick={() => scrollGalleryTo(galleryIndex + 1)}
                    >
                      Next →
                    </button>
                  </div>
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
              <div className="relative aspect-2/3 overflow-hidden rounded-md bg-muted">
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
                  <span className={badgeClass}>
                    {genreKey(selectedBook.genre)}
                  </span>
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
  return "book-grid grid grid-cols-3 gap-x-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6";
}

function bookCardClass(view: (typeof viewModes)[number], dimmed: boolean) {
  if (view === "icons") {
    return "group relative flex flex-col items-center";
  }
  return [
    "group relative flex flex-col items-center text-left transition duration-300",
    dimmed ? "opacity-30 blur-[2px]" : "opacity-100 blur-0",
  ].join(" ");
}

function imageWrapClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "relative aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-md bg-muted";
  }
  return "flex h-28 w-full items-end justify-center sm:h-32 md:h-36 lg:h-40 xl:h-44";
}

function metaClass(view: (typeof viewModes)[number]) {
  if (view === "list") {
    return "min-w-0";
  }
  return "book-caption";
}

function imageClass(view: (typeof viewModes)[number], dimmed: boolean) {
  if (view === "list") {
    return "object-cover";
  }
  if (view === "icons") {
    return "h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_6px_14px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out group-hover:scale-[1.03]";
  }
  return [
    "object-contain object-bottom drop-shadow-[0_6px_14px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out group-hover:scale-[1.03]",
    dimmed ? "saturate-[0.85]" : "saturate-100",
  ].join(" ");
}
