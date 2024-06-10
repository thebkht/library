"use client"

import { Book } from "@/lib/types/book";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { AspectRatio } from "./ui/aspect-ratio";

export function BookCardV1({ book, ...props }: { book: Book } & React.ComponentPropsWithoutRef<typeof Card>) {
     return (<>
          <Card {...props}>
               <CardContent className="p-0">
                    <div className="w-full h-auto">
                         {
                              book.cover !== "" ? (
                                   <Image
                                        src={book.cover}
                                        alt={book.title}
                                        layout="responsive"
                                        width={1000}
                                        height={500}
                                        objectPosition="center"
                                   />
                              ) : null
                         }
                         <Skeleton className="h-full w-full" />
                    </div>
                    <CardHeader className="p-5">
                         <CardDescription className="line-clamp-1">{book.author}</CardDescription>
                         <CardTitle className="line-clamp-2 leading-snug">{book.title}</CardTitle>
                    </CardHeader>
               </CardContent>
          </Card>
     </>)
}