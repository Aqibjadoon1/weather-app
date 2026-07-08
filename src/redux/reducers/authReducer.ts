import type { ReduxAction, AuthState, UserData } from "@/redux/types";
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_SET_USER,
} from "@/redux/constants/actionTypes";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state = initialState, action: ReduxAction): AuthState => {
  switch (action.type) {
    case AUTH_START:
      return { ...state, isLoading: true, error: null };
    case AUTH_SUCCESS:
      return { ...state, user: action.payload as UserData, isAuthenticated: true, isLoading: false };
    case AUTH_FAILURE:
      return { ...state, error: action.payload as string, isLoading: false };
    case AUTH_LOGOUT:
      return { ...initialState };
    case AUTH_SET_USER:
      return { ...state, user: action.payload as UserData | null };
    default:
      return state;
  }
};

export default authReducer;
