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

// Start AR Experience Button
document.getElementById("start-ar").addEventListener("click", function() {
  alert("AR will start here! (We'll integrate ARCore later)");
  // In the future, this will initialize ARCore
});

// Toggle Settings Panel
document.getElementById("settings-btn").addEventListener("click", function() {
  const panel = document.getElementById("settings-panel");
  panel.classList.toggle("d-none");
});

// Mock save functionality for the settings
document.querySelector("#settings-panel button").addEventListener("click", function() {
  alert("Settings saved! (Will connect to backend later)");
});

// Dark/Light Mode Toggle
document.getElementById("theme-toggle").addEventListener("click", function() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  
  const icon = this.querySelector("i");
  if (body.classList.contains("dark-mode")) {
    icon.classList.replace("bi-moon-fill", "bi-sun-fill");
    this.innerHTML = '<i class="bi bi-sun-fill"></i> Light Mode';
  } else {
    icon.classList.replace("bi-sun-fill", "bi-moon-fill");
    this.innerHTML = '<i class="bi bi-moon-fill"></i> Dark Mode';
  }
});

// Loading Spinner
document.getElementById("start-ar").addEventListener("click", function() {
  const arView = document.getElementById("ar-view");
  const loadingSpinner = document.getElementById("ar-loading");
  
  // Show loading spinner
  loadingSpinner.classList.remove("d-none");
  arView.querySelector("p").classList.add("d-none");
  
  // Simulate AR initialization (replace with ARCore later)
  setTimeout(() => {
    loadingSpinner.classList.add("d-none");
    arView.innerHTML = '<p class="text-success">AR Ready! Point camera at an artifact.</p>';
  }, 2000);
});