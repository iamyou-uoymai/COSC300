// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, sendPasswordResetEmail  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
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