"use client";

import Link from "next/link";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LocationDeniedPage() {
  const { requestLocation } = useCurrentLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card variant="default" padding="lg" className="max-w-md w-full text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/40">location_off</span>
        <h1 className="text-2xl font-bold text-on-surface mt-6">Location Access Required</h1>
        <p className="text-base text-on-surface-variant mt-3 leading-relaxed">
          Aether Weather needs your location to provide accurate forecasts. 
          Please enable location services in your browser or device settings.
        </p>
        <div className="flex flex-col gap-3 mt-8">
          <Button variant="primary" size="lg" fullWidth icon="my_location" onClick={requestLocation}>
            Try Again
          </Button>
          <Link
            href="/search"
            className="text-sm text-primary hover:underline font-label-bold"
          >
            Search Manually
          </Link>
        </div>
      </Card>
    </div>
  );
}
