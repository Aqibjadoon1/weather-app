export type SkyState =
  | "clear-day" | "clear-night"
  | "cloudy-day" | "cloudy-night"
  | "rainy-day" | "rainy-night"
  | "stormy" | "snowy" | "foggy"
  | "dawn" | "dusk";

interface SkyStateInput {
  weatherCode: string;
  currentTime: Date;
  sunrise: Date;
  sunset: Date;
}

export function getSkyState({ weatherCode, currentTime, sunrise, sunset }: SkyStateInput): SkyState {
  const DAWN_DUSK_WINDOW_MS = 45 * 60 * 1000;
  const nearSunrise = Math.abs(currentTime.getTime() - sunrise.getTime()) < DAWN_DUSK_WINDOW_MS;
  const nearSunset = Math.abs(currentTime.getTime() - sunset.getTime()) < DAWN_DUSK_WINDOW_MS;
  const isDaytime = currentTime >= sunrise && currentTime < sunset;
  const code = weatherCode.toLowerCase();

  if (code.includes("thunder")) return "stormy";
  if (code.includes("snow")) return "snowy";
  if (code.includes("mist") || code.includes("fog") || code.includes("haze")) return "foggy";
  if (nearSunrise && isDaytime) return "dawn";
  if (nearSunset && !isDaytime) return "dusk";
  if (code.includes("rain") || code.includes("drizzle")) return isDaytime ? "rainy-day" : "rainy-night";
  if (code.includes("cloud")) return isDaytime ? "cloudy-day" : "cloudy-night";
  return isDaytime ? "clear-day" : "clear-night";
}

export const skyGradients: Record<SkyState, string> = {
  "clear-day":    "linear-gradient(180deg, #2B6CB0 0%, #4A90D9 25%, #6DB3F2 50%, #8FC5F7 75%, #B0D9FA 100%)",
  "clear-night":  "linear-gradient(180deg, #0B1021 0%, #1A1F35 40%, #2D3354 75%, #3D4470 100%)",
  "cloudy-day":   "linear-gradient(180deg, #4A7A9E 0%, #6B9BBD 30%, #8DB5D0 55%, #AECDE0 80%, #CEE0EC 100%)",
  "cloudy-night": "linear-gradient(180deg, #141822 0%, #1D2130 40%, #282D3E 75%, #32384B 100%)",
  "rainy-day":    "linear-gradient(180deg, #3D6480 0%, #5A84A0 30%, #7AA3BC 55%, #9AC0D4 80%, #B8D4E4 100%)",
  "rainy-night":  "linear-gradient(180deg, #0F1420 0%, #181D2B 40%, #212738 75%, #2B3144 100%)",
  "stormy":       "linear-gradient(180deg, #1D1E28 0%, #2E2536 40%, #3D2E44 75%, #4A354F 100%)",
  "snowy":        "linear-gradient(180deg, #7BA3C8 0%, #A0C0DC 35%, #C0D8EA 60%, #DCE8F4 85%, #EDF2F8 100%)",
  "foggy":        "linear-gradient(180deg, #6A8A9E 0%, #8AAABE 35%, #AAC4D4 60%, #C8DCE8 85%, #E0EAF2 100%)",
  "dawn":         "linear-gradient(180deg, #1E1B30 0%, #4E3B55 35%, #A85D6B 65%, #E39B5C 88%, #F2C27A 100%)",
  "dusk":         "linear-gradient(180deg, #101020 0%, #3A2D48 35%, #A14E5E 65%, #D97E4E 88%, #EBA65E 100%)",
};

export const lightBgStates: SkyState[] = ["clear-day", "cloudy-day", "snowy", "foggy"];

export function isLightBackground(state: SkyState): boolean {
  return lightBgStates.includes(state);
}
