import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_SET_USER,
} from "@/redux/constants/actionTypes";
import type { ReduxAction, UserData } from "@/redux/types";

export const authStart = (): ReduxAction => ({
  type: AUTH_START,
});

export const authSuccess = (user: UserData): ReduxAction => ({
  type: AUTH_SUCCESS,
  payload: user,
});

export const authFailure = (error: string): ReduxAction => ({
  type: AUTH_FAILURE,
  payload: error,
});

export const authLogout = (): ReduxAction => ({
  type: AUTH_LOGOUT,
});

export const authSetUser = (user: UserData | null): ReduxAction => ({
  type: AUTH_SET_USER,
  payload: user,
});
