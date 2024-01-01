
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  query,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBN_7ETQNDk_tfdoEOWbuUgUNQcylUf1Ew",
    authDomain: "social-media-app-67c6c.firebaseapp.com",
    projectId: "social-media-app-67c6c",
    storageBucket: "social-media-app-67c6c.appspot.com",
    messagingSenderId: "540460296890",
    appId: "1:540460296890:web:57b9ead047e37123d7b083"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const db = getFirestore(app);
  export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    db,
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    getDocs,
    query,
    deleteDoc
  };


