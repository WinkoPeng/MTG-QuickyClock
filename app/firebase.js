// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5__zMeXEsk4RxME0Fg46Sz7AhqZzA9qE",
  authDomain: "mtg-quickyclock.firebaseapp.com",
  projectId: "mtg-quickyclock",
  storageBucket: "mtg-quickyclock.appspot.com",
  messagingSenderId: "865821745601",
  appId: "1:865821745601:web:b01221defd23ac3d338f40",
  measurementId: "G-354QQE7L64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);