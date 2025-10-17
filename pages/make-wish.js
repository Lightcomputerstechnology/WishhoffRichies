import { useState } from "react";
import Head from "next/head";

export default function MakeWish() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/wishes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, title, description, amount }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 Wish created successfully!");
        setName("");
        setEmail("");
        setTitle("");
        setDescription("");
        setAmount("");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Make a Wish | WishhoffRichies</title>
      </Head>

      <main className="container">
        <h1>💫 Create Your Wish</h1>
        <p>Share your dream — and let the world help you make it come true.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Wish Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your wish..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Target Amount (USD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Wish"}
          </button>
        </form>

        {message && <p className="msg">{message}</p>}
      </main>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 3rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        input,
        textarea {
          width: 100%;
          padding: 0.8rem;
          margin: 0.5rem 0;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
        }

        textarea {
          min-height: 100px;
        }

        button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
          transition: 0.2s;
        }

        button:hover {
          background: #0059c1;
        }

        .msg {
          margin-top: 1rem;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}
