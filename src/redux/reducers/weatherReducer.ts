import type { ReduxAction, WeatherData, ForecastDay, LocationData, SavedCity } from "@/redux/types";
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
  ADD_RECENT_SEARCH,
} from "@/redux/constants/actionTypes";

export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastDay[];
  currentLocation: LocationData | null;
  savedCities: SavedCity[];
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: null,
  forecast: [],
  currentLocation: null,
  savedCities: [],
  recentSearches: [],
  isLoading: false,
  error: null,
};

const weatherReducer = (state = initialState, action: ReduxAction): WeatherState => {
  switch (action.type) {
    case FETCH_WEATHER_START:
      return { ...state, isLoading: true, error: null };
    case FETCH_WEATHER_SUCCESS:
      return { ...state, currentWeather: action.payload as WeatherData, isLoading: false };
    case FETCH_WEATHER_FAILURE:
      return { ...state, error: action.payload as string, isLoading: false };
    case FETCH_FORECAST_START:
      return { ...state, isLoading: true, error: null };
    case FETCH_FORECAST_SUCCESS:
      return { ...state, forecast: action.payload as ForecastDay[], isLoading: false };
    case FETCH_FORECAST_FAILURE:
      return { ...state, error: action.payload as string, isLoading: false };
    case SET_CURRENT_LOCATION:
      return { ...state, currentLocation: action.payload as LocationData };
    case SET_SAVED_CITIES:
      return { ...state, savedCities: action.payload as SavedCity[] };
    case ADD_SAVED_CITY:
      return { ...state, savedCities: [...state.savedCities, action.payload as SavedCity] };
    case REMOVE_SAVED_CITY:
      return { ...state, savedCities: state.savedCities.filter((c) => c.name !== (action.payload as string)) };
    case ADD_RECENT_SEARCH: {
      const city = action.payload as string;
      const filtered = state.recentSearches.filter((c) => c !== city);
      return { ...state, recentSearches: [city, ...filtered].slice(0, 8) };
    }
    default:
      return state;
  }
};

export default weatherReducer;
