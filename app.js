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
  constructor(){    
    this.$startAr = document.querySelector("#start-ar");
    this.$settingsBtn = document.querySelector("#settings-btn");
    this.$settingsPanelBtn = document.querySelector("#settings-panel button");
    this.$themeToggle = document.querySelector("#theme-toggle");

    this.addEventListeners();
  }

  addEventListeners(){
    // Start AR
  // Start AR (Modified for WebXR)
  this.$startAr.addEventListener("click", async (event) => {
    const arView = document.querySelector("#ar-view");
    const loadingSpinner = document.querySelector("#ar-loading");

    loadingSpinner.classList.remove("d-none");
    arView.querySelector("p").classList.add("d-none");

    try {
      if (!navigator.xr) throw new Error("WebXR not supported. Try Chrome on Android.");
      
      const session = await navigator.xr.requestSession("immersive-ar");
      loadingSpinner.classList.add("d-none");
      
      // Clear placeholder but keep structure
      const placeholder = document.querySelector("#ar-placeholder");
      placeholder.querySelector("p").classList.add("d-none");
      
      this.initARScene(session, arView);
    } catch (error) {
      loadingSpinner.classList.add("d-none");
      arView.querySelector("#ar-placeholder p").textContent = error.message;
      arView.querySelector("#ar-placeholder p").classList.remove("d-none");
    }
  });

    // Toggle Settings Panel
    this.$settingsBtn.addEventListener("click", (event) =>{
      const panel = document.querySelector("#settings-panel");
      panel.classList.toggle("d-none");
    });

    // save functionality for the settings
    this.$settingsPanelBtn.addEventListener("click", (event) =>{
      alert("Settings saved! (Will connect to backend later");
    });

    // Dark/Light Mode Toggle
    this.$themeToggle.addEventListener("click", (event) =>{
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


  // ONLY UPDATED THIS METHOD (preserved all your other code):
  initARScene(session, arViewElement) {
    // 1. Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70, 
      arViewElement.clientWidth / arViewElement.clientHeight, 
      0.1, 
      1000
    );
    
    // 2. Configure renderer for AR
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(arViewElement.clientWidth, arViewElement.clientHeight);
    renderer.xr.enabled = true;
    renderer.xr.setSession(session);
    
    // 3. Add to DOM (preserving your structure)
    const placeholder = document.querySelector("#ar-placeholder");
    placeholder.appendChild(renderer.domElement);

    // 4. Add cube (same as your original)
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    scene.add(cube);
    camera.position.z = 0.5;

    // 5. Animation loop (modified for WebXR)
    renderer.setAnimationLoop(() => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    });

    // 6. Handle resizing (new but essential)
    window.addEventListener('resize', () => {
      camera.aspect = arViewElement.clientWidth / arViewElement.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(arViewElement.clientWidth, arViewElement.clientHeight);
    });
  }
}

let augmented = new Augmented();