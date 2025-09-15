"use client";
import { useState } from "react";

export default function Home() {
  const [news, setNews] = useState<string[]>([]);

  const handleRefresh = () => {
    setNews([
      "Breaking: Placeholder News 1",
      "Update: Placeholder News 2",
      "Trending: Placeholder News 3",
      "Headline: Placeholder News 4",
      "Flash: Placeholder News 5",
      "Daily: Placeholder News 6",
      "Alert: Placeholder News 7",
      "Report: Placeholder News 8",
      "Story: Placeholder News 9",
      "Summary: Placeholder News 10",
    ]);
  };

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
          className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Refresh News
        </button>

        <ul className="space-y-2 mt-6 text-left">
          {news.map((item, idx) => (
            <li
              key={idx}
              className="p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium shadow-sm"
            >
              {idx + 1}. {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
