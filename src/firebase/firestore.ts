import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "./config";
import type { UserData } from "@/redux/types";

function ensureDb() {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firestore not available on server");
  return db;
}

export const createUserDocument = async (user: UserData) => {
  const db = ensureDb();
  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    ...user,
    preferences: {},
    savedCities: [],
    createdAt: new Date().toISOString(),
  });
  return ref;
};

export const getUserDocument = async (uid: string) => {
  const db = ensureDb();
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserData & { savedCities: string[]; preferences: Record<string, unknown> }) : null;
};

export const saveUserPreferences = async (
  uid: string,
  preferences: Record<string, unknown>
) => {
  const db = ensureDb();
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { preferences });
};

export const saveSavedCities = async (uid: string, cities: string[]) => {
  const db = ensureDb();
  const ref = doc(db, "users", uid);
  await setDoc(ref, { savedCities: cities }, { merge: true });
};

export const getSavedCities = async (uid: string) => {
  const db = ensureDb();
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data().savedCities as string[] | undefined) ?? [] : [];
};
