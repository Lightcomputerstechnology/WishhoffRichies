// pages/moderation/index.js
import AdminLayout from "../../components/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import KYCModal from "../../components/KYCModal";

export default function ModerationPage() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showKycFor, setShowKycFor] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) {
        // redirect to admin login
        window.location.href = "/admin/login";
        return;
      }
      // check role in users table
      const { data: profile } = await supabase.from("users").select("role").eq("email", user.email).maybeSingle();
      const role = profile?.role || null;
      setUserRole(role);
      if (role !== "admin") {
        alert("Access denied: admin only");
        window.location.href = "/";
        return;
      }
      // load pending wishes
      const res = await fetch("/api/wishes/list");
      const list = await res.json();
      // include pending (server returns open/fulfilled only) — fetch directly with admin client is preferable
      // We'll call moderator-specific API instead (we assume your server returns pending when called from server)
      // For now, filter locally to pending if present
      setWishes(list.filter(w => w.status === "pending" || w.status === "open" || !w.status));
      if (mounted) setLoading(false);
    }
    checkAuth();
    return () => (mounted = false);
  }, []);

  async function moderate(id, action, note = "") {
    try {
      const res = await fetch("/api/wishes/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishId: id, action, note })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed");
      // reload list
      setWishes(wishes.filter(w => w.id !== id));
    } catch (err) {
      alert(err.message || "Moderation failed");
    }
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
                <button className="btn" onClick={() => setShowKycFor(w.user_id)}>Request KYC</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showKycFor && (
        <KYCModal userId={showKycFor} onUploaded={() => { setShowKycFor(null); }} onClose={() => setShowKycFor(null)} />
      )}
    </AdminLayout>
  );
}
