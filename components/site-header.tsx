import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="flex-none h-auto left-1/2 fixed top-0 -translate-x-1/2 z-50 w-full bg-background">
      <div className="flex h-14 w-full justify-center relative items-center border-b border-dashed">
        <div className="flex items-center justify-center flex-[1_0_0] gap-2.5 h-full max-w-[1488px] w-[1px] relative">
          <div className="flex items-center justify-center flex-[1_0_0] h-full max-w-[1440px] relative w-[1px] pl-6">
            <Link
              className="flex flex-none items-center justify-center relative h-min w-min"
              href="/"
            >
              <div className="flex-none h-auto w-auto relative">
                <div className="flex justify-center items-center gap-2 relative w-max h-min">
                  <Icons.logo className="h-6 w-6" />
                  <p className="text-xl font-bold">{siteConfig.name}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center justify-end flex-[1_0_0] gap-2.5 h-full"></div>
          </div>
        </div>
        {/* <MainNav />
                    <MobileNav />
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                         <div className="w-full flex-1 md:w-auto md:flex-none">
                              <CommandMenu />
                         </div>
                         <nav className="flex items-center">
                              <Link
                                   href={siteConfig.links.github}
                                   target="_blank"
                                   rel="noreferrer"
                              >
                                   <div
                                        className={cn(
                                             buttonVariants({
                                                  variant: "ghost",
                                             }),
                                             "w-9 px-0"
                                        )}
                                   >
                                        <Icons.gitHub className="h-4 w-4" />
                                        <span className="sr-only">GitHub</span>
                                   </div>
                              </Link>
                              <Link
                                   href={siteConfig.links.twitter}
                                   target="_blank"
                                   rel="noreferrer"
                              >
                                   <div
                                        className={cn(
                                             buttonVariants({
                                                  variant: "ghost",
                                             }),
                                             "w-9 px-0"
                                        )}
                                   >
                                        <Icons.twitter className="h-3 w-3 fill-current" />
                                        <span className="sr-only">Twitter</span>
                                   </div>
                              </Link>
                              <ModeToggle />
                         </nav>
                    </div> */}
      </div>
    </header>
  );
}
