// Import the functions you need from the SDKs you need
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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