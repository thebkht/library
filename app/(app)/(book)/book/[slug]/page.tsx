import { BookRecommendation } from "@/components/book-recommendation";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { getBookBySlug } from "@/lib/books";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { title } from "process";

type Props = {
     params: {
          slug: string;
     };
     searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
     { params }: Props
): Promise<Metadata> {
     const book = getBookBySlug(params.slug);
     if (!book) {
          return {
               title: "Book not found",
               description: "The book you are looking for does not exist.",
          };
     }
     return {
          title: book.title,
          description: book.description,
          openGraph: {
               title: book.title,
               description: book.description,
               type: "book",
               url: `${siteConfig.url}/book/${book.slug}`,
               images: [{ url: book.cover }],
               authors: [book.author],
               isbn: book.isbn,
               releaseDate: book.publishedDate,
          },
          twitter: {
               card: "summary",
               site: siteConfig.links.twitter,
          },
     }
}

export default function Book({
     params,
     searchParams,
}: Props) {
     const book = getBookBySlug(params.slug);

     if (!book) {
          return notFound();
     }

     return (
          <div className="flex flex-[1_1_1px] min-w-0 md:p-5 p-4 flex-col justify-center items-center my-16">
               <div className="grid flex-[1_1_1px] grid-cols-12 mb-10 gap-[2%] min-w-0 max-w-screen-sm md:max-w-7xl relative w-full">
                    <div className="col-span-3">
                         <div className="sticky top-0 z-10">
                              <div className="w-11/12 mx-auto">
                                   <div className="flex min-h-5 mb-5 mx-auto">
                                        <div className="inline-block">
                                             <div className="relative">
                                                  {
                                                       book.cover ? (
                                                            <Image
                                                                 src={book.cover}
                                                                 alt={book.title}
                                                                 fill
                                                                 className="w-full h-auto mx-auto !relative"
                                                            />
                                                       ) : (
                                                            <Skeleton className="w-full aspect-[2/3] h-[416px] mx-auto" />
                                                       )
                                                  }
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <div className="flex flex-col my-4 gap-2">
                                   <Button disabled>
                                        borrow
                                   </Button>
                              </div>
                         </div>
                    </div>
                    <div className="col-span-9 relative overflow-hidden ml-8">
                         <div className="hidden">
                              <div className="w-full mx-auto">
                                   <div className="flex min-h-5 mb-3">
                                        <div className="inline-block">
                                             <div className="relative">
                                                  {
                                                       book.cover ? (
                                                            <Image
                                                                 src={book.cover}
                                                                 alt={book.title}
                                                                 fill
                                                                 className="w-full h-auto mx-auto"
                                                            />
                                                       ) : (
                                                            <Skeleton className="w-full aspect-[2/3] h-[416px] mx-auto" />
                                                       )
                                                  }
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                         <div>
                              <div className="flex justify-between items-start">
                                   <div>
                                        <h1 className="text-3xl font-bold">{book.title}</h1>
                                   </div>
                                   {/* <Button variant={"ghost"} size={"icon"}>
                                        <Icons.share className="h-5 w-5" />
                                   </Button> */}
                              </div>
                              <div className="my-3">
                                   <h3 className="font-normal text-lg">
                                        {book.author}
                                   </h3>
                              </div>
                              <div className="my-2">
                                   <div className="relative">
                                        <div className="max-h-none overflow-y-visible break-words overflow-hidden">
                                             <div className="grid gap-[2%] grid-cols-9 -ml-8 pl-8">
                                                  <div className="col-span-8">
                                                       <p className="text-base">
                                                            {book.description}
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
