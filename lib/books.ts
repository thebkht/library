import { books } from "@/data/book";

export const getAllBooks = () => {
  return books;
};

export const getBookBySlug = (slug: string) => {
  return books.find((book) => book.slug === slug);
};

export const getBookById = (id: string) => {
  return books.find((book) => book.id === id);
};

export const getBookByAuthor = (author: string) => {
  return books.filter((book) => book.author === author);
};

export const getBookByTitle = (title: string) => {
  return books.filter((book) => book.title === title);
};
