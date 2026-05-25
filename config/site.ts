export const siteConfig = {
  name: "bkht.library",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://bkht.library",
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bkht.library"}/og.png`,
  description:
    "A public archive of books I own, arranged as a quiet serif library with admin-managed records.",
  footerTagline: "A personal archive of books I own and keep returning to.",
  credit: {
    label: "Made by bkht",
    href: "https://github.com/thebkht",
  },
  links: {
    twitter: "https://twitter.com/thebkht",
    github: "https://github.com/thebkht/library",
  },
};

export type SiteConfig = typeof siteConfig;
