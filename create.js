// Import the functions you need from the SDKs you need
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {auth, app} from "./app.js";

class Register {
    constructor() {
        this.$submitRegistrationButton = document.querySelector("#submit-registration");

        this.addEventListeners();
    }

    addEventListeners() {
        this.$submitRegistrationButton.addEventListener("click", async (event) => {
            event.preventDefault();

            // Get form values
            this
            this.$RegisterEmail = document.querySelector("#register-email").value;
            this.$RegisterPassword = document.querySelector("#register-password").value;
            this.$RetypePassword = document.querySelector("#retype-password").value;
            this.$PhoneNumber = document.querySelector("#phone-number").value;

            // Validate input fields
            if (!this.$RegisterName || !this.$RegisterEmail || !this.$RegisterPassword || !this.$RetypePassword || !this.$PhoneNumber) {
                alert("Please fill in all fields.");
                return;
            }

            // Check if passwords match
            if (this.$RegisterPassword !== this.$RetypePassword) {
                alert("Passwords do not match. Please retype your password.");
                return;
            }

            // Password requirements logic
            const password = this.$RegisterPassword;
            const requirements = [
              { test: /.{6,}/, message: "Password must be at least 6 characters long." },
              { test: /[A-Z]/, message: "Password must contain at least one uppercase letter." },
              { test: /[a-z]/, message: "Password must contain at least one lowercase letter." },
              { test: /[0-9]/, message: "Password must contain at least one digit." },
              { test: /[^A-Za-z0-9]/, message: "Password must contain at least one special character." }
            ];
            
            for (const req of requirements) {
              if (!req.test.test(password)) {
                alert(req.message);
                return;
              }
            }

            try {
                // Create the user with email and password
                const userCredential = await createUserWithEmailAndPassword(auth, this.$RegisterEmail, this.$RegisterPassword);
                const user = userCredential.user;

                // Update the user's profile with their name
                await updateProfile(user, { displayName: this.$RegisterName });

                /*// Save additional user details to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    userId: user.uid,
                    name: this.$RegisterName,
                    email: this.$RegisterEmail,
                    phone: this.$PhoneNumber, // Save the phone number
                    timestamp: new Date()
                });*/

                alert("Your account has been created successfully!");
                window.location.href = "login.html"; // Redirect to the login page
            } catch (error) {
                console.error("Error during registration:", error);
                alert(error.message || "An error occurred during registration.");
            }
        });
    }
}

let register = new Register();

// Google sign-up logic
document.addEventListener('DOMContentLoaded', () => {
  const googleBtn = document.getElementById('google-signup');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        alert('Google sign-up successful!');
        window.location.href = 'login.html';
      } catch (error) {
        console.error('Google sign-up error:', error);
        alert(error.message || 'Google sign-up failed.');
      }
    });
  }
});