import { auth } from "./app.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

class Login {
    constructor() {
        this.$submitLogin = document.querySelector("#submit-login");
        this.addEventListeners();
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
}

let login = new Login();
console.log(login);