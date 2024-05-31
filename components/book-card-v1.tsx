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
                    <AspectRatio ratio={4 / 5} style={{ position: "relative" }}>
                         {
                              book.cover !== "" ? (
                                   <Image
                                        src={book.cover}
                                        alt={book.title}
                                        layout="fill"
                                        objectFit="cover"
                                        objectPosition="center"
                                   />
                              ) : null
                         }
                         <Skeleton className="h-full w-full" />
                    </AspectRatio>
                    <CardHeader className="p-5">
                         <CardDescription>{book.author}</CardDescription>
                         <CardTitle className="line-clamp-2 leading-snug">{book.title}</CardTitle>
                    </CardHeader>
               </CardContent>
          </Card>
     </>)
}