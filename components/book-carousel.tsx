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

export function BookCarousel({ books, ...props }: { books: Book[] } & React.ComponentPropsWithoutRef<typeof Carousel>) {
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
               <div className="flex h-full w-full max-h-full max-w-full items-center justify-center overflow-hidden">
                    <Carousel
                         orientation="vertical"
                         plugins={[autoScrollRef.current]}
                         opts={{
                              align: "start",
                              dragFree: true,
                              loop: true,
                         }}
                         {...props}
                    >
                         <CarouselContent>
                              {books.map((book) => (
                                   <CarouselItem
                                        key={book.id}
                                        className="flex h-full w-full max-h-full max-w-full items-center justify-center gap-6 will-change-transform flex-col"
                                   >
                                        <BookCardV1 book={book} className="w-60" />
                                   </CarouselItem>
                              ))}
                         </CarouselContent>
                    </Carousel>
               </div>
          </>
     );
}
