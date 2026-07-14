"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useWeather } from "@/hooks/useWeather";
import { useSkyState } from "@/hooks/useSkyState";
import { skyGradients } from "@/lib/getSkyState";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { weather } = useWeather();
  const skyState = useSkyState(weather?.condition, weather?.sunrise, weather?.sunset);
  const currentState = skyState ?? "cloudy-day";

  return (
    <div
      className="min-h-screen text-aether-text-primary sky-gradient"
      style={{ background: skyGradients[currentState] }}
    >
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
