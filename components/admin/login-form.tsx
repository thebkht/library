"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");

        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: callbackUrl,
        });

        if (result.error) {
          setError(result.error.message || "Sign in failed.");
          setPending(false);
          return;
        }

        router.push(callbackUrl);
        router.refresh();
      }}
    >
      <label className="block space-y-2">
        <span className="text-sm text-muted-foreground">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-foreground"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm text-muted-foreground">Password</span>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none transition focus:border-foreground"
        />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-foreground px-5 py-3 text-sm text-background disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
