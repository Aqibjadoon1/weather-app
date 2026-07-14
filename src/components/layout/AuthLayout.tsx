"use client";

import { ReactNode } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useSkyState } from "@/hooks/useSkyState";
import { skyGradients } from "@/lib/getSkyState";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { weather } = useWeather();
  const skyState = useSkyState(weather?.condition, weather?.sunrise, weather?.sunset);
  const currentState = skyState ?? "cloudy-day";

  return (
    <div
      className="min-h-screen text-aether-text-primary overflow-x-hidden sky-gradient"
      style={{ background: skyGradients[currentState] }}
    >
      {children}
    </div>
  );
}
