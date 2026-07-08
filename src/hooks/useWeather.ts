"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store";
import type { WeatherData } from "@/redux/types";
import {
  fetchWeatherStart,
  fetchWeatherSuccess,
  fetchWeatherFailure,
} from "@/redux/actions/weatherActions";

export const useWeather = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWeather, isLoading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const getWeather = useCallback(async (lat: number, lon: number) => {
    dispatch(fetchWeatherStart());
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (!res.ok) {
        dispatch(fetchWeatherFailure(data.error || "Failed to fetch weather"));
        return;
      }
      dispatch(fetchWeatherSuccess(data as WeatherData));
    } catch (err) {
      dispatch(fetchWeatherFailure((err as Error).message));
    }
  }, [dispatch]);

  return { weather: currentWeather, isLoading, error, getWeather };
};
