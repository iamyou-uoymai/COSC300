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

let checkAuth = new CheckAuth();


// class Augmented {
//   constructor() {
//     // UI Elements
//     this.$startAr = document.querySelector("#start-ar");
//     this.$settingsBtn = document.querySelector("#settings-btn");
//     this.$settingsPanelBtn = document.querySelector("#settings-panel button");
//     this.$themeToggle = document.querySelector("#theme-toggle");
//     this.$arView = document.querySelector("#ar-view");
//     this.$loadingSpinner = document.querySelector("#ar-loading");

//     // Device Detection
//     this.deviceType = this.detectDevice();
//     console.log("Running on device type:", this.deviceType);

//     this.addEventListeners();
//   }

//   detectDevice() {
//     const ua = navigator.userAgent.toLowerCase();
//     if (/huawei|honor/i.test(ua)) return 'huawei';
//     if (/sm-a127f/i.test(ua)) return 'a12'; // Galaxy A12 specific model
//     if (navigator.xr) return 'webxr';
//     return 'desktop';
//   }

//   addEventListeners() {
//     // Start AR Experience
//     this.$startAr.addEventListener("click", async () => {
//       this.$loadingSpinner.classList.remove("d-none");
//       this.$arView.querySelector("p")?.classList.add("d-none");

//       try {
//         switch(this.deviceType) {
//           case 'webxr':
//             await this.startWebXR();
//             break;
//           case 'huawei':
//           case 'a12':
//             await this.startMarkerAR();
//             break;
//           default:
//             this.startMockAR();
//         }
//       } catch (error) {
//         this.showError(error.message || "AR initialization failed");
//       } finally {
//         this.$loadingSpinner.classList.add("d-none");
//       }
//     });

//     // Existing UI Listeners
//     this.$settingsBtn.addEventListener("click", () => {
//       document.querySelector("#settings-panel").classList.toggle("d-none");
//     });

//     this.$settingsPanelBtn.addEventListener("click", () => {
//       alert("Settings saved! (Will connect to backend later)");
//     });

//     this.$themeToggle.addEventListener("click", () => {
//       document.body.classList.toggle("dark-mode");
//       const icon = this.$themeToggle.querySelector("i");
//       if(document.body.classList.contains("dark-mode")) {
//         icon.classList.replace("bi-moon-fill", "bi-sun-fill");
//         this.$themeToggle.innerHTML = `<i class="bi bi-sun-fill"></i> Light Mode`;
//       } else {
//         icon.classList.replace("bi-sun-fill", "bi-moon-fill");
//         this.$themeToggle.innerHTML = `<i class="bi bi-moon-fill"></i> Dark Mode`;
//       }
//     });
//   }

//   // WebXR Implementation (for supported devices)
//   async startWebXR() {
//     const session = await navigator.xr.requestSession("immersive-ar", {
//       requiredFeatures: ['hit-test']
//     });
    
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(70, this.$arView.clientWidth / this.$arView.clientHeight, 0.1, 1000);
    
//     const renderer = new THREE.WebGLRenderer({ alpha: true });
//     renderer.xr.enabled = true;
//     renderer.setSize(this.$arView.clientWidth, this.$arView.clientHeight);
//     this.$arView.appendChild(renderer.domElement);

//     // Add cube
//     const cube = new THREE.Mesh(
//       new THREE.BoxGeometry(0.1, 0.1, 0.1),
//       new THREE.MeshBasicMaterial({ color: 0x00ff00 })
//     );
//     scene.add(cube);

//     // Hit testing for surface detection
//     let hitTestSource;
//     session.addEventListener("select", (event) => {
//       if (hitTestSource) {
//         const hitPose = event.frame.getHitPose(hitTestSource);
//         if (hitPose) {
//           cube.position.set(
//             hitPose.transform.position.x,
//             hitPose.transform.position.y,
//             hitPose.transform.position.z
//           );
//         }
//       }
//     });

//     renderer.setAnimationLoop(() => {
//       cube.rotation.y += 0.01;
//       renderer.render(scene, camera);
//     });
//   }

//   // AR.js Marker Implementation (for Huawei/Galaxy A12)
//   async startMarkerAR() {
//     this.$arView.innerHTML = `
//       <a-scene embedded arjs="trackingMethod: best;">
//         <a-marker preset="hiro">
//           <a-box position="0 0.5 0" color="green"></a-box>
//         </a-marker>
//         <a-entity camera></a-entity>
//       </a-scene>
//       <p class="text-center mt-2">Point camera at <a href="https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg" target="_blank">Hiro Marker</a></p>
//     `;
//   }

//   // Desktop Mock Implementation
//   startMockAR() {
//     this.$arView.innerHTML = `
//       <div class="mock-ar-view">
//         <div class="mock-ar-cube"></div>
//         <p class="mock-ar-hint">Move device to explore artifact</p>
//       </div>
//       <style>
//         .mock-ar-view {
//           width: 100%;
//           height: 400px;
//           background: repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50%/40px 40px;
//           position: relative;
//           border-radius: 8px;
//         }
//         .mock-ar-cube {
//           width: 100px;
//           height: 100px;
//           background: #00ff00;
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           transform: translate(-50%, -50%);
//           animation: spin 2s linear infinite;
//         }
//         .mock-ar-hint {
//           position: absolute;
//           bottom: 20px;
//           left: 0;
//           right: 0;
//           text-align: center;
//           background: rgba(0,0,0,0.7);
//           color: white;
//           padding: 8px;
//           border-radius: 20px;
//           margin: 0 20px;
//         }
//         @keyframes spin {
//           100% { transform: translate(-50%, -50%) rotate(360deg); }
//         }
//         body.dark-mode .mock-ar-view {
//           background: repeating-conic-gradient(#555 0% 25%, #222 0% 50%) 50%/40px 40px;
//         }
//       </style>
//     `;
//   }

//   showError(message) {
//     const placeholder = this.$arView.querySelector("#ar-placeholder") || this.$arView;
//     placeholder.querySelector("p").textContent = message;
//     placeholder.querySelector("p").classList.remove("d-none");
//   }
// }

// // Initialize when DOM is ready
// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", () => new Augmented());
// } else {
//   new Augmented();
// }


class Artifact {
  constructor(title, image, description) {
    this.title = title;
    this.image = image;
    this.description = description;
  }
}

class AugmentedArtifacts {
  constructor() {
    this.allArtifacts = [
      new Artifact("Artifact Title 1", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 1."),
      new Artifact("Artifact Title 2", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 2."),
      new Artifact("Artifact Title 3", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 3."),
      new Artifact("Artifact Title 4", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 4."),
      new Artifact("Artifact Title 5", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 5.")
    ];
    this.filteredArtifacts = [...this.allArtifacts];

    this.$modal = new bootstrap.Modal(document.getElementById('artifactModal'));
    this.$modalTitle = document.getElementById("artifactModalLabel");
    this.$modalImage = document.getElementById("artifactImage");
    this.$modalDescription = document.getElementById("artifactDescription");

    this.$arView = document.getElementById("ar-view");
    this.$arLoading = document.getElementById("ar-loading");
    this.$arContent = document.getElementById("ar-content");

    this.$searchBar = document.getElementById("search-bar");

    this.renderArtifacts();
    this.addGeneralEventListeners();
  }

  addGeneralEventListeners() {
    document.getElementById("start-ar").addEventListener("click", () => this.startAR());
    this.$searchBar.addEventListener("input", () => this.filterArtifacts());
  }

  addCardEventListeners() {
    const buttons = document.querySelectorAll(".btn-primary[data-index]");
    buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => this.showArtifact(index));
    });
  }

  renderArtifacts() {
    const gallery = document.querySelector(".row");
    gallery.innerHTML = "";
    this.filteredArtifacts.forEach((artifact, index) => {
      const card = `
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${artifact.image}" class="card-img-top" alt="Artifact Image">
            <div class="card-body">
              <h5 class="card-title">${artifact.title}</h5>
              <p class="card-text">${artifact.description}</p>
              <button class="btn btn-primary w-100" data-index="${index}">View in AR</button>
            </div>
          </div>
        </div>
      `;
      gallery.innerHTML += card;
    });

    this.addCardEventListeners();
  }

  filterArtifacts() {
    const query = this.$searchBar.value.toLowerCase();
    this.filteredArtifacts = this.allArtifacts.filter(artifact =>
      artifact.title.toLowerCase().includes(query)
    );
    this.renderArtifacts();
  }

  showArtifact(index) {
    const artifact = this.filteredArtifacts[index];
    if (!artifact) return;

    this.$modalTitle.textContent = artifact.title;
    this.$modalImage.src = artifact.image;
    this.$modalDescription.textContent = artifact.description;
    this.$modal.show();
  }

  startAR() {
    document.getElementById("start-ar").classList.add("d-none");
    this.$arView.classList.remove("d-none");

    setTimeout(() => {
      this.$arLoading.classList.add("d-none");
      this.$arContent.classList.remove("d-none");
    }, 2000);
  }
}

// Initialize after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new AugmentedArtifacts();
});
