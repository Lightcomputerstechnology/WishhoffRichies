// components/Sidebar.jsx
"use client";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transform transition-transform z-40 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <Link href="/">
              <div className="text-xl font-bold text-primary">💫 WishhoffRichies</div>
            </Link>
            <div className="text-xs text-slate-500 mt-1">User Dashboard</div>
          </div>

          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden text-slate-600 dark:text-slate-200"
            aria-label="Toggle sidebar"
          >
            ×
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Dashboard
          </Link>
          <Link href="/dashboard/my-wishes" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            My Wishes
          </Link>
          <Link href="/dashboard/donations" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Donations
          </Link>
          <Link href="/dashboard/reports" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Reports
          </Link>
          <Link href="/dashboard/kyc" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            KYC / Profile
          </Link>
          <Link href="/dashboard/settings" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Settings
          </Link>

          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Link href="/" className="block px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:underline">
              Back to public site
            </Link>
          </div>
        </nav>
      </aside>

      {/* small spacer for mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
