import { Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'Settings — Console' }

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform configuration. (Coming soon.)
        </p>
      </div>

      <Card className="p-8 text-center">
        <Settings className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="text-base font-semibold">Settings Coming Soon</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          SEO settings, feature flags, platform config.
        </p>
      </Card>
    </div>
  )
}
