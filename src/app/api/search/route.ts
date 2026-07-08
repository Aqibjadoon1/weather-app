import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { error: "q query parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "WEATHER_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=10&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `OpenWeatherMap error: ${text}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    const results = data.map(
      (item: { name: string; country: string; lat: number; lon: number; state?: string }) => ({
        name: item.name,
        country: item.country,
        state: item.state || null,
        lat: item.lat,
        lon: item.lon,
      })
    );

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to search cities" },
      { status: 500 }
    );
  }
}
