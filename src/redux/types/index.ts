export type ToastType = "success" | "error" | "warning" | "info";
export type Theme = "light" | "dark" | "temporal";
export type Unit = "metric" | "imperial";
export type Priority = "low" | "medium" | "high";

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  visibility: number;
  airQuality: number;
  moonPhase: string;
  sunrise: string;
  sunset: string;
  icon: string;
}

export interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
}

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface SavedCity extends LocationData {
  temperature?: number;
  condition?: string;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  theme: Theme;
  units: Unit;
  isLoading: boolean;
  searchQuery: string;
  searchResults: LocationData[] | null;
  toasts: Toast[];
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface PackingItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isPacked: boolean;
  category: string;
  priority: Priority;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReduxAction<T = string> {
  type: T;
  payload?: unknown;
}
