import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { parseBookFormData } from "@/lib/admin/book-form-data";
import { createBook, listBooks, updateBook } from "@/lib/db/books";
import { uploadBookImage } from "@/lib/images/upload";

async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function GET() {
  const unauthorized = await requireSession();
  if (unauthorized) {
    return unauthorized;
  }

  const books = await listBooks();
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const unauthorized = await requireSession();
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const formData = await request.formData();
    const { input, file } = await parseBookFormData(formData);
    const created = await createBook(input);

    if (file) {
      const image = await uploadBookImage(file, created.id);
      const updated = await updateBook(created.id, { ...input, image });
      revalidatePath("/");
      revalidatePath("/admin");
      return NextResponse.json(updated, { status: 201 });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create book.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
