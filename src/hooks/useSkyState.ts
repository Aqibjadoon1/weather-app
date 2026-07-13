"use client";

import { useState, useEffect } from "react";
import { getSkyState, type SkyState } from "@/lib/getSkyState";

export function useSkyState(
  weatherCode: string | undefined,
  sunriseStr: string | undefined,
  sunsetStr: string | undefined
): SkyState | null {
  const [skyState, setSkyState] = useState<SkyState | null>(null);

  useEffect(() => {
    if (!weatherCode || !sunriseStr || !sunsetStr) return;

    const compute = () => {
      const now = new Date();
      const [sh, sm] = sunriseStr.split(":").map(Number);
      const [ss, ms] = sunsetStr.split(":").map(Number);
      const sunrise = new Date(now);
      sunrise.setHours(sh, sm, 0, 0);
      const sunset = new Date(now);
      sunset.setHours(ss, ms, 0, 0);

      setSkyState(getSkyState({ weatherCode, currentTime: now, sunrise, sunset }));
    };

    compute();
    const interval = setInterval(compute, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weatherCode, sunriseStr, sunsetStr]);

  return skyState;
}
