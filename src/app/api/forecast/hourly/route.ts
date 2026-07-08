import { NextResponse } from "next/server";

const OWM_ICON_MAP: Record<string, string> = {
  "01d": "wb_sunny", "01n": "clear_night",
  "02d": "partly_cloudy_day", "02n": "partly_cloudy_night",
  "03d": "cloud", "03n": "cloud",
  "04d": "cloud", "04n": "cloud",
  "09d": "rainy", "09n": "rainy",
  "10d": "rainy", "10n": "rainy",
  "11d": "thunderstorm", "11n": "thunderstorm",
  "13d": "weather_snowy", "13n": "weather_snowy",
  "50d": "foggy", "50n": "foggy",
};

function owmIcon(code: string): string {
  return OWM_ICON_MAP[code] || "cloud";
}

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

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: `OpenWeatherMap error: ${res.statusText}` }, { status: res.status });
    }

    const data = await res.json();
    const today = new Date().toISOString().slice(0, 10);

    const hourly = data.list
      .filter((entry: { dt_txt: string }) => entry.dt_txt.startsWith(today))
      .slice(0, 8)
      .map((entry: { dt_txt: string; main: { temp: number }; weather: { main: string; icon: string }[]; pop: number }) => {
        const time = entry.dt_txt.split(" ")[1].slice(0, 5);
        return {
          time,
          icon: owmIcon(entry.weather[0].icon),
          temperature: Math.round(entry.main.temp),
          condition: entry.weather[0].main,
          precipitation: Math.round((entry.pop || 0) * 100),
        };
      });

    return NextResponse.json(hourly);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch hourly forecast" },
      { status: 500 }
    );
  }
}
