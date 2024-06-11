import { siteConfig } from "@/config/site"
import Link from "next/link"
import { Icons } from "./icons"
import { ModeToggle } from "./mode-toggle"

export function SiteFooter() {
     return (
          <div className="fixed bottom-0 flex-none h-auto z-50 left-0 right-0">
               <footer className="flex flex-col justify-center items-center h-min relative w-full gap-2.5 border-t border-border border-dashed bg-background">
                    <div className="flex items-center justify-between max-w-[1440px] h-14 p-6 relative w-full z-20 border-x border-dashed border-border">
                         <div className="flex flex-none items-center justify-center gap-6 relative h-min w-max">
                              <Link target="_blank" href="https://bkhtdev.com" className="flex items-center text-muted-foreground hover:text-foreground">
                                   portfolio
                              </Link>
                              <Link target="_blank" href="https://github.com/thebkht" className="flex items-center text-muted-foreground hover:text-foreground">
                                   github
                              </Link>
                              <Link target="_blank" href="https://twitter.com/thebkht" className="flex items-center text-muted-foreground hover:text-foreground">
                                   x (twitter)
                              </Link>
                         </div>
                         <div className="-mr-6">
                              <ModeToggle />
                         </div>
                    </div>
                    {/* <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                         <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                              Built by{" "}
                              <a
                                   href={siteConfig.links.twitter}
                                   target="_blank"
                                   rel="noreferrer"
                                   className="font-medium underline underline-offset-4"
                              >
                                   bkhtdev
                              </a>
                              . The source code is available on{" "}
                              <a
                                   href={siteConfig.links.github}
                                   target="_blank"
                                   rel="noreferrer"
                                   className="font-medium underline underline-offset-4"
                              >
                                   GitHub
                              </a>
                              .
                         </p>
                    </div> */}
               </footer>
          </div>
     )
}
