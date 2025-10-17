// pages/wish/[id].js
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function WishPage() {
  const router = useRouter();
  const { id } = router.query;
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donorEmail, setDonorEmail] = useState("");
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/wishes/list`); // list returns all; filter client-side to avoid extra API
        const data = await res.json();
        if (!mounted) return;
        const found = data.find((x) => String(x.id) === String(id));
        setWish(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  async function startDonate(amount) {
    if (!donorEmail) return alert("Please enter your email");
    setDonating(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishId: id, amount, donorEmail }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Unable to create checkout");
    } catch (err) {
      alert(err.message);
    } finally {
      setDonating(false);
    }
  }

  return (
    <>
      <Head><title>{wish ? wish.title : "Wish"} — WishhoffRichies</title></Head>
      <Navbar />
      <main className="container page">
        {loading ? <p>Loading…</p> : !wish ? <p>Wish not found.</p> : (
          <div className="wish-detail">
            <div className="wish-main">
              <h1>{wish.title}</h1>
              <p className="muted">Requested by: {wish.name || "Anonymous"}</p>
              <p>{wish.description}</p>
              <div className="meta">
                <strong>Goal:</strong> ${wish.amount}
              </div>
            </div>

            <aside className="donation-card">
              <h3>Support this wish</h3>
              <label>Email (for receipt)</label>
              <input value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="you@example.com" />
              <label>Choose amount</label>
              <div className="donation-presets">
                {[5, 10, 25, 50, Number(wish.amount || 0)].map((a) => (
                  <button key={a} className="btn small" onClick={() => startDonate(a)} disabled={donating}>
                    {donating ? "Processing…" : `Donate $${a}`}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
