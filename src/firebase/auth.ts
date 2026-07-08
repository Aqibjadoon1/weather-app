import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";
import type { UserData } from "@/redux/types";

const mapFirebaseUser = (user: User): UserData => ({
  uid: user.uid,
  email: user.email ?? "",
  displayName: user.displayName ?? "",
  photoURL: user.photoURL ?? "",
});

export const onAuthChange = (callback: (user: UserData | null) => void) => {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    callback(user ? mapFirebaseUser(user) : null);
  });
};

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not available on server");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (cred.user) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user ? mapFirebaseUser(cred.user) : null;
};

export const loginWithEmail = async (email: string, password: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not available on server");
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user ? mapFirebaseUser(cred.user) : null;
};

export const loginWithGoogle = async () => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not available on server");
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user ? mapFirebaseUser(cred.user) : null;
};

export const logout = () => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not available on server");
  return signOut(auth);
};

export const resetPassword = (email: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase not available on server");
  return sendPasswordResetEmail(auth, email);
};

export { getFirebaseAuth };
