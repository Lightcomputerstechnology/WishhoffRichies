import { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function BrowseWishes() {
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishes()
  }, [])

  const fetchWishes = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('wishes').select('*').order('created_at', { ascending: false })
    if (error) console.error('Error fetching wishes:', error)
    else setWishes(data || [])
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Browse Wishes | WishhoffRichies</title>
      </Head>

      <main className="main">
        <nav className="navbar">
          <h1 className="logo">💫 WishhoffRichies</h1>
          <div>
            <Link href="/">
              <button className="btn">🏠 Home</button>
            </Link>
            <Link href="/create-wish">
              <button className="btn-primary" style={{ marginLeft: '0.5rem' }}>Make a Wish</button>
            </Link>
          </div>
        </nav>

        <section className="browse-section">
          <h2>🌠 Browse Wishes</h2>
          <p>See what dreams others have shared — maybe yours is the hand that helps them shine.</p>

          {loading ? (
            <p>Loading wishes...</p>
          ) : wishes.length === 0 ? (
            <p>No wishes yet. Be the first to <Link href="/create-wish"><strong>make one</strong></Link>!</p>
          ) : (
            <div className="wish-grid">
              {wishes.map((wish) => (
                <div key={wish.id} className="wish-card">
                  <h3>{wish.title}</h3>
                  <p className="wish-desc">{wish.description}</p>
                  <p><strong>Requested by:</strong> {wish.name}</p>
                  <p><strong>Amount:</strong> ${wish.amount}</p>
                  <button className="btn-primary small-btn">💝 Help Make It True</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer>
          <p>© {new Date().getFullYear()} WishhoffRichies — Built with ❤️ by Light Tech Hub</p>
        </footer>
      </main>
    </>
  )
}
