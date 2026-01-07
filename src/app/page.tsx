"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
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

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-20 lg:px-32">
      <Link href="/" className="text-3xl font-black dark:text-white" style={{ WebkitTextStroke: "1px currentColor" }}>C .</Link>
      <nav className="flex items-center gap-6 text-base font-sans dark:text-white">
        <Link href="/" className="hover:opacity-70">Home</Link>
        <Link href="/app" className="hover:opacity-70">Write</Link>
      </nav>
      <ThemeToggle />
    </header>
  );
}

function Hero() {
  return (
    <section className="px-6 py-4 md:px-20 lg:px-32">
      <div className="bg-[#f3f0e9] dark:bg-[#2a2a2a] rounded-3xl p-8 md:p-16">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl leading-tight md:text-5xl md:leading-tight dark:text-white">
              Your safe space to <span className="font-bold">let it all out</span>
            </h1>
            <p className="mt-4 text-lg opacity-70 dark:text-white">
              Anonymous journaling. No accounts. Everything stays on your device.
            </p>
            <Link
              href="/app"
              className="inline-block mt-8 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-4 rounded-full hover:opacity-90 font-sans text-sm font-medium"
            >
              Start Writing
            </Link>
            <div className="mt-8 space-y-3 font-sans text-[15px] dark:text-white">
              <div className="flex items-center gap-3"><span>✦</span><span>No sign up required</span></div>
              <div className="flex items-center gap-3"><span>✦</span><span>Your entries never leave your device</span></div>
              <div className="flex items-center gap-3"><span>✦</span><span>Track your mood over time</span></div>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/cliff.png" alt="Cryba.by" className="w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-4 md:px-20 lg:px-32">
      <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4">
        <Link href="/" className="text-base font-black dark:text-white">cryba.by</Link>
        <p className="text-base opacity-50 dark:text-white">your feelings are valid</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
