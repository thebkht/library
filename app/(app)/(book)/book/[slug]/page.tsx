import { redirect } from "next/navigation";
import { findBookByLegacySlug } from "@/lib/db/books";

export const dynamic = "force-dynamic";

export default async function LegacyBookRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await findBookByLegacySlug(slug);

  if (!book) {
    redirect("/");
  }

  redirect(`/?book=${book.id}`);
}
