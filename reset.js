// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBBkGFjdhNVG7wNWRQLjhC8q7qCXBZrw_4",
    authDomain: "museumar-2ce3e.firebaseapp.com",
    projectId: "museumar-2ce3e",
    storageBucket: "museumar-2ce3e.firebasestorage.app",
    messagingSenderId: "337419214136",
    appId: "1:337419214136:web:a09b8faf7f79ba382375cd"
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
                window.location.href = "login.html";
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