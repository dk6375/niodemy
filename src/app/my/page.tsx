import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Target, BookOpen, TrendingUp, Bookmark, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function MyDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const stats = [
    { label: 'Active Goals', value: '0', icon: Target },
    { label: 'Concepts Mastered', value: '0', icon: BookOpen },
    { label: 'Avg Mastery', value: '0%', icon: TrendingUp },
    { label: 'Bookmarks', value: '0', icon: Bookmark },
  ]

  const quickLinks = [
    { label: 'My Goals', href: '/my/goals', icon: Target, desc: 'Manage your learning goals' },
    { label: 'My Path', href: '/my/path', icon: BookOpen, desc: 'Current combined course' },
    { label: 'AI Tutor', href: '/my/chat', icon: MessageSquare, desc: 'Ask your personal AI tutor' },
    { label: 'Bookmarks', href: '/my/bookmarks', icon: Bookmark, desc: 'Saved content' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your learning journey, all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Quick Links */}
      <h2 className="mb-4 mt-8 text-lg font-semibold">Quick Access</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} href={link.href}>
              <Card className="h-full p-4 transition-all hover:shadow-md">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">{link.label}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Empty State */}
      <Card className="mt-8 p-8 text-center">
        <LayoutDashboard className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-base font-semibold">Start your learning journey</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          You haven&apos;t enrolled in any goals yet. Browse segments and enroll
          to get a combined course & personalized plan.
        </p>
        <Button asChild className="mt-4">
          <Link href="/coaching">Browse Segments</Link>
        </Button>
      </Card>
    </div>
  )
}
