"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/reducers/rootReducer";
import type { AppDispatch } from "@/redux/store";
import {
  authStart,
  authSuccess,
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
      dispatch(authSetUser(user));
    });
    return unsubscribe;
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    dispatch(authStart());
    try {
      const user = await loginWithEmail(email, password);
      if (user) dispatch(authSuccess(user));
    } catch (err) {
      dispatch(authLogout());
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
      if (user) dispatch(authSuccess(user));
    } catch (err) {
      dispatch(authLogout());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(authStart());
    try {
      const user = await loginWithGoogle();
      if (user) dispatch(authSuccess(user));
    } catch (err) {
      dispatch(authLogout());
    }
  };

  const logout = async () => {
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
