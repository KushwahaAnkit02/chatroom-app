import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBf4Bv7QZAleu-2hb6IQC7qkApuirXza4Q",
  authDomain: "chatroom-456a6.firebaseapp.com",
  databaseURL: "https://chatroom-456a6-default-rtdb.firebaseio.com",
  projectId: "chatroom-456a6",
  storageBucket: "chatroom-456a6.firebasestorage.app",
  messagingSenderId: "309895553949",
  appId: "1:309895553949:web:3a5b22b65a9c6acb54c574",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
