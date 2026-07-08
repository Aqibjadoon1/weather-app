"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store";
import type { ToastType } from "@/redux/types";
import { showToast, hideToast } from "@/redux/actions/uiActions";

export const useToast = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toasts = useSelector((state: RootState) => state.ui.toasts);

  const addToast = (
    message: string,
    type: ToastType,
    duration?: number
  ) => {
    dispatch(
      showToast({
        id: String(Date.now()),
        message,
        type,
        duration,
      })
    );
  };

  const dismissToast = (id: string) => {
    dispatch(hideToast(id));
  };

  return { toasts, addToast, dismissToast };
};
