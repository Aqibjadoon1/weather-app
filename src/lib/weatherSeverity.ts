export interface SeverityResult {
  score: number;
  label: "Good" | "Moderate" | "Unhealthy" | "Dangerous";
  color: string;
}

export function calculateWeatherSeverity(
  condition: string,
  windSpeed: number
): SeverityResult {
  const cond = condition.toLowerCase();
  let conditionScore = 10;
  if (
    cond.includes("thunder") ||
    cond.includes("storm") ||
    cond.includes("tornado")
  )
    conditionScore = 90;
  else if (cond.includes("snow") || cond.includes("blizzard"))
    conditionScore = 60;
  else if (
    cond.includes("rain") ||
    cond.includes("drizzle") ||
    cond.includes("shower")
  )
    conditionScore = 50;
  else if (
    cond.includes("fog") ||
    cond.includes("mist") ||
    cond.includes("haze")
  )
    conditionScore = 40;
  else if (cond.includes("cloud") || cond.includes("overcast"))
    conditionScore = 20;
  else if (
    cond.includes("clear") ||
    cond.includes("sunny") ||
    cond.includes("fair")
  )
    conditionScore = 10;

  let windScore = 0;
  if (windSpeed > 50) windScore = 50;
  else if (windSpeed > 30) windScore = 30;
  else if (windSpeed > 20) windScore = 20;
  else if (windSpeed > 10) windScore = 10;

  const total = Math.min(conditionScore + windScore, 100);

  if (total <= 25)
    return { score: total, label: "Good", color: "#22c55e" };
  if (total <= 50)
    return { score: total, label: "Moderate", color: "#eab308" };
  if (total <= 75)
    return { score: total, label: "Unhealthy", color: "#f97316" };
  return { score: total, label: "Dangerous", color: "#ef4444" };
}
