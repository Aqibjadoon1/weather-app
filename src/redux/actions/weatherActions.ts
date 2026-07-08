import {
  FETCH_WEATHER_START,
  FETCH_WEATHER_SUCCESS,
  FETCH_WEATHER_FAILURE,
  FETCH_FORECAST_START,
  FETCH_FORECAST_SUCCESS,
  FETCH_FORECAST_FAILURE,
  SET_CURRENT_LOCATION,
  SET_SAVED_CITIES,
  ADD_SAVED_CITY,
  REMOVE_SAVED_CITY,
} from "@/redux/constants/actionTypes";
import type { ReduxAction, WeatherData, ForecastDay, LocationData, SavedCity } from "@/redux/types";

export const fetchWeatherStart = (): ReduxAction => ({
  type: FETCH_WEATHER_START,
});

export const fetchWeatherSuccess = (weather: WeatherData): ReduxAction => ({
  type: FETCH_WEATHER_SUCCESS,
  payload: weather,
});

export const fetchWeatherFailure = (error: string): ReduxAction => ({
  type: FETCH_WEATHER_FAILURE,
  payload: error,
});

export const fetchForecastStart = (): ReduxAction => ({
  type: FETCH_FORECAST_START,
});

export const fetchForecastSuccess = (forecast: ForecastDay[]): ReduxAction => ({
  type: FETCH_FORECAST_SUCCESS,
  payload: forecast,
});

export const fetchForecastFailure = (error: string): ReduxAction => ({
  type: FETCH_FORECAST_FAILURE,
  payload: error,
});

export const setCurrentLocation = (location: LocationData): ReduxAction => ({
  type: SET_CURRENT_LOCATION,
  payload: location,
});

export const setSavedCities = (cities: SavedCity[]): ReduxAction => ({
  type: SET_SAVED_CITIES,
  payload: cities,
});

export const addSavedCity = (city: SavedCity): ReduxAction => ({
  type: ADD_SAVED_CITY,
  payload: city,
});

export const removeSavedCity = (cityName: string): ReduxAction => ({
  type: REMOVE_SAVED_CITY,
  payload: cityName,
});
