"use client";

import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store";
import type { Theme } from "@/redux/types";
import { setTheme as setThemeAction } from "@/redux/actions/uiActions";

const THEME_STORAGE_KEY = "aether-theme";

const applyTheme = (theme: Theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.ui.theme);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (saved && saved !== theme) {
      dispatch(setThemeAction(saved));
    }
  }, [dispatch]);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback(
    (mode: Theme) => {
      dispatch(setThemeAction(mode));
    },
    [dispatch]
  );

  const toggleTheme = useCallback(() => {
    dispatch(setThemeAction(theme === "dark" ? "light" : "dark"));
  }, [dispatch, theme]);

  return { theme, toggleTheme, setTheme };
};
