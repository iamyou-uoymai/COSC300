// Import the functions you need from the SDKs you need
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {auth, app, db} from "./app.js";

class Register {
    constructor() {
        this.$submitRegistrationButton = document.querySelector("#submit-registration");
         this.$registrationForm = document.querySelector("#registration-form");

        // digit counter 
         this.$digitCounter = document.getElementById('digit-counter');

         // password visibility function call 
         const passwordToggle = document.getElementById('password-toggle');
         const retypePasswordToggle = document.getElementById('retype-password-toggle');
         const passwordField = document.getElementById('register-password');
         const retypePasswordField = document.getElementById('retype-password');

         passwordToggle.addEventListener('click', () => {
              this.togglePasswordVisibility(passwordField, passwordToggle);
         });

          retypePasswordToggle.addEventListener('click', () => {
              this.togglePasswordVisibility(retypePasswordField, retypePasswordToggle);
           });
          
          document.getElementById('phone-number').addEventListener('input', (e) => {
            this.formatPhoneNumber(e);
               });
          
              this.addEventListeners();
            }
           
    updateDigitCounter(value) {
        const digitCount = value.replace(/\D/g, '').length;
        this.$digitCounter.textContent = `${digitCount}/9`;
        
       
        if (digitCount === 9) {
            this.$digitCounter.style.color = '#2ecc71'; 
        } else {
            this.$digitCounter.style.color = '#6c757d'; e
        }
    }
    // password visitility function 

    togglePasswordVisibility(field , toggle){
      if (field.type === 'password') {
      field.type = 'text';
      toggle.innerHTML = '<i class="far fa-eye-slash"></i>';
      } else {
      field.type = 'password';
      toggle.innerHTML = '<i class="far fa-eye"></i>';
       }
    }
    // fomarting the phone number 
     formatPhoneNumber(e) {
             //allow only numbers inputed
         let value = e.target.value.replace(/\D/g, '');

         // range restriction for digit size to be entered 
         if (value.length > 9 ) {
           value =value.substring(0, 9);
             }
         
             this.updateDigitCounter(value);
             let formattedValue = value;
         if(value.length > 6 ) {
             formattedValue = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
           } else if(value.length > 3 ) {
            formattedValue = value.substring(0, 3) + ' ' + value.substring(3);
           }
         e.target.value = formattedValue ; 
      }  
      
    addEventListeners() {

      document.querySelector('#register-name').addEventListener("blur", (e) => {
         this.validateName(e.target.value);
      });

      document.querySelector('#register-email').addEventListener("blur", (e) => {
         this.validateEmail(e.target.value);
      });
        
      document.querySelector("#phone-number").addEventListener("blur", (e) => {
         this.validatePhoneNumber(e.target.value);
      });

      document.querySelector("#register-password").addEventListener("blur", (e) => {
         this.validatePassword(e.target.value);
         this.validatePasswordMatch();
      });

      document.querySelector('#retype-password').addEventListener("blur", (e) => {
        this.validatePasswordMatch();
      });

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
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Update the user's profile with their name
                await updateProfile(user, { displayName: name });

                // Save user data to Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    displayName: name,
                    email: email,
                    phoneNumber: "+27" + phone,
                    emailVerified: false,
                    role: 'user',
                    createdAt: new Date(),
                    status: 'pending',
                    registrationMethod: 'email'
                });

                // Send email verification
                await sendEmailVerification(user, {
                    url: window.location.origin + '/index.html',
                    handleCodeInApp: true
                });

                alert("Your account has been created successfully! Please check your email to verify your account.");
                window.location.href = "login.html"; // Redirect to the login page
            } catch (error) {
                console.error("Error during registration:", error);
                alert(error.message || "An error occurred during registration.");
            }
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
        
        // Save user data to Firestore (using merge to avoid overwriting existing data)
        await setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          role: 'user',
          createdAt: new Date(),
          status: user.emailVerified ? 'active' : 'pending',
          registrationMethod: 'google'
        }, { merge: true });
        
        alert('Google sign-up successful!');
        window.location.href = 'login.html';
      } catch (error) {
        console.error('Google sign-up error:', error);
        alert(error.message || 'Google sign-up failed.');
      }
    });
  }
});