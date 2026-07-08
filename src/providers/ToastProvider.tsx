"use client";

import { useSelector, useDispatch } from "react-redux";
import ToastContainer from "@/components/ui/Toast";
import { hideToast } from "@/redux/actions/uiActions";
import type { RootState, AppDispatch } from "@/redux/store";

export default function ToastProvider() {
  const toasts = useSelector((state: RootState) => state.ui.toasts);
  const dispatch = useDispatch<AppDispatch>();

  return <ToastContainer toasts={toasts} onDismiss={(id) => dispatch(hideToast(id) as never)} />;
}
