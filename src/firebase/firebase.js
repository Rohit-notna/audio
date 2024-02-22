
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-A06ud0z-nJCPgNiERUuxvAlWk7EJiDc",
  authDomain: "auction-dd183.firebaseapp.com",
  projectId: "auction-dd183",
  storageBucket: "auction-dd183.appspot.com",
  messagingSenderId: "716286692822",
  appId: "1:716286692822:web:14ee6a37ac996f5271e877",
  measurementId: "G-WNDFV4K36D"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
const auth = getAuth(app);