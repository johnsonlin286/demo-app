// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyyx0dfhlbTxFUxPOS4-vnxSQKqB1ciuo",
  authDomain: "jlin-firebase.firebaseapp.com",
  databaseURL: "https://jlin-firebase.firebaseio.com",
  projectId: "jlin-firebase",
  storageBucket: "jlin-firebase.appspot.com",
  messagingSenderId: "917923038071",
  appId: "1:917923038071:web:495137eb3f41a2f8885772",
  measurementId: "G-TYB05HJH0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);