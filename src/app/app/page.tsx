"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Entry = {
  id: string;
  title: string;
  text: string;
  mood: string;
  createdAt: number;
};

const moods = [
  { emoji: "😊", label: "happy" },
  { emoji: "😢", label: "sad" },
  { emoji: "😠", label: "angry" },
  { emoji: "😰", label: "anxious" },
  { emoji: "😌", label: "calm" },
  { emoji: "😴", label: "tired" },
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

export default function WritePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const saved = localStorage.getItem("cryba-entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntry = () => {
    if (!title.trim() || !text.trim() || !mood) return;
    const entry: Entry = {
      id: Date.now().toString(),
      title: title.trim(),
      text: text.trim(),
      mood,
      createdAt: Date.now(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("cryba-entries", JSON.stringify(updated));
    setTitle("");
    setText("");
    setMood("");
  };

  const confirmDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem("cryba-entries", JSON.stringify(updated));
    setDeleteId(null);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const getEntriesForDay = (day: number) => {
    const { year, month } = getDaysInMonth(calendarDate);
    return entries.filter((e) => {
      const d = new Date(e.createdAt);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const monthName = calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

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

      <section className="flex-1 overflow-hidden px-6 py-4 md:px-20 lg:px-32">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 h-full">
          <div>
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Write it out</h1>
            <div className="bg-[#f3f0e9] dark:bg-[#2a2a2a] rounded-2xl p-6">
              <div className="bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("entry-text")?.focus(); } }}
                  placeholder="Title"
                  className="w-full px-4 py-3 outline-none dark:text-white font-medium bg-transparent"
                />
                <div className="border-t border-black/5 dark:border-white/10" />
                <textarea
                  id="entry-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full h-48 p-4 resize-none outline-none dark:text-white bg-transparent"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="relative">
                  <button
                    onClick={() => setShowMoodPicker(!showMoodPicker)}
                    className="w-10 h-10 text-xl rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center"
                  >
                    {mood || (
                      <svg className="w-5 h-5 opacity-40 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  {showMoodPicker && (
                    <div className="absolute bottom-12 left-0 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg p-2 flex gap-1">
                      {moods.map((m) => (
                        <button
                          key={m.label}
                          onClick={() => { setMood(m.emoji); setShowMoodPicker(false); }}
                          className="w-10 h-10 text-xl rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          {m.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={saveEntry}
                  className="bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-6 py-3 rounded-full hover:opacity-90 font-sans text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {entries.length > 0 && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Your entries</h2>
                <div className="flex gap-1 bg-[#f3f0e9] dark:bg-[#2a2a2a] rounded-full p-1">
                  <button
                    onClick={() => setView("list")}
                    className={`px-3 py-1 text-sm rounded-full ${view === "list" ? "bg-white dark:bg-[#1a1a1a] dark:text-white" : "opacity-50 dark:text-white"}`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setView("calendar")}
                    className={`px-3 py-1 text-sm rounded-full ${view === "calendar" ? "bg-white dark:bg-[#1a1a1a] dark:text-white" : "opacity-50 dark:text-white"}`}
                  >
                    Calendar
                  </button>
                </div>
              </div>

              {view === "list" ? (
                <div className="space-y-3 flex-1 overflow-auto">
                  {entries.map((entry) => (
                    <div key={entry.id}>
                      <div
                        onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                        className="bg-[#f3f0e9] dark:bg-[#2a2a2a] rounded-2xl p-4 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{entry.mood}</span>
                          <span className="font-medium dark:text-white">{entry.title}</span>
                          <span className="text-sm opacity-40 dark:text-white">{formatDate(entry.createdAt)}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(entry.id); }}
                          className="text-sm opacity-40 hover:opacity-100 dark:text-white"
                        >
                          delete
                        </button>
                      </div>
                      {expanded === entry.id && (
                        <div className="bg-[#e8e5de] dark:bg-[#222] rounded-b-2xl -mt-2 pt-6 pb-4 px-4">
                          <p className="dark:text-white whitespace-pre-wrap">{entry.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#f3f0e9] dark:bg-[#2a2a2a] rounded-2xl p-4 flex-1 overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full dark:text-white"
                    >
                      ←
                    </button>
                    <span className="font-medium dark:text-white">{monthName}</span>
                    <button
                      onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full dark:text-white"
                    >
                      →
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="opacity-40 dark:text-white">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: getDaysInMonth(calendarDate).firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: getDaysInMonth(calendarDate).daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dayEntries = getEntriesForDay(day);
                      return (
                        <div
                          key={day}
                          className="aspect-square flex flex-col items-center justify-center rounded-lg text-sm dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                          onClick={() => dayEntries.length > 0 && setExpanded(expanded === `day-${day}` ? null : `day-${day}`)}
                        >
                          <span>{day}</span>
                          {dayEntries.length > 0 && (
                            <div className="flex gap-0.5 mt-0.5">
                              {dayEntries.slice(0, 3).map((e) => (
                                <span key={e.id} className="text-xs">{e.mood}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {expanded?.startsWith("day-") && (
                    <div className="mt-4 space-y-2 border-t border-black/10 dark:border-white/10 pt-4">
                      {getEntriesForDay(parseInt(expanded.replace("day-", ""))).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between bg-white dark:bg-[#1a1a1a] rounded-xl p-3">
                          <div className="flex items-center gap-2">
                            <span>{entry.mood}</span>
                            <span className="font-medium dark:text-white">{entry.title}</span>
                          </div>
                          <button
                            onClick={() => setDeleteId(entry.id)}
                            className="text-sm opacity-40 hover:opacity-100 dark:text-white"
                          >
                            delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-6 max-w-sm mx-4">
            <p className="text-lg dark:text-white">Delete this entry?</p>
            <p className="mt-2 text-sm opacity-50 dark:text-white">This cannot be undone.</p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="px-6 py-4 md:px-20 lg:px-32">
        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4">
          <Link href="/" className="text-base font-black dark:text-white">cryba.by</Link>
          <p className="text-base opacity-50 dark:text-white">your feelings are valid</p>
        </div>
      </footer>
    </main>
  );
}
