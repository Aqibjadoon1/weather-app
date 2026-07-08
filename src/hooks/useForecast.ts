"use client";

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store";
import type { ForecastDay } from "@/redux/types";
import {
  fetchForecastStart,
  fetchForecastSuccess,
  fetchForecastFailure,
} from "@/redux/actions/weatherActions";

export const useForecast = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forecast, isLoading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const getForecast = useCallback(async (lat: number, lon: number) => {
    dispatch(fetchForecastStart());
    try {
      const res = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (!res.ok) {
        dispatch(fetchForecastFailure(data.error || "Failed to fetch forecast"));
        return;
      }
      dispatch(fetchForecastSuccess(data as ForecastDay[]));
    } catch (err) {
      dispatch(fetchForecastFailure((err as Error).message));
    }
  }, [dispatch]);

  return { forecast, isLoading, error, getForecast };
};
