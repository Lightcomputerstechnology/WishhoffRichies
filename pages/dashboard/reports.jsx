// pages/dashboard/reports.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../lib/supabaseClient";

export default function ReportsPage() {
  const [wishes, setWishes] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, raised: 0 });
  const reportRef = useRef();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) return;

    const { data } = await supabase.from("wishes").select("*").eq("user_id", user.id);
    setWishes(data || []);
    const completed = data.filter((w) => w.raised_amount >= w.amount).length;
    const pending = data.length - completed;
    const raised = data.reduce((acc, w) => acc + (w.raised_amount || 0), 0);
    setStats({ total: data.length, completed, pending, raised });
  }

  async function handlePrint() {
    window.print();
  }

  async function handleExportPDF() {
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
      pdf.save("wishhoffrichies-user-report.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      handlePrint();
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Reports</h1>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded">
              Print
            </button>
            <button onClick={handleExportPDF} className="px-3 py-2 bg-primary text-white rounded">
              Export PDF
            </button>
          </div>
        </div>

        <div ref={reportRef} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-slate-500 text-sm">Total Wishes</p>
              <p className="text-xl font-bold text-primary">{stats.total}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Completed</p>
              <p className="text-xl font-bold text-green-500">{stats.completed}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Pending</p>
              <p className="text-xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Raised</p>
              <p className="text-xl font-bold text-primary">${stats.raised}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Wish Breakdown</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-700">
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Goal</th>
                  <th className="p-2 text-left">Raised</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {wishes.map((w) => (
                  <tr key={w.id} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="p-2">{w.title}</td>
                    <td className="p-2">${w.amount}</td>
                    <td className="p-2">${w.raised_amount || 0}</td>
                    <td className="p-2">
                      {w.raised_amount >= w.amount ? (
                        <span className="text-green-500 font-medium">Completed</span>
                      ) : (
                        <span className="text-yellow-500 font-medium">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
