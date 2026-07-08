import {
  SET_THEME,
  SET_UNITS,
  SHOW_TOAST,
  HIDE_TOAST,
  SET_LOADING,
  SET_SEARCH_QUERY,
  SET_SEARCH_RESULTS,
} from "@/redux/constants/actionTypes";
import type { ReduxAction, Theme, Unit, Toast, LocationData } from "@/redux/types";

export const setTheme = (theme: Theme): ReduxAction => ({
  type: SET_THEME,
  payload: theme,
});

export const setUnits = (units: Unit): ReduxAction => ({
  type: SET_UNITS,
  payload: units,
});

export const showToast = (toast: Toast): ReduxAction => ({
  type: SHOW_TOAST,
  payload: toast,
});

export const hideToast = (toastId: string): ReduxAction => ({
  type: HIDE_TOAST,
  payload: toastId,
});

export const setLoading = (isLoading: boolean): ReduxAction => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setSearchQuery = (query: string): ReduxAction => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});

export const setSearchResults = (results: LocationData[] | null): ReduxAction => ({
  type: SET_SEARCH_RESULTS,
  payload: results,
});
