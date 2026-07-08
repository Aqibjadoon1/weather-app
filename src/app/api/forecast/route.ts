import { NextResponse } from "next/server";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function owmIcon(code: string): string {
  const map: Record<string, string> = {
    "01d": "wb_sunny",
    "01n": "clear_night",
    "02d": "partly_cloudy_day",
    "02n": "partly_cloudy_night",
    "03d": "cloud",
    "03n": "cloud",
    "04d": "cloud",
    "04n": "cloud",
    "09d": "rainy",
    "09n": "rainy",
    "10d": "rainy",
    "10n": "rainy",
    "11d": "thunderstorm",
    "11n": "thunderstorm",
    "13d": "weather_snowy",
    "13n": "weather_snowy",
    "50d": "foggy",
    "50n": "foggy",
  };
  return map[code] || "cloud";
}

interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon query parameters are required" },
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

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

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
    const daily: Record<string, ForecastDay> = {};

    for (const entry of data.list) {
      const date = new Date(entry.dt * 1000);
      const dayKey = date.toISOString().slice(0, 10);
      const dayName = DAY_NAMES[date.getDay()];

      if (!daily[dayKey]) {
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        daily[dayKey] = {
          day: dayName,
          date: dateStr,
          high: -Infinity,
          low: Infinity,
          condition: entry.weather[0].main,
          icon: owmIcon(entry.weather[0].icon),
          precipitation: 0,
        };
      }

      daily[dayKey].high = Math.max(daily[dayKey].high, Math.round(entry.main.temp_max));
      daily[dayKey].low = Math.min(daily[dayKey].low, Math.round(entry.main.temp_min));
      daily[dayKey].precipitation = Math.max(
        daily[dayKey].precipitation,
        Math.round((entry.pop || 0) * 100)
      );

      if (entry.dt_txt?.includes("12:00:00")) {
        daily[dayKey].condition = entry.weather[0].main;
        daily[dayKey].icon = owmIcon(entry.weather[0].icon);
      }
    }

    const forecast = Object.values(daily).slice(0, 7);
    return NextResponse.json(forecast);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch forecast" },
      { status: 500 }
    );
  }
}
