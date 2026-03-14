import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrUemYG6utdNkgMpI4auhDJhdChwUvtjs",
  authDomain: "academic-risk-analyzer-17bfa.firebaseapp.com",
  projectId: "academic-risk-analyzer-17bfa",
  storageBucket: "academic-risk-analyzer-17bfa.firebasestorage.app",
  messagingSenderId: "417603369505",
  appId: "1:417603369505:web:4a0d95a810923840a18160",
  measurementId: "G-LN8NCBBF1P"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();