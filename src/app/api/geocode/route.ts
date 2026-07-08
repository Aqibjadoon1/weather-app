import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "WEATHER_API_KEY is not configured" }, { status: 500 });
  }

  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: `OpenWeatherMap error: ${res.statusText}` }, { status: res.status });
    }

    const data = await res.json();
    if (!data.length) {
      return NextResponse.json({ name: "Unknown", country: "" });
    }

    return NextResponse.json({ name: data[0].name, country: data[0].country });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to reverse geocode" },
      { status: 500 }
    );
  }
}
