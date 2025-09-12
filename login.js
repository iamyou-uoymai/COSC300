import { auth } from "./app.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

class Login {
    constructor() {

        this.$submitLogin = document.querySelector("#submit-login");
        this.$loginForm = document.querySelector("#login-form");
        this.$spinnerOverlay = document.querySelector("#spinner-overlay");

        this.addEventListeners();
        this.setupPasswordToggle();
        this.checkRememberMeStatus();
    }

    addEventListeners() {
        this.$loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            await this.handleLogin();
        });
            //add google sign in listener
            const googleBtn = document.getElementById('google-signin');
            if(googleBtn){
                googleBtn.addEventListener('click', () => {
                    this.handleGoogleSignIn();
                });
            }
        }

        async handleLogin() {
               console.log('🔍 Login attempt started');
               this.showLoading();

            const email = document.querySelector("#login-email").value;
            const password = document.querySelector("#login-password").value;

            console.log('📧 Email:', email);
            console.log('🔒 Password length:', password ? password.length : 0);

            // validate email format 
            if (!this.isValidEmail(email)){
                console.log('❌ Invalid email format');
                this.showErrorMessage("Please enter a valid email address.", "email");
                this.hideLoading();
                return;
            }
            if ( !password) {
                console.log('❌ No password provided');
                this.showErrorMessage("Please Enter your password.", "password");
                this.hideLoading();
                return;
            }

            try {
                console.log('🔄 Attempting Firebase authentication...');
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('✅ Firebase authentication successful:', user.email);
                //store the email in the local storage when the remember me if checked 
                if (document.getElementById('rememberMe').checked){
                    localStorage.setItem('rememberedEmail', email);
                }else{ 
                    localStorage.removeItem('rememberedEmail');
                }

                this.saveRememberMePreference();
                // Check if email is verified
                if (!user.emailVerified) {
                    this.hideLoading();
                    this.showEmailVerificationModal(user);
                    return;
                }
                
                // Check if user is admin and redirect accordingly
                sessionStorage.setItem('justLoggedIn', 'true');
                if (this.isAdmin(user)) {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "index.html";
                }
                // verify if all the field are filled with the correct format and return feedback is error encountered 
            } catch (error) {
                console.error('❌ Login error:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                const friendlyMessage = this.getFriendlyErrorMessage(error.code);
              this.showErrorMessage(friendlyMessage);
               this.hideLoading();
            }
        }
        async handleGoogleSignIn(){
            this.showLoading();
            const provider = new GoogleAuthProvider();

            try {

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user.emailVerified){
                this.hideLoading();
                this.showEmailVerificationModal(user);
                return;
            }
            if(this.isAdmin(user)){
                window.location.href ="admin.html";
            } else {
                window.location.href ="index.html";
            }
            } catch (error) {
            console.error('Google sign-in error:', error);
            const friendlyMessage = this.getFriendlyErrorMessage(error.code);
            this.showErrorMessage(friendlyMessage || 'Google sign-in failed.');
            this.hideLoading();
            }
        }
    
         // function for error handling 
         getFriendlyErrorMessage(errorCode){
             switch (errorCode) {
                case 'auth/invalid-email':
                    return 'The Email address is not properly formatted.';

                case 'auth/user-disabled':
                    return 'This user account has been disabled';

                case 'auth/user-not-found':
                    return 'No account found with this email address';

                case 'auth/wrong-password':
                    return 'Incorrect Password. Please try again...';

                case 'auth/too-many-requests':
                    return 'Too many failed attempts.Please try again later.';
                
                case 'auth/popup-closed-by-user':
                    return 'Sign-in was Cancelled.';
                default:
                    return 'An error occurred when Login . Please verify ur credential and try again .';
             }

         }
          // Email validation
          isValidEmail(email){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
          }
       // function for error display message 
         showErrorMessage(message,field = null){
            this.removeExistingMessages();

            if (field === 'email'){
                document.getElementById('login-email').classList.add('is-invalid');
            }else if(field === 'password') {
                document.getElementById('login-password').classList.add('is-invalid');
            }

            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3';
            errorDiv.setAttribute('role', 'alert');
            errorDiv.innerHTML =   `<i class="fas fa-exclamation-circle me-2"></i> ${message} `;

            const form = document.querySelector('form');
            form.parentNode.insertBefore(errorDiv, form.nextSibling);

            setTimeout(() => {
                if(errorDiv.parentNode){
                    errorDiv.parentNode.removeChild(errorDiv);
                }

            document.getElementById('login-email').classList.remove('is-invalid');
            document.getElementById('login-password').classList.remove('is-invalid');
            },5000);
         }

        removeExistingMessages() {
         const existingErrors =document.querySelectorAll('.alert-danger');
          existingErrors.forEach(error => error.remove());
      }
         
    setupPasswordToggle(){
       const passwordToggle =document.getElementById('password-toggle');
       const passwordInput = document.getElementById('login-password');

       if (passwordToggle && passwordInput){
               passwordToggle.addEventListener('click', function() {
                     
                   if (passwordInput.type === 'password'){
                        passwordInput.type = 'text';
                        passwordToggle.innerHTML = '<i class="far fa-eye-slash"></i>';
                        passwordToggle.setAttribute( 'aria-label', 'Hide password');
                        passwordToggle.classList.add('active');
                   }else {
                       
                        passwordInput.type = 'password';
                        passwordToggle.innerHTML = '<i class="far fa-eye"></i>';
                        passwordToggle.setAttribute('aria-label', 'Show password');
                        passwordToggle.classList.remove('active');
                   }
                   
               });
       }
    }
         // loading spinner function 
      showLoading(){
            this.$submitLogin.classList.add('loading');
            this.$submitLogin.disabled = true; 

            if(this.$spinnerOverlay) this.$spinnerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
              // disable other interactive features during loading
              const googleBtn = document.getElementById('google-signin');
              if (googleBtn) googleBtn.disabled = true;
               }

           hideLoading() {
            this.$submitLogin.classList.remove('loading');
            this.$submitLogin.disabled = false;

            if (this.$spinnerOverlay) this.$spinnerOverlay.classList.remove('active');
            document.body.style.overflow = '';

             // Enable the operation of other button fixed 
              const googleBtn = document.getElementById('google-signin');
              if (googleBtn) googleBtn.disabled = false;
            }


    // Check if user is admin
    isAdmin(user) {
        const ADMIN_DOMAINS = [
            'myturf.ul.ac.za',
            'ul.ac.za'
        ];
        
        const userEmail = user.email.toLowerCase();
        
        // Check admin domains
        const emailDomain = userEmail.split('@')[1];
        return emailDomain && ADMIN_DOMAINS.includes(emailDomain);
    }

    // Show email verification modal
    showEmailVerificationModal(user) {
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="emailVerificationModal" tabindex="-1" aria-labelledby="emailVerificationModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header border-secondary">
                            <h5 class="modal-title" id="emailVerificationModalLabel">
                                <i class="fas fa-envelope-open-text me-2"></i>Email Verification Required
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-3">
                                <div class="alert alert-warning" role="alert">
                                    <i class="fas fa-exclamation-triangle me-2"></i>
                                    Please verify your email address before logging in.
                                </div>
                            </div>
                            <p>We've sent a verification email to:</p>
                            <p class="fw-bold text-primary">${user.email}</p>
                            <p>Please check your inbox and click the verification link. Don't forget to check your spam folder!</p>
                            <div class="d-grid gap-2">
                                <button type="button" class="btn btn-primary" id="resendVerificationBtn">
                                    <i class="fas fa-paper-plane me-2"></i>Resend Verification Email
                                </button>
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if present
        const existingModal = document.getElementById('emailVerificationModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('emailVerificationModal'));
        modal.show();

        // Add resend verification button functionality
        document.getElementById('resendVerificationBtn').addEventListener('click', async () => {
            try {
                await user.sendEmailVerification(user, {
                    url: window.location.origin + '/index.html',
                    handleCodeInApp: true
                });
                this.showSuccessMessage('Verification email sent! Please check your inbox.');
            } catch (error) {
                this.showErrorMessage('Error sending verification email: ' + error.message);
            }
        });
    }

    // Show success message
    showSuccessMessage(message) {
        this.removeExistingMessages();

        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.setAttribute('role', 'alert');
        successDiv.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;

        const form = document.querySelector('form');
        form.parentNode.insertBefore(successDiv, form.nextSibling);

        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }

    saveRememberMePreference(){
        const rememberMe = document.getElementById('rememberMe').checked;
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }else {
            localStorage.removeItem('rememberMe');
        }
    }

        checkRememberMeStatus () {
        const rememberMe = localStorage.getItem('rememberMe');
        if(rememberMe === 'true') {
            document.getElementById('rememberMe').checked = true; 

            const storedEmail = localStorage.getItem('rememberedEmail');
            if (storedEmail) {
                document.getElementById('login-email').value = storedEmail;
            }
        }
    }
}

// Create login instance
const login = new Login();

// Initialize the login functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const googleBtn = document.getElementById('google-signin');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      login.showLoading();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // Check if email is verified (Google accounts are typically auto-verified)
        if (!user.emailVerified) {
            login.hideLoading();
            login.showEmailVerificationModal(user);
            return;
        }
        
        // Check if user is admin and redirect accordingly
        if (login.isAdmin(user)) {
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
        login.showErrorMessage(error.message || 'Google sign-in failed.');
              login.hideLoading();
      }
    });
  }
});