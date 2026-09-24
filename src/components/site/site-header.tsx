'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Menu, Moon, Sun, LogIn, Search } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const segments = [
  { name: 'School', href: '/school', desc: 'Class 6–10' },
  { name: 'Senior', href: '/senior', desc: 'Class 11–12 + NEET/JEE' },
  { name: 'Coaching', href: '/coaching', desc: 'SSC, RRB, Police...' },
  { name: 'College', href: '/college', desc: 'Degree + Placement' },
  { name: 'ITI', href: '/iti', desc: 'Trades & Vocational' },
  { name: 'Skills', href: '/skills', desc: 'Coding, Excel...' },
  { name: 'GK', href: '/gk', desc: 'Current Affairs' },
  { name: 'Atlas', href: '/atlas', desc: 'Books Solutions' },
  { name: 'Concepts', href: '/concepts', desc: 'Browse all concepts' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg sm:text-xl">Niodemy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {segments.map((seg) => (
            <Link
              key={seg.href}
              href={seg.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname?.startsWith(seg.href) && 'bg-accent text-accent-foreground'
              )}
            >
              {seg.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Search"
          >
            <Link href="/search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/login">
              <LogIn className="mr-1.5 h-4 w-4" />
              Login
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetTitle className="mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Niodemy
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {segments.map((seg) => (
                  <Link
                    key={seg.href}
                    href={seg.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex flex-col rounded-lg px-3 py-2.5 transition-colors hover:bg-accent',
                      pathname?.startsWith(seg.href) && 'bg-accent'
                    )}
                  >
                    <span className="text-sm font-medium">{seg.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {seg.desc}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  <LogIn className="h-4 w-4" />
                  Login / Sign Up
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
