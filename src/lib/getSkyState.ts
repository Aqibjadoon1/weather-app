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
  "clear-day":    "linear-gradient(180deg, #2E7BC4 0%, #5CA8DE 45%, #A9D4EE 80%, #D7ECF7 100%)",
  "clear-night":  "linear-gradient(180deg, #060810 0%, #0B0E14 40%, #171B26 75%, #1F2433 100%)",
  "cloudy-day":   "linear-gradient(180deg, #5C6B7A 0%, #8493A0 45%, #ABB7C0 80%, #CDD5DB 100%)",
  "cloudy-night": "linear-gradient(180deg, #0D0F16 0%, #14171F 40%, #1D212B 75%, #262B36 100%)",
  "rainy-day":    "linear-gradient(180deg, #3E4C58 0%, #5E6E7A 45%, #7F8D97 80%, #A0ABB2 100%)",
  "rainy-night":  "linear-gradient(180deg, #070911 0%, #0D1017 40%, #161A22 75%, #1E232B 100%)",
  "stormy":       "linear-gradient(180deg, #12131C 0%, #221C2E 40%, #34273F 75%, #3F2E4C 100%)",
  "snowy":        "linear-gradient(180deg, #57687A 0%, #8797A6 45%, #C0CBD4 80%, #EDF2F5 100%)",
  "foggy":        "linear-gradient(180deg, #6E7378 0%, #8F9398 45%, #B4B8BB 80%, #D6D9DB 100%)",
  "dawn":         "linear-gradient(180deg, #131625 0%, #4A3B57 35%, #A85D6B 65%, #E39B5C 88%, #F2C27A 100%)",
  "dusk":         "linear-gradient(180deg, #0D0E17 0%, #362A45 35%, #A14E5E 65%, #D97E4E 88%, #EBA65E 100%)",
};

export const lightBgStates: SkyState[] = ["clear-day", "cloudy-day", "snowy", "foggy"];

export function isLightBackground(state: SkyState): boolean {
  return lightBgStates.includes(state);
}
