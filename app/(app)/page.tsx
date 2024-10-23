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
import { BookCarousel } from "@/components/book-carousel"
import { BookCarouselMobile } from "@/components/book-carousel-mobile"


export default function IndexPage() {
  const first = books.slice(0, 4)
  const second = books.slice(4, 8)
  const third = books.slice(9, 13)

  return (
    <div className="container relative mx-auto w-full sm:p-0">
      <div className="flex items-start flex-none md:flex-row flex-col flex-nowrap h-auto justify-center w-full max-w-[1440px]">
        <div className="flex flex-col items-start md:flex-[1_0_0px] flex-nowrap gap-12 md:gap-16 h-[calc(100vh-3.5rem)] justify-center p-6 md:w-4 md:pr-24 pt-32 sm:pb-16">
          <div className="flex flex-col items-start flex-none flex-nowrap gap-12 h-min justify-center p-0 w-full">
            <div className="flex flex-col items-start flex-none flex-nowrap gap-6 h-min justify-center p-0 w-full">
              <div className="flex justify-start transform-none outline-none flex-col shrink-0">
                <h1 className="font-bold lg:text-6xl md:text-5xl text-3xl md:text-left text-center">
                  a personal library of books, articles, and other resources that I&apos;ve found useful.
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-none items-center flex-nowrap flex-row gap-2 h-min w-full md:justify-start justify-center">
            <Link href="/browse" className={cn(buttonVariants())}>
              Browse
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
        <div className="flex flex-nowrap items-center md:flex-[0.7_0_0px] flex-row gap-3 md:h-[calc(100vh-3.5rem)] justify-center md:sticky top-0 z-10 will-change-transform md:w-4 w-full md:m-0 -mx-8">
          <BookCarouselMobile books={books} />
          <div className="flex items-center justify-center flex-col flex-nowrap flex-[1_0_0px] gap-2 overflow-hidden w-4 h-full pt-14">
            <div className="flex-[1_0_0px] w-full h-4 relative">
              <div className="contents">
                <BookCarousel books={first} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center flex-col flex-nowrap flex-[1_0_0px] gap-2 pt-6 overflow-hidden w-4 h-full">
            <div className="flex-[1_0_0px] w-full h-4 relative">
              <div className="contents">
                <BookCarousel books={second} opts={{
                  align: "end",
                  dragFree: true,
                  loop: true,
                }} />
              </div>
            </div>
          </div>
          <div className="xl:flex items-center justify-center flex-col flex-nowrap flex-[1_0_0px] gap-2 pt-14 overflow-hidden w-4 h-full hidden">
            <div className="flex-[1_0_0px] w-full h-4 relative">
              <div className="contents">
                <BookCarousel books={third} opts={{
                  align: "end",
                  dragFree: true,
                  loop: true,
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
