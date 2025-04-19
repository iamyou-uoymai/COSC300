// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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

class Reset{
    constructor(){
        this.$submitResetButton = document.querySelector("#submit-reset");

        this.addEventListeners();
    }

    addEventListeners(){
        this.$submitResetButton.addEventListener("click", (event) =>{
            event.preventDefault();

            this.$resetEmail = document.querySelector("#reset-email").value;

            if(!this.$resetEmail){
                alert("Please Provide your email.");
            }

            sendPasswordResetEmail(auth, this.$resetEmail)
            .then(() => {
                // Password reset email sent!
                // ...
                alert("Please Check Your Email...")
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

let reset = new Reset();
console.log(reset);