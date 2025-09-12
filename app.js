// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCrnnFOvQgkVnDhltaZxiH19PEECNUqd8",
  authDomain: "cosc300-project-latest.firebaseapp.com",
  projectId: "cosc300-project-latest",
  storageBucket: "cosc300-project-latest.appspot.com", // <-- fixed here
  messagingSenderId: "149525486396",
  appId: "1:149525486396:web:5c7f6edd0d9c4d35619c39",
  measurementId: "G-D7HYG3SE2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);

// Initialize Firebase Auth
const auth = getAuth(app);
console.log(auth);

// Make auth available globally for the email verification guard
window.appAuth = auth;

// Initialize Firestore
const db = getFirestore(app);
console.log('Firestore initialized:', db);

// Export
export { app, auth, db };