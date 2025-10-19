// pages/dashboard/reports.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../lib/supabaseClient";

export default function ReportsPage() {
  const [wishes, setWishes] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      setWishes([]); setDonations([]); setLoading(false); return;
    }

    // Fetch user wishes
    const { data: wData } = await supabase.from("wishes").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    // Fetch donation history for this user (donor or recipient) — adjust to your schema
    const { data: dData } = await supabase.from("donations").select("*").or(`donor_id.eq.${user.id},wish_owner_id.eq.${user.id}`).order("created_at", { ascending: false });

    setWishes(wData || []);
    setDonations(dData || []);
    setLoading(false);
  }

  function downloadCSV() {
    const rows = [
      ["Type","Title/Reference","Amount","Status","Date"]
    ];

    wishes.forEach(w => {
      rows.push(["Wish", w.title, w.raised_amount ?? 0, (w.raised_amount >= w.amount ? "Completed" : "Pending"), new Date(w.created_at).toISOString()]);
    });

    donations.forEach(d => {
      rows.push(["Donation", d.wish_title || d.reference || `wish:${d.wish_id}`, d.amount, "Completed", new Date(d.created_at).toISOString()]);
    });

    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wishhoffrichies-report-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportPDF() {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const el = reportRef.current;
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("wishhoffrichies-report.pdf");
    } catch (err) {
      console.error("PDF export issue", err);
      window.print();
    }
  }

  const totals = {
    totalWishes: wishes.length,
    completed: wishes.filter(w => (w.raised_amount ?? 0) >= (w.amount ?? 0)).length,
    pending: wishes.filter(w => (w.raised_amount ?? 0) < (w.amount ?? 0)).length,
    totalRaised: wishes.reduce((s, w) => s + (w.raised_amount ?? 0), 0),
    donationsCount: donations.length,
    donationsTotal: donations.reduce((s, d) => s + (d.amount ?? 0), 0),
  };

  return (
    <DashboardLayout title="Reports">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Reports & Exports</h1>
          <div className="flex gap-2">
            <button onClick={downloadCSV} className="px-3 py-2 rounded border">Export CSV</button>
            <button onClick={exportPDF} className="px-3 py-2 bg-primary text-white rounded">Export PDF / Print</button>
          </div>
        </div>

        <div ref={reportRef} className="bg-white dark:bg-slate-800 p-6 rounded shadow space-y-6">
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="text-sm text-slate-500">Total Wishes</div>
              <div className="text-xl font-bold text-primary">{totals.totalWishes}</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="text-sm text-slate-500">Completed</div>
              <div className="text-xl font-bold text-green-500">{totals.completed}</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="text-sm text-slate-500">Pending</div>
              <div className="text-xl font-bold text-yellow-500">{totals.pending}</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded">
              <div className="text-sm text-slate-500">Total Raised</div>
              <div className="text-xl font-bold text-primary">${totals.totalRaised}</div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Wish Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Goal</th>
                    <th className="p-2 text-left">Raised</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {wishes.map(w => (
                    <tr key={w.id} className="border-b dark:border-slate-700">
                      <td className="p-2">{w.title}</td>
                      <td className="p-2">${w.amount}</td>
                      <td className="p-2">${w.raised_amount ?? 0}</td>
                      <td className="p-2">
                        {(w.raised_amount ?? 0) >= (w.amount ?? 0) ? <span className="text-green-500">Completed</span> : <span className="text-yellow-500">Pending</span>}
                      </td>
                      <td className="p-2">{new Date(w.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Donation History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th className="p-2 text-left">Reference</th>
                    <th className="p-2 text-left">Wish</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Method</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.id} className="border-b dark:border-slate-700">
                      <td className="p-2">{d.reference ?? d.id}</td>
                      <td className="p-2">{d.wish_title ?? d.wish_id}</td>
                      <td className="p-2">${d.amount}</td>
                      <td className="p-2">{d.method ?? "—"}</td>
                      <td className="p-2">{new Date(d.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-sm text-slate-500 mt-3">
              Donations shown include records where you were donor or where you were the wish owner (depends on your donations table schema).
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
