"use client";
import { useState } from "react";

type NewsItem = { title: string; source: string; url: string };

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/news"); // supports /api/news?q=ai&country=au if you want
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setNews(data.items ?? []);
    } catch (e) {
      setErr("Could not load news. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fallback placeholders (shown only when no real news yet)
  const placeholders = Array.from({ length: 10 }, (_, i) => ({
    title: `Placeholder News ${i + 1}`,
    source: "—",
    url: "",
  }));

  const list = news.length ? news : placeholders;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border bg-white shadow-sm p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          🌅 Morning Summariser
        </h1>
        <p className="mt-3 text-base md:text-lg text-slate-600">
          Start your day with the top 10 news summaries.
        </p>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition"
        >
          {loading ? "Loading..." : "Refresh News"}
        </button>

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <ul className="space-y-2 mt-6 text-left">
          {list.map((item, idx) => (
            <li
              key={idx}
              className="p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 font-medium shadow-sm"
            >
              {idx + 1}.{" "}
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="underline">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
              {item.source && <span className="text-gray-500"> — {item.source}</span>}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
