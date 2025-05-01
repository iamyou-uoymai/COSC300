// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBkGFjdhNVG7wNWRQLjhC8q7qCXBZrw_4",
  authDomain: "museumar-2ce3e.firebaseapp.com",
  projectId: "museumar-2ce3e",
  storageBucket: "museumar-2ce3e.firebasestorage.app",
  messagingSenderId: "337419214136",
  appId: "1:337419214136:web:a09b8faf7f79ba382375cd"
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

class Artifact {
  constructor(title, image, description) {
    this.title = title;
    this.image = image;
    this.description = description;
  }
}

class AugmentedArtifacts {
  constructor() {
    this.originalArtifacts = [
      new Artifact("Artifact Title 1", "face.png", "This is a detailed description of Artifact 1."),
      new Artifact("Artifact Title 2", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 2."),
      new Artifact("Artifact Title 3", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 3."),
      new Artifact("Artifact Title 4", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 4."),
      new Artifact("Artifact Title 5", "https://via.placeholder.com/600x300", "This is a detailed description of Artifact 5.")
    ];

    this.artifacts = [...this.originalArtifacts];

    this.$modal = new bootstrap.Modal(document.getElementById('artifactModal'));
    this.$modalTitle = document.getElementById("artifactModalLabel");
    this.$modalImage = document.getElementById("artifactImage");
    this.$modalDescription = document.getElementById("artifactDescription");

    this.$arView = document.getElementById("ar-view");
    this.$arLoading = document.getElementById("ar-loading");
    this.$arContent = document.getElementById("ar-content");

    this.$searchBar = document.getElementById("search-bar");
    this.$settingsBtn = document.getElementById("settings-btn");
    this.$settingsPanelBtn = document.querySelector("#settings-panel button");

    this.renderArtifacts();
    this.addEventListeners();
  }

  addEventListeners() {
    this.$settingsBtn.addEventListener("click", (event) => {
      const panel = document.getElementById("settings-panel");
      panel.classList.toggle("d-none");
    });

    document.getElementById("start-ar").addEventListener("click", () => this.startAR());
    this.$searchBar.addEventListener("input", () => this.filterArtifacts());
    document.getElementById("artifact-gallery").addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-primary")) {
        const index = e.target.getAttribute("data-index");
        this.showArtifact(parseInt(index));
      }
    });
  }

  // renderArtifacts() {
  //   const gallery = document.getElementById("artifact-gallery");
  //   gallery.innerHTML = "";
  //   this.artifacts.forEach((artifact, index) => {
  //     const card = `
  //       <div class="col-md-4 mb-4">
  //         <div class="card h-100">
  //           <img src="${artifact.image}" class="card-img-top" alt="Artifact Image">
  //           <div class="card-body d-flex flex-column">
  //             <h5 class="card-title">${artifact.title}</h5>
  //             <p class="card-text">${artifact.description}</p>
  //             <button class="btn btn-primary mt-auto w-100" data-index="${index}">View in AR</button>
  //           </div>
  //         </div>
  //       </div>
  //     `;
  //     gallery.innerHTML += card;
  //   });
  // }

  filterArtifacts() {
    const query = this.$searchBar.value.toLowerCase();
    this.artifacts = this.originalArtifacts.filter(artifact =>
      artifact.title.toLowerCase().includes(query)
    );
    this.renderArtifacts();
  }

  showArtifact(index) {
    const artifact = this.artifacts[index];
    if (!artifact) return;
    this.$modalTitle.textContent = artifact.title;
    this.$modalImage.src = artifact.image;
    this.$modalDescription.textContent = artifact.description;
    this.$modal.show();
  }

  startAR() {
    document.getElementById("start-ar").classList.add("d-none");
    this.$arView.style.display = "block";
    setTimeout(() => {
      this.$arLoading.classList.add("d-none");
      this.$arContent.classList.remove("d-none");
    }, 2000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AugmentedArtifacts();
});