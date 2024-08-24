import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcXEe6kFGYdZGT7F1cAeEi_X-y6AHdRPU",
  authDomain: "harts-quiz-app.firebaseapp.com",
  projectId: "harts-quiz-app",
  storageBucket: "harts-quiz-app.appspot.com",
  messagingSenderId: "1047645944993",
  appId: "1:1047645944993:web:de9a9e4fbf1ffef58984e0",
  measurementId: "G-PDN22LL2GZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);