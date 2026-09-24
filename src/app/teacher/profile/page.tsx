import { ProfileEditor } from '@/components/teacher/profile-editor'
import { getAuthUser } from '@/lib/console/rbac'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'My Profile — Teacher' }

export default async function TeacherProfilePage() {
  const user = await getAuthUser()
  const supabase = await createClient()

  const { data: teacherProfile } = await supabase
    .from('teacher_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Teacher Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your expertise, bio, segments, and availability.
        </p>
      </div>

      <ProfileEditor
        userId={user!.id}
        initialProfile={teacherProfile}
        fullName={user!.full_name || user!.email}
      />
    </div>
  )
}
