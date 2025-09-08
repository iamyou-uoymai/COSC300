import { auth } from "./app.js";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
               
                window.location.href = "index.html";
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
      
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Google sign-in error:', error);
        login.showErrorMessage(error.message || 'Google sign-in failed.');
              login.hideLoading();
      }
    });
  }
});
console.log(login);