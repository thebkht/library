"use client"

import { Book } from "@/lib/types/book";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { AspectRatio } from "./ui/aspect-ratio";
import Link from "next/link";

export function BookCardV2({ book, ...props }: { book: Book } & React.ComponentPropsWithoutRef<typeof Card>) {
     return (<>
          <Card {...props}>
               <CardContent className="p-0">
                    <Link href={`/book/${book.slug}`}>
                         <AspectRatio ratio={3 / 4} style={{ position: "relative" }}>
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
                    </Link>
                    <CardHeader className="p-5 border-t border-dashed">
                         <CardDescription className="line-clamp-1">{book.author}</CardDescription>
                         <Link href={`/book/${book.slug}`}>
                              <CardTitle className="line-clamp-2 leading-snug">{book.title}</CardTitle>
                         </Link>
                    </CardHeader>
               </CardContent>
          </Card>
     </>)
}