import { createPool } from "@vercel/postgres";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const database = process.env.POSTGRES_URL
  ? createPool({
      connectionString: process.env.POSTGRES_URL,
    })
  : ({
      query() {
        throw new Error("POSTGRES_URL is required.");
      },
      connect() {
        throw new Error("POSTGRES_URL is required.");
      },
      end() {
        return Promise.resolve();
      },
    } as unknown as ReturnType<typeof createPool>);

export const auth = betterAuth({
  database,
  plugins: [nextCookies()],
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET || "development-only-secret-for-build",
  emailAndPassword: {
    enabled: true,
    disableSignUp: process.env.ALLOW_BOOTSTRAP_SIGNUP === "true" ? false : true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
    storage: process.env.NODE_ENV === "production" ? "database" : "memory",
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 5,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
