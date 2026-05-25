import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { EB_Garamond, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const fontSerif = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  authors: [
    {
      name: "bkht",
      url: siteConfig.credit.href,
    },
  ],
  creator: "bkht",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@thebkht",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ec" },
    { media: "(prefers-color-scheme: dark)", color: "#f7f3ec" },
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={cn(fontSerif.variable, fontDisplay.variable)}>
      <body
        className="min-h-screen bg-paper font-sans text-ink antialiased"
      >
        <NuqsAdapter>
          <div className="relative flex min-h-screen flex-col bg-paper">
            {children}
          </div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
