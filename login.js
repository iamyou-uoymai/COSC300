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

            const email = document.querySelector("#login-email").value;
            const password = document.querySelector("#login-password").value;

            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                alert("Your Account is Still being Confirmed, Do not refresh this page, Please be Patient ♥");
                window.location.href = "index.html";
            } catch (error) {
                alert(error.message);
            }
        });
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
}

let login = new Login();
// Google sign-in logic
document.addEventListener('DOMContentLoaded', () => {
  const googleBtn = document.getElementById('google-signin');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        alert('Google sign-in successful!');
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Google sign-in error:', error);
        alert(error.message || 'Google sign-in failed.');
      }
    });
  }
});
console.log(login);