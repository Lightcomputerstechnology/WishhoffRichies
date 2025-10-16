// pages/index.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import WishForm from "../components/WishForm";

export default function Home() {
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    fetchWishes();
  }, []);

  async function fetchWishes() {
    let { data, error } = await supabase
      .from("wishes")
      .select("id,title,amount_target,amount_raised,status")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error) setWishes(data || []);
    else console.error(error);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>WishhoffRichies — Make a wish. Find a donor.</h1>
      <section style={{ marginTop: 20 }}>
        <h2>Submit a Wish</h2>
        <WishForm />
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Active Wishes</h2>
        <ul>
          {wishes.map((w) => (
            <li key={w.id} style={{ marginBottom: 12 }}>
              <a href={`/wish/${w.id}`}><strong>{w.title}</strong></a>
              <div>Raised: {w.amount_raised} / {w.amount_target}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
