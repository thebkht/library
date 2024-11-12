"use client";

import { books } from "@/data/book";
import { BookCardV2 } from "./book-card-v2";

export function BookRecommendation() {
  return (
    <div className="w-full mt-5 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCardV2
          book={book}
          className="hover:bg-secondary outline-offset-0 h-full"
          key={book.id}
        />
      ))}
    </div>
  );
}
