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
      {/* Bottom vignette — lifts UI legibility against the sky gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[1]"
        style={{
          height: "55vh",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 30%, rgba(0,0,0,0.10) 60%, transparent 100%)",
        }}
      />
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
