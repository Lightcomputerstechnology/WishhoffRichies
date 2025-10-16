import { useState } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'

export default function CreateWish() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    amount: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.from('wishes').insert([formData])
      if (error) throw error
      setMessage('🎉 Wish created successfully!')
      setFormData({ name: '', title: '', description: '', amount: '' })
    } catch (err) {
      console.error(err)
      setMessage('❌ Error creating wish. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create a Wish | WishhoffRichies</title>
      </Head>
      <main className="main">
        <nav className="navbar">
          <h1 className="logo">💫 WishhoffRichies</h1>
          <Link href="/">
            <button className="btn">🏠 Home</button>
          </Link>
        </nav>

        <section className="form-section">
          <h2>✨ Make Your Wish</h2>
          <p>Fill in your wish details — maybe a kind heart will make it come true.</p>

          <form onSubmit={handleSubmit} className="wish-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="title"
              placeholder="Wish Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Describe your wish..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <input
              type="number"
              name="amount"
              placeholder="Amount Needed ($)"
              value={formData.amount}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Wish'}
            </button>
          </form>

          {message && <p className="message">{message}</p>}
        </section>

        <footer>
          <p>© {new Date().getFullYear()} WishhoffRichies — Built with ❤️ by Light Tech Hub</p>
        </footer>
      </main>
    </>
  )
}
