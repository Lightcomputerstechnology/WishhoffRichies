// pages/index.js
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>WishhoffRichies | Turn Wishes into Reality</title>
        <meta name="description" content="A platform where the rich help make the dreams of others come true." />
      </Head>

      <main className="main">
        <nav className="navbar">
          <h1 className="logo">💫 WishhoffRichies</h1>
          <button className="btn">Make a Wish</button>
        </nav>

        <section className="hero">
          <h2>Where Generosity Meets Dreams 🌍</h2>
          <p>
            Imagine a world where people with abundance can make someone’s wish come true.
            WishhoffRichies connects dreamers and donors — safely, transparently, beautifully.
          </p>
          <button className="btn-primary">Get Started</button>
        </section>

        <section className="about">
          <h3>💖 How It Works</h3>
          <ul>
            <li>1️⃣ Create a wish — tell the world what you need.</li>
            <li>2️⃣ Richies browse wishes and pick one to fulfill.</li>
            <li>3️⃣ The world becomes a little kinder.</li>
          </ul>
        </section>

        <footer>
          <p>© {new Date().getFullYear()} WishhoffRichies — Built with ❤️ by Light Tech Hub</p>
        </footer>
      </main>
    </>
  )
}
