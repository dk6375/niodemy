import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/my')
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Free forever. Browse content without login too.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-center text-sm text-muted-foreground">
            Signup UI will be built in Session 1b.
            <br />
            Supabase Auth is configured and ready.
          </p>
        </div>
      </div>
    </div>
  )
}
