'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, GraduationCap, MessageSquare, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/concepts', label: 'Browse', icon: GraduationCap },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/my/chat', label: 'AI Tutor', icon: MessageSquare },
  { href: '/my', label: 'Profile', icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-background/95 backdrop-blur-md lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href ||
          (item.href !== '/' && pathname?.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
