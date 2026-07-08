"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthChange } from "@/firebase/auth";
import { authSetUser } from "@/redux/actions/authActions";
import type { AppDispatch } from "@/redux/store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      dispatch(authSetUser(user));
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, [dispatch, initializing]);

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
