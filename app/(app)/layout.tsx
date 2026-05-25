import type { ReactNode } from "react";

interface AppLayoutProps {
     children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
     return <main className="flex-1">{children}</main>
}
