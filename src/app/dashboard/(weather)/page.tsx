"use client";

import { useEffect, useRef, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useForecast } from "@/hooks/useForecast";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { addRecentSearch } from "@/redux/actions/weatherActions";
import HeaderBar from "@/components/dashboard/HeaderBar";
import HeroSection from "@/components/dashboard/HeroSection";
import RecentlySearched from "@/components/dashboard/RecentlySearched";
import BottomStrip from "@/components/dashboard/BottomStrip";
import LeftSidebar from "@/components/dashboard/LeftSidebar";

export default function DashboardPage() {
  const { weather, isLoading: weatherLoading, getWeather } = useWeather();
  const { forecast, isLoading: forecastLoading, getForecast } = useForecast();
  const { location, isLoading: locLoading, requestLocation } = useCurrentLocation();
  const [cityName, setCityName] = useState("Current Location");
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const fetched = useRef(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (location && !fetched.current) {
      fetched.current = true;
      getWeather(location.lat, location.lon);
      getForecast(location.lat, location.lon);
      fetch(`/api/geocode?lat=${location.lat}&lon=${location.lon}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.name) {
            setCityName(d.name);
            dispatch(addRecentSearch(d.name));
          }
        })
        .catch(() => {});
    }
  }, [location, getWeather, getForecast, dispatch]);

  const isLoading = locLoading || weatherLoading || forecastLoading;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen gap-6 py-6">
      {/* Sidebar - desktop only */}
      <aside className="hidden md:block w-72 flex-shrink-0 overflow-y-auto no-scrollbar">
        <LeftSidebar
          weather={weather}
          cityName={cityName}
          activeCityIndex={activeCityIndex}
          onCitySelect={setActiveCityIndex}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-28 md:pb-0">
        <HeaderBar cityName={cityName} date={dateStr} />
        <HeroSection weather={weather} forecast={forecast} isLoading={isLoading} />
        <RecentlySearched />
        <BottomStrip forecast={forecast} isLoading={forecastLoading} />
      </main>
    </div>
  );
}
