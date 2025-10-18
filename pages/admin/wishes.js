// pages/admin/wishes.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function WishesModeration() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [wishes, setWishes] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function verifyAndFetch() {
      // 1️⃣ Check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 2️⃣ Check admin permission
      const { data: admin } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', user.email)
        .single()

      if (!admin?.is_admin) {
        router.push('/')
        return
      }

      // 3️⃣ Fetch pending wishes
      const { data: wishesData, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) setError(error.message)
      else setWishes(wishesData)

      setLoading(false)
    }

    verifyAndFetch()
  }, [router])

  async function handleAction(id, status) {
    const { error } = await supabase
      .from('wishes')
      .update({ status })
      .eq('id', id)

    if (error) {
      alert('❌ Error: ' + error.message)
    } else {
      alert(`✅ Wish ${status} successfully`)
      setWishes(wishes.map(w => (w.id === id ? { ...w, status } : w)))
    }
  }

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🧩 Wishes Moderation</h1>

      {wishes.length === 0 ? (
        <p className="text-gray-500">No wishes found.</p>
      ) : (
        <div className="grid gap-4">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{wish.title}</h2>
              <p className="text-gray-600 mt-2">{wish.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Status: <strong>{wish.status}</strong>
              </p>

              <div className="flex gap-2 mt-4">
                {wish.status !== 'approved' && (
                  <button
                    onClick={() => handleAction(wish.id, 'approved')}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {wish.status !== 'rejected' && (
                  <button
                    onClick={() => handleAction(wish.id, 'rejected')}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
