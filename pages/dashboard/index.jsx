// pages/dashboard/index.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import UserCard from "../../components/UserCard";
import { supabase } from "../../lib/supabaseClient";
import AccessGate from "../../components/AccessGate";
import { useRouter } from "next/router";

function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(target / (duration / 30)));
    const iv = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(iv);
      }
      setCount(start);
    }, 30);
    return () => clearInterval(iv);
  }, [target, duration]);
  return count;
}

export default function DashboardPage() {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, completed: 0, donors: 0, funds: 0 });
  const reportRef = useRef();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const { data: userResp } = await supabase.auth.getUser();
      const user = userResp?.user;

      // redirect handled by AccessGate, but we double-check
      if (!user) {
        setWishes([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("fetch user wishes error", error);
        setWishes([]);
      } else {
        if (mounted) setWishes(data || []);
        let pending = 0,
          completed = 0,
          donors = 0,
          funds = 0;
        (data || []).forEach((w) => {
          if (w.status === "completed" || (w.raised_amount && w.raised_amount >= w.amount))
            completed++;
          else pending++;
          donors += w.donors_count || 0;
          funds += Number(w.raised_amount || 0);
        });
        if (mounted) setStats({ pending, completed, donors, funds });
      }

      setLoading(false);
    }
    load();
    return () => (mounted = false);
  }, []);

  const pendingCount = useCountUp(stats.pending);
  const completedCount = useCountUp(stats.completed);
  const donorsCount = useCountUp(stats.donors);
  const fundsCount = useCountUp(stats.funds);

  async function handlePrint() {
    window.print();
  }

  async function handleExportPDF() {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const el = reportRef.current;
      if (!el) return alert("Nothing to export");
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("wishhoffrichies-report.pdf");
    } catch (err) {
      console.warn("PDF export failed (optional libs missing). Falling back to print.", err);
      handlePrint();
    }
  }

  return (
    <AccessGate requireAuth redirectTo="/login">
      <DashboardLayout>
        <div className="max-w-screen-xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UserCard />

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-4">
                <div className="text-sm text-slate-500">Pending Wishes</div>
                <div className="text-2xl font-bold text-primary">{pendingCount}</div>
              </div>
              <div className="card p-4">
                <div className="text-sm text-slate-500">Completed Wishes</div>
                <div className="text-2xl font-bold text-primary">{completedCount}</div>
              </div>
              <div className="card p-4">
                <div className="text-sm text-slate-500">Funds Raised ($)</div>
                <div className="text-2xl font-bold text-primary">${fundsCount}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Wishes</h2>
            <div className="flex gap-3">
              <button onClick={handlePrint} className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800">
                Print
              </button>
              <button onClick={handleExportPDF} className="px-3 py-2 rounded bg-primary text-white">
                Export PDF
              </button>
            </div>
          </div>

          <div ref={reportRef} className="space-y-4">
            {loading ? (
              <div className="p-6 bg-white dark:bg-slate-800 rounded">Loading…</div>
            ) : wishes.length === 0 ? (
              <div className="p-6 bg-white dark:bg-slate-800 rounded text-center">
                No wishes yet.{" "}
                <a className="text-primary" href="/create-wish">
                  Create your first wish
                </a>
                .
              </div>
            ) : (
              <div className="grid gap-4">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {w.title}
                      </div>
                      <div className="text-sm text-slate-500">{w.description}</div>
                      <div className="text-xs text-slate-400 mt-2">
                        Created: {new Date(w.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-3 md:mt-0 md:text-right">
                      <div className="text-sm text-slate-500">Goal: ${w.amount}</div>
                      <div className="text-sm text-slate-500">Raised: ${w.raised_amount || 0}</div>
                      <div className="mt-2">
                        <a href={`/wish/${w.id}`} className="px-3 py-1 rounded bg-primary text-white">
                          Open
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AccessGate>
  );
}
