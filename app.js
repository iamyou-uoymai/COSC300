// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCrnnFOvQgkVnDhltaZxiH19PEECNUqd8",
  authDomain: "cosc300-project-latest.firebaseapp.com",
  projectId: "cosc300-project-latest",
  storageBucket: "cosc300-project-latest.firebasestorage.app",
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

//Export
export { app, auth };

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

    // this.renderArtifacts();
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

  renderArtifacts() {
    const gallery = document.getElementById("artifact-gallery");
    gallery.innerHTML = "";
    this.artifacts.forEach((artifact, index) => {
      const card = `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <img src="${artifact.image}" class="card-img-top" alt="Artifact Image">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${artifact.title}</h5>
              <p class="card-text">${artifact.description}</p>
              <button class="btn btn-primary mt-auto w-100" data-index="${index}">View in AR</button>
            </div>
          </div>
        </div>
      `;
      gallery.innerHTML += card;
    });
  }

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