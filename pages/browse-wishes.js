// pages/browse-wishes.js
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
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('Error fetching wishes:', error)
    else setWishes(data || [])
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Browse Wishes | WishhoffRichies</title>
      </Head>

      <main className="min-h-screen bg-light dark:bg-dark text-dark dark:text-light flex flex-col">
        {/* Navbar */}
        <nav className="navbar">
          <h1 className="logo">WishhoffRichies</h1>
          <div className="flex gap-4">
            <Link href="/">
              <button className="btn">Home</button>
            </Link>
            <Link href="/create-wish">
              <button className="btn-primary">Make a Wish</button>
            </Link>
          </div>
        </nav>

        {/* Browse Section */}
        <section className="browse-section container mx-auto px-6 py-12 flex flex-col gap-6">
          <div className="text-center md:text-left mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Browse Wishes</h2>
            <p className="text-slate-600 dark:text-slate-300">
              See what dreams others have shared — maybe yours is the hand that helps them shine.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-lg">Loading wishes...</p>
          ) : wishes.length === 0 ? (
            <p className="text-center text-lg">
              No wishes yet. Be the first to{' '}
              <Link href="/create-wish">
                <strong className="text-primary underline">make one</strong>
              </Link>
              !
            </p>
          ) : (
            <div className="wish-grid grid md:grid-cols-3 gap-6">
              {wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="wish-card bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between transition hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold text-primary mb-2">{wish.title}</h3>
                  <p className="wish-desc text-slate-600 dark:text-slate-300 mb-2">{wish.description}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    <strong>Requested by:</strong> {wish.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <strong>Amount:</strong> ${wish.amount}
                  </p>
                  <Link href={`/wish/${wish.id}`}>
                    <button className="btn-primary w-full font-bold py-3 rounded-lg hover:bg-accent transition">
                      Help Make It True
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
          © {new Date().getFullYear()} WishhoffRichies — Built with ❤️ by Light Tech Hub
        </footer>
      </main>
    </>
  )
}
