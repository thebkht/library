"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Book } from "@/lib/types/book";
import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselNext,
     CarouselPrevious,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { BookCardV1 } from "@/components/book-card-v1";

export function BookCarouselMobile({ books, ...props }: { books: Book[] } & React.ComponentPropsWithoutRef<typeof Carousel>) {
     const autoScrollRef = React.useRef(
          AutoScroll({ playOnInit: true })
     )
     useCallback(() => {
          const autoScroll = autoScrollRef?.current
          if (!autoScroll) return

          const playOrStop = autoScroll.isPlaying()
               ? autoScroll.stop
               : autoScroll.play
          playOrStop()
     }, [autoScrollRef])
     return (
          <>
               <div className="flex h-full w-full max-h-full max-w-full items-center justify-center overflow-hidden md:hidden">
                    <Carousel
                         plugins={[autoScrollRef.current]}
                         opts={{
                              align: "start",
                              dragFree: true,
                              loop: true,
                         }}
                         {...props}
                    >
                         <CarouselContent className="-ml-8 -mr-8">
                              {books.map((book) => (
                                   <CarouselItem
                                        key={book.id}
                                        className="pl-4 basis-80"
                                   >
                                        <BookCardV1 book={book} className="w-full" />
                                   </CarouselItem>
                              ))}
                         </CarouselContent>
                    </Carousel>
               </div>
          </>
     );
}
