"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cryba-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("cryba-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
    >
      {dark ? (
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="h-screen overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 md:px-20 lg:px-32">
        <Link href="/" className="text-3xl font-black dark:text-white" style={{ WebkitTextStroke: "1px currentColor" }}>C .</Link>
        <nav className="flex items-center gap-6 text-base font-sans dark:text-white">
          <Link href="/" className="hover:opacity-70">Home</Link>
          <Link href="/app" className="hover:opacity-70">Write</Link>
        </nav>
        <ThemeToggle />
      </header>
      <div className="flex-1 overflow-hidden content-fade">
        {children}
      </div>
      <footer className="px-6 py-4 md:px-20 lg:px-32">
        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4">
          <Link href="/" className="text-base font-black dark:text-white">cryba.by</Link>
          <p className="text-base opacity-50 dark:text-white">your feelings are valid</p>
        </div>
      </footer>
    </main>
  );
}
