import { useEffect, useState } from "react";

export default function Explore() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishes() {
      const res = await fetch("/api/wishes/list");
      const data = await res.json();
      setWishes(data || []);
      setLoading(false);
    }
    fetchWishes();
  }, []);

  async function handleDonate(wishId, amount, email) {
    const res = await fetch("/api/checkout/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishId, amount, donorEmail: email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  if (loading) return <p style={{ textAlign: "center" }}>Loading wishes...</p>;

  return (
    <main className="explore">
      <h1>🌟 Explore Wishes</h1>
      <p>Pick a dream to make real — and become someone’s Richie.</p>

      <div className="grid">
        {wishes.length === 0 && <p>No wishes yet. Be the first!</p>}
        {wishes.map((wish) => (
          <div key={wish.id} className="card">
            <h3>{wish.title}</h3>
            <p>{wish.description}</p>
            <p>
              <strong>Goal:</strong> ${wish.amount}
            </p>
            <input
              type="email"
              placeholder="Your Email"
              id={`donor-${wish.id}`}
            />
            <button
              onClick={() =>
                handleDonate(
                  wish.id,
                  wish.amount,
                  document.getElementById(`donor-${wish.id}`).value
                )
              }
            >
              Donate ❤️
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .explore {
          text-align: center;
          padding: 2rem;
        }

        .grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          margin-top: 2rem;
        }

        .card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
        }

        .card h3 {
          margin: 0 0 0.5rem;
        }

        .card button {
          background: #0070f3;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.6rem 1rem;
          margin-top: 1rem;
          cursor: pointer;
          transition: 0.2s;
        }

        .card button:hover {
          background: #0059c1;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
      `}</style>
    </main>
  );
}
