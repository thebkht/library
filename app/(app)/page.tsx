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
import { books } from "@/data/book"
import { BookCardV1 } from "@/components/book-card-v1"


export default function IndexPage() {
  const first = books.slice(0, books.length / 3)
  const second = books.slice(books.length / 3, books.length / 3 * 2)

  return (
    <div className="container relative">
      <div className="flex items-start flex-none flex-row flex-nowrap h-auto justify-center w-full max-w-[1440px]">
        <div className="flex flex-col items-start flex-[1_0_0px] flex-nowrap gap-16 h-screen justify-center p-6 w-4 pr-24">
          <div className="flex flex-col items-start flex-none flex-nowrap gap-12 h-min justify-center p-0 w-full">
            <div className="flex flex-col items-start flex-none flex-nowrap gap-6 h-min justify-center p-0 w-full">
              <div className="flex justify-start transform-none outline-none flex-col shrink-0">
                <h1 className="font-bold text-7xl">
                  a personal library of books, articles, and other resources that I&apos;ve found useful.
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-none items-center flex-nowrap flex-row gap-2 h-min w-full justify-start">
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
          </div>
        </div>
        <div className="flex flex-nowrap items-center flex-[0.7_0_0px] flex-row gap-2 h-screen justify-center sticky top-0 z-10 will-change-transform w-4">
          <div className="flex items-center justify-center flex-col flex-nowrap flex-[1_0_0px] gap-2 overflow-hidden w-4 h-full">
            <div className="flex-[1_0_0px] w-full h-4 relative">
              <div className="contents">
                <div className="flex h-full w-full max-h-full max-w-full items-center justify-center overflow-hidden">
                  <ul className="flex h-full w-full max-h-full max-w-full items-center justify-center gap-2 will-change-transform flex-col">
                    {
                      first.map((book) => (
                        <li key={book.id} className="contents">
                          <BookCardV1 book={book} className="w-60" />
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center flex-col flex-nowrap flex-[1_0_0px] gap-2 pt-14 overflow-hidden w-4 h-full">
            <div className="flex-[1_0_0px] w-full h-4 relative">
              <div className="contents">
                <div className="flex h-full w-full max-h-full max-w-full items-center justify-center overflow-hidden">
                  <ul className="flex h-full w-full max-h-full max-w-full items-center justify-center gap-2 will-change-transform flex-col">
                    {
                      second.map((book) => (
                        <li key={book.id} className="contents">
                          <BookCardV1 book={book} className="w-60" />
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center justify-center flex-col flex-nowrap flex-[1_0_0px] gap-2 pt-14 overflow-hidden w-4 h-full">
            <div className="flex-[1_0_0px] w-full h-4 relative">
              <div className="contents">
                <div className="flex h-full w-full max-h-full max-w-full items-center justify-center overflow-hidden">
                  <ul className="flex h-full w-full max-h-full max-w-full items-center justify-center gap-2 will-change-transform flex-col">
                    {
                      thirdbooks.map((book) => (
                        <li key={book.id} className="contents">
                          <BookCardV1 book={book} className="w-60" />
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}