import { Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Users — Console' }

export default async function UsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const roleVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default' as const
      case 'content_writer': return 'secondary' as const
      case 'teacher': return 'secondary' as const
      default: return 'outline' as const
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage platform users.
        </p>
      </div>

      {users && users.length > 0 ? (
        <div className="space-y-2">
          {users.map((u: any) => (
            <Card key={u.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">{u.full_name || u.email}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={roleVariant(u.role)} className="text-xs capitalize">
                  {u.role}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Joined {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No users yet.</p>
        </Card>
      )}
    </div>
  )
}
