"use client";

import { useState, useEffect, useRef } from "react";

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

export default function WritePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [closingPicker, setClosingPicker] = useState(false);
  const [moodPrompt, setMoodPrompt] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const moodAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cryba-entries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClick = () => setDeleteId(null);
    if (deleteId) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [deleteId]);

  const closePicker = () => {
    if (!showMoodPicker || closingPicker) return;
    setClosingPicker(true);
    setTimeout(() => { setShowMoodPicker(false); setClosingPicker(false); }, 150);
  };

  useEffect(() => {
    if (!showMoodPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (moodAreaRef.current?.contains(e.target as Node)) return;
      closePicker();
    };
    const timeout = setTimeout(() => document.addEventListener("click", handleClick), 0);
    return () => { clearTimeout(timeout); document.removeEventListener("click", handleClick); };
  }, [showMoodPicker, closingPicker]);

  const saveEntry = () => {
    if (!mood) {
      setMoodPrompt((p) => p + 1);
      setShowMoodPicker(true);
      return;
    }
    if (!title.trim() || !text.trim()) return;
    setMoodPrompt(0);
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
    <section className="h-[calc(100vh-180px)] overflow-hidden px-6 py-4 md:px-20 lg:px-32">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 h-full">
        <div>
          <h1 className="write-title text-4xl md:text-5xl font-bold mb-8 dark:text-white">Write it out</h1>
          <div className="write-form bg-[#faf9f7] dark:bg-[#222] rounded-2xl p-6 border border-black/5 dark:border-white/5">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl overflow-hidden">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("entry-text")?.focus(); } }}
                placeholder="Title"
                className="w-full px-5 py-4 outline-none dark:text-white text-lg font-medium bg-transparent"
              />
              <div className="border-t border-black/5 dark:border-white/10" />
              <textarea
                id="entry-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-48 p-5 resize-none outline-none dark:text-white text-base leading-relaxed bg-transparent"
              />
            </div>
            <div ref={moodAreaRef} className="mt-4 flex items-center justify-between">
              <div key={moodPrompt} className={`relative flex ${moodPrompt && !mood ? "shake" : ""}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); showMoodPicker ? closePicker() : setShowMoodPicker(true); }}
                  className={`w-10 h-10 text-xl ${showMoodPicker || closingPicker ? "rounded-l-full" : "rounded-full hover:bg-black/10 dark:hover:bg-white/20"} bg-black/5 dark:bg-white/10 flex items-center justify-center relative z-10`}
                >
                  {mood || (
                    <svg className="w-5 h-5 opacity-40 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
                {(showMoodPicker || closingPicker) && (
                  <div className={`h-10 bg-black/5 dark:bg-white/10 rounded-r-full pr-2 pl-1 flex items-center gap-1 ${closingPicker ? "slide-left" : "slide-right"}`} onClick={(e) => e.stopPropagation()}>
                    {moods.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => { setMood(m.emoji); closePicker(); setMoodPrompt(0); }}
                        className="w-10 h-10 text-xl rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); saveEntry(); }}
                className="save-btn bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-3 rounded-full font-sans text-base font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="entries-title text-4xl md:text-5xl font-bold dark:text-white">Your entries</h2>
            <div className="entries-toggle flex gap-1 bg-[#faf9f7] dark:bg-[#222] rounded-full p-1.5 border border-black/5 dark:border-white/5">
              <button
                onClick={() => setView("list")}
                className={`px-4 py-1.5 text-base rounded-full ${view === "list" ? "bg-white dark:bg-[#1a1a1a] dark:text-white" : "opacity-50 dark:text-white"}`}
              >
                List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`px-4 py-1.5 text-base rounded-full ${view === "calendar" ? "bg-white dark:bg-[#1a1a1a] dark:text-white" : "opacity-50 dark:text-white"}`}
              >
                Calendar
              </button>
            </div>
          </div>

          {view === "list" ? (
            entries.length > 0 ? (
              <div className="entries-container space-y-3 flex-1 overflow-auto">
                {entries.map((entry, index) => (
                  <div key={entry.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <div
                      onClick={() => { setExpanded(expanded === entry.id ? null : entry.id); setDeleteId(null); }}
                      className="entry-card bg-[#faf9f7] dark:bg-[#222] rounded-2xl p-5 cursor-pointer flex items-center justify-between border border-black/5 dark:border-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{entry.mood}</span>
                        <span className="text-lg font-medium dark:text-white">{entry.title}</span>
                        <span className="text-base opacity-40 dark:text-white">{formatDate(entry.createdAt)}</span>
                      </div>
                      {deleteId === entry.id ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); confirmDelete(entry.id); }}
                          className="text-base px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 font-medium"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(entry.id); }}
                          className="text-base px-5 py-2 rounded-full bg-black/5 dark:bg-white/10 opacity-60 hover:opacity-100 dark:text-white"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    {expanded === entry.id && (
                      <div className="entry-expanded bg-[#f0ede6] dark:bg-[#1a1a1a] rounded-b-2xl -mt-2 pt-6 pb-5 px-5">
                        <p className="dark:text-white text-base leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="entries-container flex-1 flex items-center justify-center text-lg opacity-40 dark:text-white">
                No entries yet
              </div>
            )
          ) : expanded?.startsWith("day-") ? (
            <div className="entries-container bg-[#faf9f7] dark:bg-[#222] rounded-2xl p-5 flex-1 overflow-auto border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setExpanded(null)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full dark:text-white text-lg"
                >
                  ←
                </button>
                <span className="text-lg font-medium dark:text-white">
                  {new Date(calendarDate.getFullYear(), calendarDate.getMonth(), parseInt(expanded.replace("day-", ""))).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </span>
              </div>
              <div className="space-y-4">
                {getEntriesForDay(parseInt(expanded.replace("day-", ""))).map((entry) => (
                  <div key={entry.id} className="bg-white dark:bg-[#1a1a1a] rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{entry.mood}</span>
                        <span className="text-lg font-medium dark:text-white">{entry.title}</span>
                      </div>
                      {deleteId === entry.id ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); confirmDelete(entry.id); }}
                          className="text-base px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 font-medium"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(entry.id); }}
                          className="text-base px-5 py-2 rounded-full bg-black/5 dark:bg-white/10 opacity-60 hover:opacity-100 dark:text-white"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="mt-4 text-base leading-relaxed dark:text-white/70 whitespace-pre-wrap">{entry.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="entries-container bg-[#faf9f7] dark:bg-[#222] rounded-2xl p-5 flex-1 overflow-auto border border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full dark:text-white text-lg transition-transform active:scale-90"
                >
                  ←
                </button>
                <span className="text-lg font-medium dark:text-white">{monthName}</span>
                <button
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full dark:text-white text-lg transition-transform active:scale-90"
                >
                  →
                </button>
              </div>
              <div className="calendar-grid grid grid-cols-7 gap-1 text-center text-base mb-3">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="opacity-40 dark:text-white">{d}</div>
                ))}
              </div>
              <div className="calendar-grid grid grid-cols-7 gap-1">
                {Array.from({ length: getDaysInMonth(calendarDate).firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: getDaysInMonth(calendarDate).daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEntries = getEntriesForDay(day);
                  return (
                    <div
                      key={day}
                      className="calendar-day aspect-square flex flex-col items-center justify-center rounded-lg text-base dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                      onClick={() => dayEntries.length > 0 && setExpanded(`day-${day}`)}
                    >
                      <span>{day}</span>
                      {dayEntries.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayEntries.slice(0, 3).map((e) => (
                            <span key={e.id} className="text-sm">{e.mood}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
