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
            await this.handleRegistration();
        });
      }

      validateName(name) {
        const input = document.querySelector("#register-name");
        const validPattern = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

        if (!name) {
        this.showValidation(input, false);
         return false;
         }
    
        if (!validPattern.test(name)) {
           this.showValidation(input, false);
            return false;
         }
    
         if (name.length < 2) {
          this.showValidation(input, false);
          return false;
         }
    
      this.showValidation(input, true);
      return true;
    }
      
   validateEmail(email) {
     const input = document.querySelector("#register-email");
    
    if (!email) {
      this.showValidation(input, false);
      return false;
    }
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    if (!emailRegex.test(email)) {
      this.showValidation(input, false);
      return false;
    }
    
    this.showValidation(input, true);
    return true;
  }
    validatePhoneNumber(phone) {
      const input = document.querySelector("#phone-number");

      //disable the space between digits 
      const cleanPhone = phone.replace(/\s/g, '')

      if (!cleanPhone) {
      this.showValidation(input, false);
      return false;
      }

      //enforce the the function to restrict number of digits intake after +27 
       if (cleanPhone.length !== 9) {
         this.showValidation(input, false, );
         return false;
        }

        // make sure that the phone number begin with either 6 / 7 / 8 for valid SAs starndard 
         if (!/^[678]/.test(cleanPhone)) {
            this.showValidation(input, false );
           return false;
          }

         this.showValidation(input, true);
         return true;
      }
   
   // password restriction function
   validatePassword(password) {
       const input = document.querySelector("#register-password");
          
         if (!password) {
         this.showValidation(input, false);
         return false;
        }

        const requirements = {
          length: /.{6,}/,
          upper: /[A-Z]/,
          lower: /[a-z]/,
          digit: /[0-9]/,
          special: /[^A-Za-z0-9]/ 
         };

          let isValid = true;
      
          for (const  regex of Object.entries(requirements)) {
            if (regex.test(password)) {
                  isValid = false;
                  break;
               }  
            }

        if (!isValid) {
          this.showValidation(input,  false);
          return false;
         }

         this.showValidation(input, true,);
         return true;
      } 
      // cheek if the password match

       validatePasswordMatch() {
        const password = document.querySelector("#register-password").value;
        const retypePassword = document.querySelector("#retype-password").value;
        const input = document.querySelector("#retype-password");

         if (!retypePassword) {
          this.showValidation(input, false);
          return false;
         }

        if (password !== retypePassword) {
          this.showValidation(input,  false)
         }

        this.showValidation(input, true);
        return true;
    }

    // feedback 
    showValidation(input, isValid) {
      if (isValid) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      }
    }
     //  error messages for alerts user with  invalid entry on specifif field
    getFieldErrorMessage(fieldName, value) {
        switch(fieldName) {
            case 'name':
                if (!value) return "Name is required";
                if (!/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(value)) 
                    return "Name contains invalid characters( No symbols/ number form part of Name), only letters acceptable ";
                if (value.length < 2) return "Name is too short";
                break;
                
            case 'email':
                if (!value) return "Email is required";
                if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) 
                    return "Please enter a valid email address";
                break;
                
            case 'phone':
                const cleanPhone = value.replace(/\s/g, '');
                if (!cleanPhone) return "Phone number is required";
                if (cleanPhone.length !== 9) return "contains only 9 digits after +27 , begiining with either 6 , 7 or 8";
                if (!/^[678]/.test(cleanPhone)) return "Please enter a valid South African mobile number";
                break;
                
            case 'password':
                if (!value) return "Password is required";
                return "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, one digit, and one special character";
                
            case 'retypePassword':
                if (!value) return "Please confirm your password";
                return "Passwords do not match";
        }
        return "";
    }
    
    // function for evaluating invalid entry after inputs
    async handleRegistration() {
        const name = document.querySelector("#register-name").value;
        const email = document.querySelector("#register-email").value;
        const phone = document.querySelector("#phone-number").value.replace(/\s/g, '');
        const password = document.querySelector("#register-password").value;
        const retypePassword = document.querySelector("#retype-password").value;

        const isNameValid = this.validateName(name);
        const isEmailValid = this.validateEmail(email);
        const isPhoneValid = this.validatePhoneNumber(phone);
        const isPasswordValid = this.validatePassword(password);
        const isPasswordMatchValid = this.validatePasswordMatch();
       
      const errors = [];
        if (!isNameValid) errors.push(this.getFieldErrorMessage('name', name));
        if (!isEmailValid) errors.push(this.getFieldErrorMessage('email', email));
        if (!isPhoneValid) errors.push(this.getFieldErrorMessage('phone', phone));
        if (!isPasswordValid) errors.push(this.getFieldErrorMessage('password', password));
        if (!isPasswordMatchValid) errors.push(this.getFieldErrorMessage('retypePassword', retypePassword));

      // Filter out empty error messages and show alert if there are errors
        const filteredErrors = errors.filter(error => error !== "");
        
        if (filteredErrors.length > 0) {
            alert("Please correct the following errors:\n\n" + filteredErrors.join("\n• "));
            return;
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