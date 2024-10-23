"use client"

import { books } from "@/data/book"
import { BookCardV2 } from "./book-card-v2"

export function BookRecommendation() {
     return (
          <div className="w-full mt-5 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-6">
               {
                    books.map((book) => (
                         <BookCardV2 book={book} className="hover:bg-secondary outline-offset-0 h-full" key={book.id} />
                    ))
               }
               {/* <Carousel opts={{
                    align: "start",
               }} className="xl:max-w-7xl lg:max-w-4xl md:max-w-xl w-full mx-auto">

                    <CarouselContent className="lg:-ml-5 -ml-2 flex">
                         {
                              books.map((book) => (
                                   <CarouselItem className="xl:basis-1/5 lg:basis-1/4 md:basis-1/3 lg:pl-5 pl-2 self-stretch" key={book.id}>
                                        <BookCardV1 book={book} className="hover:bg-secondary outline-offset-0 h-full" />
                                   </CarouselItem>
                              ))
                         }
                    </CarouselContent>
                    <CarouselPrevious className="h-10 w-10 rounded-none hover:bg-secondary disabled:opacity-0" />
                    <CarouselNext className="h-10 w-10 rounded-none hover:bg-secondary disabled:opacity-0" />
               </Carousel> */}

          </div>
     )
}