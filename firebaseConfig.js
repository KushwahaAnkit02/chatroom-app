// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBYKF0DjnQ5W1x0k6Pn_Otg6KJPS7ljpdE",
  authDomain: "chatroom-65b43.firebaseapp.com",
  projectId: "chatroom-65b43",
  storageBucket: "chatroom-65b43.firebasestorage.app",
  messagingSenderId: "261657107438",
  appId: "1:261657107438:web:70a2156c97705ecad20cff",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
