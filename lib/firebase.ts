import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvMkofzTybS3Ssf9rNcqy_-Qw-2GgumVI",
  authDomain: "german-learning-os.firebaseapp.com",
  projectId: "german-learning-os",
  storageBucket: "german-learning-os.firebasestorage.app",
  messagingSenderId: "670312993369",
  appId: "1:670312993369:web:0f308b05b5991f2652d748"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);