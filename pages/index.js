// pages/index.js
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>WishhoffRichies | Turn Wishes into Reality</title>
        <meta
          name="description"
          content="A platform where generosity meets dreams. WishhoffRichies connects those who wish with those who can make wishes come true — transparently and beautifully."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="main">
        <nav className="navbar">
          <h1 className="logo">💫 WishhoffRichies</h1>
          <button className="btn">Make a Wish</button>
        </nav>

        <section className="hero">
          <h2>Where Generosity Meets Dreams 🌍</h2>
          <p>
            Imagine a world where abundance fuels compassion. 
            <strong> WishhoffRichies </strong> bridges dreamers and donors — 
            turning heartfelt wishes into real-world impact.
          </p>
          <button className="btn-primary">Get Started</button>
        </section>

        <section className="about">
          <h3>💖 How It Works</h3>
          <ul>
            <li>1️⃣ Create a wish — share your story and what you need most.</li>
            <li>2️⃣ Richies explore wishes and choose one to fulfill.</li>
            <li>3️⃣ Joy spreads, and the world becomes a little kinder.</li>
          </ul>
        </section>

        <footer>
          <p>
            © {new Date().getFullYear()} <strong>WishhoffRichies</strong> — Built with ❤️ by Light Tech Hub
          </p>
        </footer>
      </main>

      <style jsx>{`
        .main {
          font-family: 'Inter', sans-serif;
          background: #fafafa;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem;
          color: #222;
        }

        .navbar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: #fff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .btn, .btn-primary {
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .btn {
          background: transparent;
          border: 1px solid #222;
        }

        .btn:hover {
          background: #222;
          color: #fff;
        }

        .btn-primary {
          background: #0070f3;
          color: #fff;
          margin-top: 1rem;
        }

        .btn-primary:hover {
          background: #0059c1;
        }

        .hero {
          text-align: center;
          padding: 3rem 1rem;
          max-width: 800px;
        }

        .about {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin: 2rem auto;
          max-width: 700px;
          text-align: left;
        }

        footer {
          text-align: center;
          padding: 1rem;
          font-size: 0.9rem;
          color: #555;
        }

        ul {
          list-style: none;
          padding-left: 0;
        }

        li {
          margin: 0.8rem 0;
        }
      `}</style>
    </>
  );
}
