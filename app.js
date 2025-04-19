// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// // TODO: Add SDKs for Firebase products that you want to use
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
// import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAyY0zykCHbjDwrq_8RwE-DLsWJYC21GmE",
//     authDomain: "cosc300-17c66.firebaseapp.com",
//     projectId: "cosc300-17c66",
//     storageBucket: "cosc300-17c66.firebasestorage.app",
//     messagingSenderId: "444715025539",
//     appId: "1:444715025539:web:633ef8a5c41a3ab91987b6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// console.log(app);

// // Initialize Firebase Auth
// const auth = getAuth(app);
// console.log(auth);

// // Firebase Firestore
// // Initialize Firestore
// const db = getFirestore(app);
// console.log(db);

// class CheckAuth{
//     constructor(){

//         this.addEventListeners();
//         this.handleAuthentication();
//     }

//     addEventListeners(){

//     }

//     handleLogOut() {
//         signOut(auth)
//           .then(() => {
//             // Sign-out successful.
//             window.location.href = "login.html";
//         })
//           .catch((error) => {
//             // An error happened.
//             alert(error);
//           });
//       }

//     handleAuthentication() {
//         onAuthStateChanged(auth, (user) => {
//             const currentPage = window.location.pathname.split("/").pop(); // Get the current page filename

//           if (user) {
//             // User is signed in
//             if(currentPage !== "app.html"){
//                 window.location.href = "app.html";
//             }
//         } else {
//             // User is signed out
//             if(currentPage !=="create.html"){
//                 window.location.href = "create.html";
//             }
//         }
//         });
//       }
// }

// let checkAuth = new CheckAuth();


