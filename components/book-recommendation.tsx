"use client"
import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselNext,
     CarouselPrevious,
} from "@/components/ui/carousel"
import { BookCardV1 } from "@/components/book-card-v1"
import { books } from "@/data/book"

export function BookRecommendation() {
     return (
          <div className="w-full mt-5">
               <Carousel opts={{
                    align: "start",
               }} className="xl:max-w-6xl lg:max-w-3xl md:max-w-xl w-full mx-auto">

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
               </Carousel>

          </div>
     )
}