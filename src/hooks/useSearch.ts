"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store";
import {
  setSearchQuery,
  setSearchResults,
} from "@/redux/actions/uiActions";

export const useSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchQuery, searchResults } = useSelector(
    (state: RootState) => state.ui
  );

  const searchCities = async (query: string) => {
    dispatch(setSearchQuery(query));
    try {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      dispatch(setSearchResults(data));
    } catch {
      dispatch(setSearchResults(null));
    }
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(""));
    dispatch(setSearchResults([]));
  };

  return { searchQuery, searchResults, searchCities, clearSearch };
};
