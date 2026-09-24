import { ScrollText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Audit Logs — Console' }

export default async function AuditPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('audit_logs')
    .select(`
      id, user_id, action, entity_type, entity_id, changes_json, created_at,
      profiles!inner(email, full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  const actionVariant = (action: string) => {
    switch (action) {
      case 'create': return 'default' as const
      case 'publish': return 'default' as const
      case 'update': return 'secondary' as const
      case 'delete': return 'outline' as const
      default: return 'secondary' as const
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track all admin/content changes.
        </p>
      </div>

      {logs && logs.length > 0 ? (
        <div className="space-y-2">
          {logs.map((log: any) => (
            <Card key={log.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <Badge variant={actionVariant(log.action)} className="text-xs capitalize">
                  {log.action}
                </Badge>
                <div>
                  <p className="text-sm font-medium">
                    <span className="capitalize">{log.entity_type}</span>: {log.entity_id?.substring(0, 8)}...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {log.profiles?.full_name || log.profiles?.email}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <ScrollText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No audit logs yet.</p>
        </Card>
      )}
    </div>
  )
}
