// components/DashboardLayout.jsx
"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg-page,#f8fafc)] dark:bg-dark text-dark dark:text-light">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen ml-0 md:ml-[260px]">
          <Topbar />
          <main className="p-6 md:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
