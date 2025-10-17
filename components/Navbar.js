// components/Navbar.js
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // load preference
    const saved = typeof window !== "undefined" && localStorage.getItem("whr_dark");
    if (saved !== null) setDark(saved === "1");
    else {
      // follow system preference
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", dark);
    localStorage.setItem("whr_dark", dark ? "1" : "0");
  }, [dark]);

  return (
    <header className="nav">
      <div className="nav-left">
        <Link href="/"><a className="brand">💫 WishhoffRichies</a></Link>
      </div>

      <nav className="nav-right">
        <Link href="/explore"><a className="nav-link">Explore</a></Link>
        <Link href="/wish/new"><a className="nav-link">Make a Wish</a></Link>
        <button className="theme-toggle" onClick={() => setDark((d) => !d)} title="Toggle dark mode">
          {dark ? "🌙" : "☀️"}
        </button>
      </nav>
    </header>
  );
}
