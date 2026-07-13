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
      const sunrise = new Date(parseInt(sunriseStr) * 1000);
      const sunset = new Date(parseInt(sunsetStr) * 1000);
      setSkyState(getSkyState({ weatherCode, currentTime: new Date(), sunrise, sunset }));
    };

    compute();
    const interval = setInterval(compute, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [weatherCode, sunriseStr, sunsetStr]);

  return skyState;
}
