"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store";
import {
  authStart,
  authSuccess,
  authFailure,
  authLogout,
  authSetUser,
} from "@/redux/actions/authActions";
import {
  onAuthChange,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout as firebaseLogout,
} from "@/firebase/auth";

export const useAuthentication = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        document.cookie = `auth-session=${user.uid}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      } else {
        document.cookie = "auth-session=; path=/; max-age=0";
      }
      dispatch(authSetUser(user));
    });
    return unsubscribe;
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    dispatch(authStart());
    try {
      const user = await loginWithEmail(email, password);
      if (user) {
        document.cookie = `auth-session=${user.uid}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        dispatch(authSuccess(user));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      dispatch(authFailure(message));
    }
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    dispatch(authStart());
    try {
      const user = await registerWithEmail(email, password, displayName);
      if (user) {
        document.cookie = `auth-session=${user.uid}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        dispatch(authSuccess(user));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      dispatch(authFailure(message));
    }
  };

  const signInWithGoogle = async () => {
    dispatch(authStart());
    try {
      const user = await loginWithGoogle();
      if (user) {
        document.cookie = `auth-session=${user.uid}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        dispatch(authSuccess(user));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign-in failed.";
      dispatch(authFailure(message));
    }
  };

  const logout = async () => {
    document.cookie = "auth-session=; path=/; max-age=0";
    await firebaseLogout();
    dispatch(authLogout());
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    signInWithGoogle,
    logout,
  };
};
