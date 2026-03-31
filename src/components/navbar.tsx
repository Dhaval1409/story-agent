
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trophy, Activity, BrainCircuit } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()

    const routes = [
        {
            href: "/",
            label: "Home",
            icon: Trophy,
            active: pathname === "/",
        },
        {
            href: "/#live",
            label: "Live Scores",
            icon: Activity,
            active: false,
        },
        {
            href: "/#upcoming",
            label: "Predictions",
            icon: BrainCircuit,
            active: false,
        },
    ]

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="bg-primary text-primary-foreground p-1 rounded">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <span>MatchCore</span>
                </Link>

                <div className="flex items-center gap-4">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                                route.active ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            <route.icon className="h-4 w-4" />
                            <span className="hidden md:inline">{route.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">Sign In</Button>
                    <Button size="sm">Get Pro</Button>
                </div>
            </div>
        </nav>
    )
}
