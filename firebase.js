// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5isZ4nQY1WNtRZhP76l4mV0c8Ja7fgjc",
  authDomain: "strength-in-numbers-61c20.firebaseapp.com",
  databaseURL: "https://strength-in-numbers-61c20-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "strength-in-numbers-61c20",
  storageBucket: "strength-in-numbers-61c20.appspot.com",
  messagingSenderId: "1048768070970",
  appId: "1:1048768070970:web:c0c64c2a40e041203efc03",
  measurementId: "G-Z03RMREVPS"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}
const auth = firebase.auth();
export { auth };