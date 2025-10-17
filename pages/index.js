// pages/index.js
// pages/index.js
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>WishhoffRichies — Turn wishes into reality</title>
        <meta name="description" content="WishhoffRichies connects people with dreams to those who can make them happen. Post a wish, get discovered, and receive support." />
      </Head>

      <Navbar />

      <main className="hero-wrap">
        <section className="hero container">
          <div className="hero-left">
            <h1>Turn wishes into reality</h1>
            <p className="lead">
              WishhoffRichies connects generous donors with real people who need one helping hand. Transparent. Verified. Human.
            </p>

            <div className="hero-cta">
              <Link href="/wish/new"><a className="btn primary">Make a Wish</a></Link>
              <Link href="/explore"><a className="btn outline">Browse Wishes</a></Link>
            </div>

            <ul className="trust-list">
              <li><strong>Verified wishes</strong> — manual review for larger requests</li>
              <li><strong>Secure payments</strong> — Stripe Checkout</li>
              <li><strong>Transparent</strong> — donation receipts & history</li>
            </ul>
          </div>

          <div className="hero-right" aria-hidden>
            <div className="mock-card">
              <h4>Featured Wish</h4>
              <p className="mock-title">School fees for Ada</p>
              <div className="progress">
                <div className="progress-bar" style={{ width: "62%" }} />
              </div>
              <div className="meta">
                <span className="amount-raised">$620</span>
                <span className="amount-goal"> / $1000</span>
              </div>
              <div className="mock-actions">
                <Link href="/explore"><a className="btn small">View Wishes</a></Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="features container">
        <div className="feature">
          <h3>Simple</h3>
          <p>Post a wish in under 60 seconds — share your need and a short story.</p>
        </div>
        <div className="feature">
          <h3>Trustworthy</h3>
          <p>Moderation and optional KYC for large payouts builds donor confidence.</p>
        </div>
        <div className="feature">
          <h3>Secure</h3>
          <p>Donations processed by Stripe; funds recorded and auditable in our system.</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
