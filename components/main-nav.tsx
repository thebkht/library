"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"

export function MainNav() {
     const pathname = usePathname()

     return (
          <div className="mr-4 hidden md:flex">
               <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Icons.logo className="h-6 w-6" />
                    <span className="hidden font-bold sm:inline-block">
                         {siteConfig.name}
                    </span>
               </Link>
               <nav className="flex items-center gap-4 text-sm lg:gap-6">
                    <Link
                         href="/browse"
                         className={cn(
                              "transition-colors hover:text-foreground/80",
                              pathname === "/browse" ? "text-foreground" : "text-foreground/60"
                         )}
                    >
                         Browse
                    </Link>
                    <Link
                         href="/categories"
                         className={cn(
                              "transition-colors hover:text-foreground/80",
                              pathname?.startsWith("/categories")
                                   ? "text-foreground"
                                   : "text-foreground/60"
                         )}
                    >
                         Categories
                    </Link>
                    <Link
                         href={siteConfig.links.github}
                         className={cn(
                              "hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block"
                         )}
                    >
                         GitHub
                    </Link>
               </nav>
          </div>
     )
}