import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function hasConfig(): boolean {
  return !!firebaseConfig.apiKey;
}

function getAppInstance(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!hasConfig()) return null;
  try {
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  } catch {
    return null;
  }
}

function getAuthInstance(): Auth | null {
  try {
    const app = getAppInstance();
    return app ? getAuth(app) : null;
  } catch {
    return null;
  }
}

function getDbInstance(): Firestore | null {
  try {
    const app = getAppInstance();
    return app ? getFirestore(app) : null;
  } catch {
    return null;
  }
}

export const getFirebaseApp = getAppInstance;
export const getFirebaseAuth = getAuthInstance;
export const getFirebaseDb = getDbInstance;

export const app = getAppInstance();
export const auth = getAuthInstance();
export const db = getDbInstance();
