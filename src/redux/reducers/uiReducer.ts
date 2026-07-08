import type { ReduxAction, UIState, Toast } from "@/redux/types";
import {
  SET_THEME,
  SET_UNITS,
  SHOW_TOAST,
  HIDE_TOAST,
  SET_LOADING,
  SET_SEARCH_QUERY,
  SET_SEARCH_RESULTS,
} from "@/redux/constants/actionTypes";

const initialState: UIState = {
  theme: "dark",
  units: "imperial",
  isLoading: false,
  searchQuery: "",
  searchResults: null,
  toasts: [],
};

const uiReducer = (state = initialState, action: ReduxAction): UIState => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload as UIState["theme"] };
    case SET_UNITS:
      return { ...state, units: action.payload as UIState["units"] };
    case SHOW_TOAST:
      return { ...state, toasts: [...state.toasts, action.payload as Toast] };
    case HIDE_TOAST:
      return { ...state, toasts: state.toasts.filter((t) => t.id !== (action.payload as string)) };
    case SET_LOADING:
      return { ...state, isLoading: action.payload as boolean };
    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload as string };
    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload as UIState["searchResults"] };
    default:
      return state;
  }
};

export default uiReducer;
