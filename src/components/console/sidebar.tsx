'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen, FileQuestion, GraduationCap, Users,
  BarChart3, Settings, ScrollText, Layers,
  LayoutDashboard, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface ConsoleSidebarProps {
  counts: {
    content: number
    questions: number
    exams: number
    concepts: number
    users: number
  }
  role: string
  userName: string
}

const navItems = [
  { name: 'Dashboard', href: '/console', icon: LayoutDashboard, showCount: false },
  { name: 'Content', href: '/console/content', icon: BookOpen, countKey: 'content' as const },
  { name: 'Questions', href: '/console/questions', icon: FileQuestion, countKey: 'questions' as const },
  { name: 'Concepts', href: '/console/concepts', icon: Layers, countKey: 'concepts' as const },
  { name: 'Exams', href: '/console/exams', icon: GraduationCap, countKey: 'exams' as const },
  { name: 'Teachers', href: '/console/teachers', icon: ShieldCheck, showCount: false },
  { name: 'Users', href: '/console/users', icon: Users, countKey: 'users' as const },
  { name: 'Analytics', href: '/console/analytics', icon: BarChart3, showCount: false },
  { name: 'Audit Logs', href: '/console/audit', icon: ScrollText, showCount: false },
  { name: 'Settings', href: '/console/settings', icon: Settings, showCount: false },
]

export function ConsoleSidebar({ counts, role, userName }: ConsoleSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        {/* User info */}
        <div className="border-b p-4">
          <p className="text-xs font-medium text-muted-foreground">Signed in as</p>
          <p className="truncate text-sm font-semibold">{userName}</p>
          <Badge
            variant={role === 'admin' ? 'default' : 'secondary'}
            className="mt-1 text-xs capitalize"
          >
            {role}
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
              (item.href !== '/console' && pathname.startsWith(item.href))
            const count = item.countKey ? counts[item.countKey] : null

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {count !== null && count > 0 && (
                  <Badge
                    variant={isActive ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {count}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </div>
    </aside>
  )
}
