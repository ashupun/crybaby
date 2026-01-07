"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = ["Home", "Resources", "Blog", "Get Support"];
const features = [
  "Build Healthy Coping Strategies",
  "Learn To Manage Stress And Anxiety",
  "Connect With A Supportive Community",
];

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
    <header className="relative flex items-center justify-between px-6 py-6 md:px-20 lg:px-32">
      <Link href="/" className="text-2xl font-black dark:text-white">m .</Link>
      <nav className="absolute left-1/2 -translate-x-1/2 hidden items-center gap-14 md:flex font-sans text-lg dark:text-white">
        {navLinks.map((link) => (
          <Link key={link} href={link === "Home" ? "/" : "#"} className="hover:opacity-70">
            {link}
          </Link>
        ))}
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
            <p className="text-xs font-sans font-semibold tracking-wider opacity-60 mb-4 dark:text-white">FREE RESOURCES</p>
            <h1 className="text-4xl leading-tight md:text-5xl md:leading-tight dark:text-white">
              Find Your Path To <span className="font-bold">Mental Wellness</span> and inner peace.
            </h1>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="enter your email"
                className="flex-1 px-6 py-4 rounded-full border border-black/10 bg-white dark:bg-[#1a1a1a] dark:border-white/10 dark:text-white outline-none font-sans text-sm"
              />
              <button className="bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-4 rounded-full hover:opacity-90 whitespace-nowrap font-sans text-sm font-medium">
                Get Free Resources
              </button>
            </div>
            <div className="mt-8 space-y-3 font-sans text-[15px] dark:text-white">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span>✦</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/hero.png" alt="Mental Health Guide" className="w-full max-w-md" />
          </div>
        </div>
      </div>
    </section>
  );
}

const countries = ["us", "gb", "ca", "au", "de", "fr", "jp", "br", "in", "nz"];

function SocialProof() {
  return (
    <section className="px-6 py-16 md:px-20 lg:px-32">
      <div className="flex flex-col items-center gap-6">
        <p className="text-xl font-semibold dark:text-white">Supporting People All Around The World</p>
        <div className="flex gap-4">
          {countries.map((code) => (
            <img
              key={code}
              src={`https://flagcdn.com/w40/${code}.png`}
              alt={code}
              className="w-8 h-6 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="px-6 md:px-20 lg:px-32">
      <div className="bg-[#1a1a1a] dark:bg-[#f3f0e9] rounded-3xl p-8 md:p-16 text-white dark:text-[#1a1a1a]">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="w-full max-w-sm mx-auto aspect-[3/4] bg-white/20 dark:bg-black/20 rounded-t-full" />
          <div>
            <p className="text-3xl md:text-4xl italic leading-relaxed">
              Release what weighs you down. Your feelings deserve to be heard.
            </p>
            <button className="mt-8 bg-[#a8e6cf] text-[#1a1a1a] px-8 py-4 rounded-full hover:opacity-90 font-sans text-sm font-medium">
              Get Personalised Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-12 md:px-20 lg:px-32">
      <div className="flex flex-col items-center justify-between gap-6 border-t border-black/10 dark:border-white/10 pt-8 md:flex-row">
        <Link href="/" className="text-2xl font-black dark:text-white">m .</Link>
        <nav className="flex gap-6 text-sm font-sans dark:text-white">
          {["Home", "Resources", "Blog", "Contact"].map((link) => (
            <Link key={link} href={link === "Home" ? "/" : "#"} className="hover:opacity-70">
              {link}
            </Link>
          ))}
        </nav>
        <p className="text-sm opacity-50 font-sans dark:text-white">© 2024 Mental Wellness</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <SocialProof />
      <Story />
      <Footer />
    </main>
  );
}