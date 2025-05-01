// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

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