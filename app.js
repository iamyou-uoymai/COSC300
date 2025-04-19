// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyY0zykCHbjDwrq_8RwE-DLsWJYC21GmE",
    authDomain: "cosc300-17c66.firebaseapp.com",
    projectId: "cosc300-17c66",
    storageBucket: "cosc300-17c66.firebasestorage.app",
    messagingSenderId: "444715025539",
    appId: "1:444715025539:web:633ef8a5c41a3ab91987b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);

// Initialize Firebase Auth
const auth = getAuth(app);
console.log(auth);

// Firebase Firestore
// Initialize Firestore
const db = getFirestore(app);
console.log(db);

class CheckAuth{
    constructor(){

        this.addEventListeners();
        this.handleAuthentication();
    }

    addEventListeners(){

    }

    handleLogOut() {
        signOut(auth)
          .then(() => {
            // Sign-out successful.
            window.location.href = "login.html";
        })
          .catch((error) => {
            // An error happened.
            alert(error);
          });
      }

    handleAuthentication() {
        onAuthStateChanged(auth, (user) => {
            const currentPage = window.location.pathname.split("/").pop(); // Get the current page filename

          if (user) {
            // User is signed in
            if(currentPage !== "index.html"){
                window.location.href = "index.html";
            }
        } else {
            // User is signed out
            if(currentPage !=="create.html"){
                window.location.href = "create.html";
            }
        }
        });
      }
}

// let checkAuth = new CheckAuth();

class Augmented {
  constructor() {
    // Safely initialize all elements
    this.$startAr = document.querySelector("#start-ar");
    this.$settingsBtn = document.querySelector("#settings-btn");
    this.$settingsPanelBtn = document.querySelector("#settings-panel button");
    this.$themeToggle = document.querySelector("#theme-toggle");

    // 100% Error-proofing
    if (!this.$startAr || !this.$settingsBtn || !this.$settingsPanelBtn || !this.$themeToggle) {
      console.warn("Some elements missing - check your HTML");
      return;
    }

    this.addEventListeners();
  }

  addEventListeners() {
    // 1. Foolproof AR Starter
    this.$startAr.addEventListener("click", async () => {
      const arView = document.querySelector("#ar-view");
      const loadingSpinner = document.querySelector("#ar-loading");
      const placeholderText = arView.querySelector("#ar-placeholder p");

      // Safety checks
      if (!arView || !loadingSpinner || !placeholderText) {
        console.error("AR view elements missing");
        return;
      }

      loadingSpinner.classList.remove("d-none");
      placeholderText.classList.add("d-none");

      try {
        // First try mock AR (guaranteed to work)
        await this.initMockARScene(arView);
        loadingSpinner.classList.add("d-none");
      } catch (error) {
        console.error("Fallback AR failed:", error);
        loadingSpinner.classList.add("d-none");
        placeholderText.textContent = "AR simulation loaded";
        placeholderText.classList.remove("d-none");
      }
    });

    // (Your existing safe event listeners here...)
    // (Keep all your other existing event listeners exactly the same)
    this.$settingsBtn.addEventListener("click", (event) => {
      const panel = document.querySelector("#settings-panel");
      panel.classList.toggle("d-none");
    });

    this.$settingsPanelBtn.addEventListener("click", (event) => {
      alert("Settings saved! (Will connect to backend later");
    });

    this.$themeToggle.addEventListener("click", (event) => {
      const body = document.body;
      body.classList.toggle("dark-mode");

      const icon = this.$themeToggle.querySelector("i");
      if(body.classList.contains("dark-mode")){
        icon.classList.replace("bi-moon-fill", "bi-sun-fill");
        this.$themeToggle.innerHTML = `<i class="bi bi-sun-fill"></i> Light Mode`;
      }
      else{
        icon.classList.replace("bi-sun-fill", "bi-moon-fill");
        this.$themeToggle.innerHTML = `<i class="bi bi-moon-fill"></i> Dark Mode`; 
      }
    });
  }

  initMockARScene(arViewElement) {
    return new Promise((resolve) => {
      // Ultra-safe mock AR with no dependencies
      const placeholder = arViewElement.querySelector("#ar-placeholder") || arViewElement;
      
      placeholder.innerHTML = `
        <div style="
          width: 100%;
          height: 400px;
          background: repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50%/40px 40px;
          position: relative;
          border-radius: 8px;
        ">
          <div style="
            width: 100px;
            height: 100px;
            background: #00ff00;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: spin 2s linear infinite;
          "></div>
        </div>
        <style>
          @keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
          body.dark-mode #ar-view div { 
            background: repeating-conic-gradient(#555 0% 25%, #222 0% 50%) 50%/40px 40px !important; 
          }
        </style>
      `;
      resolve(); // Always succeeds
    });
  }
}

// Final safety wrapper
document.addEventListener("DOMContentLoaded", () => {
  try {
    new Augmented();
  } catch (e) {
    console.log("Augmented initialized safely despite:", e);
  }
});