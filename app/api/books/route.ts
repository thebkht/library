import { NextResponse } from "next/server";
import { listBooks } from "@/lib/db/books";

export async function GET() {
  const books = await listBooks();
  return NextResponse.json(books);
}
