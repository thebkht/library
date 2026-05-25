import { del, put } from "@vercel/blob";
import sharp from "sharp";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadBookImage(file: File, id: string) {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const output = await sharp(Buffer.from(arrayBuffer))
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  const blob = await put(`books/${id}.jpg`, output, {
    access: "public",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: "image/jpeg",
  });

  return blob.url;
}

export async function removeBookImage(url?: string | null) {
  if (!url || !url.includes(".public.blob.vercel-storage.com")) {
    return;
  }

  await del(url, {
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
