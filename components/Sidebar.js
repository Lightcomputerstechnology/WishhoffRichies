// components/Sidebar.jsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { MoonIcon, SunIcon } from "react-icons/hi";
import { FaLanguage, FaUserCircle } from "react-icons/fa";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(null);

  // ✅ Initialize Supabase client (make sure env vars are set)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // ✅ Fetch user session
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Toggle theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // ✅ Language switcher (for future i18n integration)
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // TODO: connect to i18n system later
  };

  // ✅ Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transform transition-transform z-40 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
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

        {/* User Section */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
          {user ? (
            <>
              <FaUserCircle className="text-3xl text-slate-500" />
              <div>
                <div className="font-semibold text-slate-700 dark:text-slate-200">
                  {user.user_metadata?.full_name || user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="space-x-2">
              <Link
                href="/auth/login"
                className="text-sm text-primary font-semibold hover:underline"
              >
                Login
              </Link>
              <span className="text-slate-400">|</span>
              <Link
                href="/auth/signup"
                className="text-sm text-primary font-semibold hover:underline"
              >
                Signup
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Dashboard
          </Link>
          <Link href="/dashboard/my-wishes" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            My Wishes
          </Link>
          <Link href="/dashboard/create-wish" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Create a Wish
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
        </nav>

        {/* Bottom Section */}
        <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center justify-center gap-2">
            <FaLanguage className="text-slate-600 dark:text-slate-300" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-sm text-slate-600 dark:text-slate-300"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          {/* Back to public site */}
          <Link
            href="/"
            className="block text-center text-sm text-slate-600 dark:text-slate-300 hover:underline"
          >
            Back to Public Site
          </Link>
        </div>
      </aside>

      {/* Spacer for mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
