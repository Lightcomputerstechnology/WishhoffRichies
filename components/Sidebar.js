// components/Topbar.jsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("EN");
  const [showLangMenu, setShowLangMenu] = useState(false);

  // --- Load user and preferences ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Load theme & language from localStorage
    const savedTheme = localStorage.getItem("theme");
    const savedLang = localStorage.getItem("language");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
    if (savedLang) setLanguage(savedLang);

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  // --- Sign out ---
  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // --- Theme Toggle ---
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // --- Language Change ---
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setShowLangMenu(false);
  };

  const avatarLetter = user?.email ? user.email[0].toUpperCase() : "U";
  const username = user?.email ? user.email.split("@")[0] : "Guest";

  const LANG_FLAGS = {
    EN: "🇬🇧 English",
    FR: "🇫🇷 Français",
    ES: "🇪🇸 Español",
  };

  return (
    <>
      <Sidebar open={menuOpen} setOpen={setMenuOpen} />
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-3 px-4 z-30 flex items-center justify-between shadow-sm">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl text-slate-700 dark:text-slate-200"
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
            Welcome, {username}
          </h2>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 relative">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 text-sm px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:opacity-80"
            >
              🌍 {LANG_FLAGS[language]}
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in">
                {Object.entries(LANG_FLAGS).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      language === code ? "font-semibold text-primary" : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-sm px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded hover:opacity-80"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* Profile / Settings */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {avatarLetter}
              </div>
              <Link
                href="/dashboard/settings"
                className="text-sm text-slate-700 dark:text-slate-300 hover:underline"
              >
                Settings
              </Link>
              <button
                onClick={signOut}
                className="px-3 py-1 bg-primary text-white rounded hover:opacity-90 text-sm"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-3 py-1 bg-primary text-white rounded hover:opacity-90 text-sm"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16 md:h-20"></div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-in-out;
        }
      `}</style>
    </>
  );
}