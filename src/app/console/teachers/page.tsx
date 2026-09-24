import { ShieldCheck, Plus } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Teachers — Console' }

export default async function TeachersPage() {
  const supabase = await createClient()
  const { data: teachers } = await supabase
    .from('teacher_profiles')
    .select(`
      user_id, expertise, segments, bio, is_active,
      profiles!inner(email, full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage teacher profiles. Teachers use the Teacher Dashboard (/teacher), not this Console.
          </p>
        </div>
        <Button asChild>
          <Link href="/console/teachers/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Teacher
          </Link>
        </Button>
      </div>

      {teachers && teachers.length > 0 ? (
        <div className="space-y-2">
          {teachers.map((t: any) => (
            <Card key={t.user_id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">{t.profiles?.full_name || t.profiles?.email}</p>
                  <p className="text-xs text-muted-foreground">{t.profiles?.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {t.expertise?.map((s: string) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
                {t.segments?.map((s: string) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))}
                <Badge variant={t.is_active ? 'default' : 'secondary'} className="text-xs">
                  {t.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-base font-semibold">No teachers yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add teacher profiles. They&apos;ll use /teacher dashboard for their work.
          </p>
        </Card>
      )}
    </div>
  )
}
