// pages/admin.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      // Check if user is an admin in the DB
      const { data, error: queryError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', user.email)
        .single()

      if (queryError || !data?.is_admin) {
        router.push('/') // redirect non-admin users home
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkAdmin()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-lg font-semibold">Verifying access...</h2>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🛠 Admin Dashboard</h1>
      <p className="text-gray-700 mb-6">
        Welcome, <strong>{user?.email}</strong> — you have full admin access.
      </p>

      <div className="grid gap-4">
        <a
          href="/admin/wishes"
          className="block p-4 border rounded-md hover:bg-gray-100 transition"
        >
          📜 Manage Wishes
        </a>

        <a
          href="/admin/users"
          className="block p-4 border rounded-md hover:bg-gray-100 transition"
        >
          👥 View Users
        </a>
      </div>
    </div>
  )
}
