// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvwO0SvrSF79spU8WAOAgqzVPDSdsjwRU",
  authDomain: "movie-app-f9e6b.firebaseapp.com",
  databaseURL: "https://movie-app-f9e6b-default-rtdb.firebaseio.com",
  projectId: "movie-app-f9e6b",
  storageBucket: "movie-app-f9e6b.appspot.com",
  messagingSenderId: "765739406670",
  appId: "1:765739406670:web:76fdff252660417ef37a1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);