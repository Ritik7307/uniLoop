import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyDsNq7OcXqH_HzFttpJ-lRdIvS9Vy2HhSQ",
  authDomain: "uniloop-7378b.firebaseapp.com",
  projectId: "uniloop-7378b",
  storageBucket: "uniloop-7378b.firebasestorage.app",
  messagingSenderId: "146271328707",
  appId: "1:146271328707:web:fe718027d040927d700576"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
