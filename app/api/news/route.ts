import { NextResponse } from "next/server";

// Raw article shape from NewsAPI
type NewsApiArticle = {
  title: string | null;
  source?: { name?: string | null } | null;
  url?: string | null;
};

// What your UI expects
type NewsItem = {
  title: string;
  source: string;
  url: string;
};

type NewsApiResponse = {
  articles?: NewsApiArticle[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") ?? "";
  const country = (searchParams.get("country") ?? "us").toLowerCase();

  const apiKey = process.env.NEWS_API_KEY as string | undefined;
  if (!apiKey) {
    // No key: return a 500 with an empty list (UI can keep placeholders)
    return NextResponse.json(
      { error: "Missing NEWS_API_KEY env var", items: [] as NewsItem[] },
      { status: 500 }
    );
  }

  const url =
    `https://newsapi.org/v2/top-headlines?country=${encodeURIComponent(country)}` +
    (q ? `&q=${encodeURIComponent(q)}` : "") +
    `&pageSize=10&apiKey=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      // Bubble up upstream error text (best-effort)
      const text = await res.text().catch(() => "");
      let reason: unknown;
      try {
        reason = JSON.parse(text);
      } catch {
        // ignore parse errors
      }
      const message =
        (typeof reason === "object" &&
          reason !== null &&
          "message" in reason &&
          typeof (reason as { message?: string }).message === "string" &&
          (reason as { message: string }).message) ||
        `news_fetch_failed (${res.status})`;

      return NextResponse.json(
        { error: message, items: [] as NewsItem[] },
        { status: res.status }
      );
    }

    const data = (await res.json()) as NewsApiResponse;

    const items: NewsItem[] = (data.articles ?? [])
      .slice(0, 10)
      .map((a): NewsItem => ({
        title: a.title ?? "",
        source: a.source?.name ?? "",
        url: a.url ?? "",
      }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    // Log unknown error safely
    console.error("[news] Unexpected error", err);
    return NextResponse.json(
      { error: "unexpected_error", items: [] as NewsItem[] },
      { status: 500 }
    );
  }
}
