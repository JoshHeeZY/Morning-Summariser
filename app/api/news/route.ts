import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const country = searchParams.get("country") || "us";

  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.error("[news] Missing NEWS_API_KEY");
    return NextResponse.json(
      { error: "Missing NEWS_API_KEY env var", items: [] },
      { status: 500 }
    );
  }

  const url =
    `https://newsapi.org/v2/top-headlines?country=${country}` +
    (q ? `&q=${encodeURIComponent(q)}` : "") +
    `&pageSize=10&apiKey=${apiKey}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });

    // If NewsAPI returns an error, bubble up the reason for debugging
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[news] Upstream error", res.status, text);
      let reason: any = undefined;
      try { reason = JSON.parse(text); } catch {}
      return NextResponse.json(
        { error: reason?.message || `news_fetch_failed (${res.status})`, items: [] },
        { status: res.status }
      );
    }

    const data = await res.json();
    const items =
      (data.articles ?? []).slice(0, 10).map((a: any) => ({
        title: a.title,
        source: a.source?.name ?? "",
        url: a.url ?? "",
      }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    console.error("[news] Unexpected error", e);
    return NextResponse.json(
      { error: "unexpected_error", items: [] },
      { status: 500 }
    );
  }
}
