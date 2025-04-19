// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyY0zykCHbjDwrq_8RwE-DLsWJYC21GmE",
    authDomain: "cosc300-17c66.firebaseapp.com",
    projectId: "cosc300-17c66",
    storageBucket: "cosc300-17c66.firebasestorage.app",
    messagingSenderId: "444715025539",
    appId: "1:444715025539:web:633ef8a5c41a3ab91987b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);

// Initialize Firebase Auth
const auth = getAuth();
console.log(auth);


class Login{
    constructor(){
        this.$submitLogin = document.querySelector("#submit-login");

        this.addEventListeners();
    }

    addEventListeners(){
        this.$submitLogin.addEventListener("click", (event) =>{
            event.preventDefault();

            this.$loginEmail = document.querySelector("#login-email").value;
            this.$loginPassword = document.querySelector("#login-password").value;

            if(!this.$loginEmail || !this.$loginPassword){
                alert("Please Fill in all fields.");
                return;
            }
            
            signInWithEmailAndPassword(auth, this.$loginEmail, this.$loginPassword)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                // ...
                alert("Your Account is Still being Confirmed,Do not refresh this page, Please be Patient ♥");
                window.location.href = "index.html";
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                alert(errorMessage);
            })
        });
    }


}

let login = new Login();
console.log(login);