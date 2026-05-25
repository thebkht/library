import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.VERCEL_DEPLOY_HOOK_URL) {
    return NextResponse.json(
      { error: "Deploy hook is not configured." },
      { status: 400 }
    );
  }

  const response = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
    method: "POST",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Deploy hook failed." },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true });
}
