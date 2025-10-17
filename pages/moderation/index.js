import AdminLayout from "../../components/AdminLayout";
import { useEffect, useState } from "react";

export default function Moderation() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/wishes/list");
    const data = await res.json();
    setWishes(data.filter(w => w.status === "pending" || w.status === "open"));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  async function moderate(id, action, note = "") {
    const res = await fetch("/api/wishes/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wishId: id, action, note })
    });
    const data = await res.json();
    if (res.ok) load();
    else alert(data.error || "Failed");
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Moderation Queue</h1>
      {loading ? <p>Loading…</p> : wishes.length === 0 ? <p>No pending wishes.</p> : (
        <div className="grid gap-4">
          {wishes.map(w => (
            <div key={w.id} className="p-4 bg-white dark:bg-slate-800 rounded shadow">
              <h3 className="font-semibold">{w.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{w.description}</p>
              <div className="flex gap-2 mt-3">
                <button className="btn primary" onClick={() => moderate(w.id, "approve")}>Approve</button>
                <button className="btn outline" onClick={() => {
                  const note = prompt("Reason for rejection?");
                  if (note !== null) moderate(w.id, "reject", note);
                }}>Reject</button>
                <button className="btn" onClick={() => moderate(w.id, "flag")}>Flag</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
