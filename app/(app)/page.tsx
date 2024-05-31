import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button"
import { BookRecommendation } from "@/components/book-recommendation"

export default function IndexPage() {
  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>
          {siteConfig.name}
        </PageHeaderHeading>
        <PageHeaderDescription>
          A personal library of books, articles, and other resources that I&apos;ve found useful.
        </PageHeaderDescription>
        <PageActions>
          <Link href="/browse" className={cn(buttonVariants())}>
            Get Started
          </Link>
          <Link
            target="_blank"
            rel="noreferrer"
            href={siteConfig.links.github}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </PageActions>
      </PageHeader>
      <div className="container relative px-5 flex-1 flex flex-col">
        <div className="flex justify-center"></div>
        <BookRecommendation />
      </div>
    </div>
  )
}