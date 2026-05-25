import { sql } from "@vercel/postgres";

process.env.ALLOW_BOOTSTRAP_SIGNUP = "true";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "bkht";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }

  const { auth } = await import("../lib/auth");
  const { rows } = await sql<{ id: string }>`
    SELECT id
    FROM "user"
    WHERE email = ${email}
    LIMIT 1
  `;

  if (rows[0]) {
    console.log(`Admin user already exists for ${email}.`);
    return;
  }

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (!result?.user) {
    throw new Error("Admin signup failed.");
  }

  console.log(`Seeded admin user ${email}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
