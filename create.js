// Import the functions you need from the SDKs you need
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
            this.$RegisterName = document.querySelector("#register-name").value; // <-- Add this line
            this.$RegisterEmail = document.querySelector("#register-email").value;
            this.$RegisterPassword = document.querySelector("#register-password").value;
            this.$RetypePassword = document.querySelector("#retype-password").value;
            this.$PhoneNumber = document.querySelector("#phone-number").value;

            // Validate input fields
            if (!this.$RegisterName || !this.$RegisterEmail || !this.$RegisterPassword || !this.$RetypePassword || !this.$PhoneNumber) {
                alert("Please fill in all fields.");
                return;
            }

            // Phone number validation
            const phonePattern = /^(07|08|06)\d{8}$/;
            if (!phonePattern.test(this.$PhoneNumber)) {
                alert("Phone number must be 10 digits and start with 07, 08, or 06.");
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

                // Send email verification
                await sendEmailVerification(user);

                alert("Your account has been created successfully! Please check your email to verify your account.");
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