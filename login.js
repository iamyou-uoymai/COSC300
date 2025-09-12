import { auth } from "./app.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

class Login {
    constructor() {
        this.$submitLogin = document.querySelector("#submit-login");
        this.addEventListeners();
        this.setupPasswordToggle();
    }

    addEventListeners() {
        this.$submitLogin.addEventListener("click", async (event) => {
            event.preventDefault();
            this.showLoading();

            const email = document.querySelector("#login-email").value;
            const password = document.querySelector("#login-password").value;

            if (!email || !password) {
                alert("Please fill in all fields.");
                this.hideLoading();
                return;
            }

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
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
            } catch (error) {
              this.showErrorMessage(error.message);
               this.hideLoading();
            }
        });
    }
       ///method to display error message
      showErrorMessage(message){
           this.removeExistingMessages();

           const errorDiv = document.createElement('div');
           errorDiv.className = 'alert alert-danger mt-3';
           errorDiv.setAttribute('role','alert');
           errorDiv.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i> ${message} ';
         
           const form= document.querySelector('form');
           form.parentNode.insertBefore(errorDiv, form.nextSibling);

        setTimeout(() => {
              if (errorDiv.parentNode){
                errorDiv.parentNode.removeChild(errorDiv);
              }
        }, 3000);
      }

      removeExistingMessages() {
         const existingErrors =document.querySelectorAll('alert-danger');
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
                   }else {
                       
                        passwordInput.type = 'password';
                        passwordToggle.innerHTML = '<i class="far fa-eye"></i>';
                        passwordToggle.setAttribute('aria-label', 'Show password');
                   }
                   
               });
       }
    }

    showLoading(){
          const spinner = document.getElementById('loading-spinner');
          const loginBtn = document.getElementById('submit-login');
           const googleBtn = document.getElementById('google-signin');
      
           if (spinner) spinner.classList.remove('d-none');
                if (loginBtn) loginBtn.disabled = true;
                 if (googleBtn) googleBtn.disabled = true;
               }

           hideLoading() {
      const spinner = document.getElementById('loading-spinner');
      const loginBtn = document.getElementById('submit-login');
      const googleBtn = document.getElementById('google-signin');
      
      if (spinner) spinner.classList.add('d-none');
      if (loginBtn) loginBtn.disabled = false;
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
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="emailVerificationModalLabel">
                                <i class="fas fa-envelope-open-text me-2"></i>Email Verification Required
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                await user.sendEmailVerification({
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
        }, 3000);
    }
}

let login = new Login();
// Google sign-in logic
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
        sessionStorage.setItem('justLoggedIn', 'true');
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
console.log(login);