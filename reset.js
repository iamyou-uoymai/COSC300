// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./app.js"; // Make sure your app.js exports 'auth'

document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("submit-reset");
  const emailInput = document.getElementById("reset-email");

  if (resetBtn && emailInput) {
    resetBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();

      if (!email) {
        alert("Please enter your email address.");
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email);
        alert("A password reset link has been sent to your email.");
      } catch (error) {
        console.error("Password reset error:", error);
        alert(error.message || "Failed to send reset email.");
      }
    });
  }
});