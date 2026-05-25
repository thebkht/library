import { createSerializer, parseAsString, parseAsStringLiteral } from "nuqs/server";
import { BOOK_FORMATS } from "@/lib/types/book";

export const viewModes = ["icons", "list", "gallery"] as const;
export const sortModes = ["title", "author", "recent"] as const;

export const archiveSearchParams = {
  genre: parseAsString.withDefault("All"),
  format: parseAsStringLiteral(["All", ...BOOK_FORMATS]).withDefault("All"),
  view: parseAsStringLiteral(viewModes).withDefault("icons"),
  sort: parseAsStringLiteral(sortModes).withDefault("recent"),
  author: parseAsString,
  book: parseAsString,
};

export const serializeArchiveSearchParams = createSerializer(archiveSearchParams);
