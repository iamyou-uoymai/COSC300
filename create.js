// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

class Register {
    constructor() {
        this.$submitRegistrationButton = document.querySelector("#submit-registration");

        this.addEventListeners();
    }

    addEventListeners() {
        this.$submitRegistrationButton.addEventListener("click", async (event) => {
            event.preventDefault();

            // Get form values
            this.$RegisterName = document.querySelector("#register-name").value;
            this.$RegisterEmail = document.querySelector("#register-email").value;
            this.$RegisterPassword = document.querySelector("#register-password").value;
            this.$PhoneNumber = document.querySelector("#phone-number").value;

            // Validate input fields
            if (!this.$RegisterName || !this.$RegisterEmail || !this.$RegisterPassword || !this.$PhoneNumber) {
                alert("Please fill in all fields.");
                return;
            }

            try {
                // Create the user with email and password
                const userCredential = await createUserWithEmailAndPassword(auth, this.$RegisterEmail, this.$RegisterPassword);
                const user = userCredential.user;

                // Update the user's profile with their name
                await updateProfile(user, { displayName: this.$RegisterName });

                // Save additional user details to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    userId: user.uid,
                    name: this.$RegisterName,
                    email: this.$RegisterEmail,
                    phone: this.$PhoneNumber, // Save the phone number
                    timestamp: new Date()
                });

                alert("Your account has been created successfully!");
                window.location.href = "index.html"; // Redirect to the app page
            } catch (error) {
                console.error("Error during registration:", error);
                alert(error.message || "An error occurred during registration.");
            }
        });
    }
}

let register = new Register();