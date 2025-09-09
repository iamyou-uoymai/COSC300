// Import the functions you need from the SDKs you need
import { sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check if this is a password reset verification page
  handlePasswordReset();

  const resetBtn = document.getElementById("submit-reset");
  const emailInput = document.getElementById("reset-email");

  if (resetBtn && emailInput) {
    resetBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      const email = emailInput.value.trim();

      if (!email) {
        showErrorMessage("Please enter your email address.");
        return;
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showErrorMessage("Please enter a valid email address.");
        return;
      }

      showLoading(true);

      try {
        const actionCodeSettings = {
          url: `${window.location.origin}/reset.html`, // Redirect back to reset page for password change
          handleCodeInApp: true,
        };
        
        await sendPasswordResetEmail(auth, email, actionCodeSettings);
        showSuccessMessage("A password reset link has been sent to your email. Please check your inbox and spam folder.");
      } catch (error) {
        console.error("Password reset error:", error);
        showErrorMessage(error.message || "Failed to send reset email.");
      } finally {
        showLoading(false);
      }
    });
  }
});

// Handle password reset verification from email link
async function handlePasswordReset() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const oobCode = urlParams.get('oobCode');

  if (mode === 'resetPassword' && oobCode) {
    // Hide the email form and show password reset form
    hideEmailForm();
    showPasswordResetForm(oobCode);
  }
}

// Hide email form
function hideEmailForm() {
  const formContainer = document.querySelector('.form-container');
  if (formContainer) {
    formContainer.style.display = 'none';
  }
}

// Show password reset form
function showPasswordResetForm(oobCode) {
  const resetDiv = document.querySelector('.reset');
  
  const resetFormHTML = `
    <div class="form-container" id="password-reset-form">
      <div class="text-center mb-4">
        <div class="logo-container">
          <img src="./assets/museum-logo.png" alt="Museum Logo" class="logo-image">
        </div>
        <h1 class="fs-2 text-center">Set New Password</h1>
        <p class="text-muted">Enter your new password below</p>
      </div>

      <form id="new-password-form">
        <div class="mb-3">
          <label for="new-password" class="form-label">NEW PASSWORD</label>
          <div class="password-input-group">
            <input type="password" class="form-control" id="new-password" placeholder="Enter new password" required>
            <button type="button" class="password-toggle" id="password-toggle-1">
              <i class="far fa-eye"></i>
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label for="confirm-password" class="form-label">CONFIRM PASSWORD</label>
          <div class="password-input-group">
            <input type="password" class="form-control" id="confirm-password" placeholder="Confirm new password" required>
            <button type="button" class="password-toggle" id="password-toggle-2">
              <i class="far fa-eye"></i>
            </button>
          </div>
        </div>

        <!-- Password Requirements Display -->
        <div class="password-requirements mb-3">
          <small class="text-muted">Password must contain:</small>
          <ul class="requirements-list">
            <li id="req-length" class="requirement">
              <i class="fas fa-times text-danger"></i> At least 6 characters
            </li>
            <li id="req-uppercase" class="requirement">
              <i class="fas fa-times text-danger"></i> One uppercase letter
            </li>
            <li id="req-lowercase" class="requirement">
              <i class="fas fa-times text-danger"></i> One lowercase letter
            </li>
            <li id="req-digit" class="requirement">
              <i class="fas fa-times text-danger"></i> One digit
            </li>
            <li id="req-special" class="requirement">
              <i class="fas fa-times text-danger"></i> One special character
            </li>
          </ul>
        </div>

        <button id="submit-new-password" type="submit" class="btn btn-light reset-password-btn mt-3" disabled>
          <i class="fas fa-shield-alt me-2"></i> Reset Password
        </button>

        <div class="text-center mt-3">
          <p class="text-muted">Remember your password? <a href="./login.html" class="text-light fw-bold">Log In</a></p>
        </div>
      </form>
    </div>
  `;

  resetDiv.innerHTML = resetFormHTML;
  
  // Set up password reset form functionality
  setupPasswordResetForm(oobCode);
}

// Set up password reset form with validation
function setupPasswordResetForm(oobCode) {
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const submitBtn = document.getElementById('submit-new-password');
  const form = document.getElementById('new-password-form');

  // Password requirements
  const requirements = {
    length: /.{6,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    digit: /[0-9]/,
    special: /[^A-Za-z0-9]/
  };

  // Set up password toggles
  setupPasswordToggle('password-toggle-1', 'new-password');
  setupPasswordToggle('password-toggle-2', 'confirm-password');

  // Real-time password validation
  newPasswordInput.addEventListener('input', () => {
    validatePassword(newPasswordInput.value);
    checkPasswordMatch();
  });

  confirmPasswordInput.addEventListener('input', checkPasswordMatch);

  // Handle form submission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!validatePasswordComplete(newPassword)) {
      showErrorMessage("Please ensure your password meets all requirements.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorMessage("Passwords do not match.");
      return;
    }

    showLoading(true);

    try {
      // Verify the reset code and confirm new password
      await confirmPasswordReset(auth, oobCode, newPassword);
      
      showSuccessModal();
    } catch (error) {
      console.error("Password reset confirmation error:", error);
      showErrorMessage(error.message || "Failed to reset password. The link may have expired.");
    } finally {
      showLoading(false);
    }
  });

  // Validate password requirements
  function validatePassword(password) {
    let allValid = true;

    Object.keys(requirements).forEach(req => {
      const element = document.getElementById(`req-${req}`);
      const icon = element.querySelector('i');
      
      if (requirements[req].test(password)) {
        icon.className = 'fas fa-check text-success';
        element.classList.add('valid');
      } else {
        icon.className = 'fas fa-times text-danger';
        element.classList.remove('valid');
        allValid = false;
      }
    });

    return allValid;
  }

  // Check if passwords match
  function checkPasswordMatch() {
    const password = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const isValid = validatePasswordComplete(password) && password === confirmPassword && password.length > 0;
    
    submitBtn.disabled = !isValid;
    
    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity("Passwords don't match");
      confirmPasswordInput.classList.add('is-invalid');
    } else {
      confirmPasswordInput.setCustomValidity("");
      confirmPasswordInput.classList.remove('is-invalid');
    }
  }

  // Complete password validation
  function validatePasswordComplete(password) {
    return Object.values(requirements).every(regex => regex.test(password));
  }
}

// Set up password toggle functionality
function setupPasswordToggle(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  
  if (toggle && input) {
    toggle.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        toggle.innerHTML = '<i class="far fa-eye-slash"></i>';
      } else {
        input.type = 'password';
        toggle.innerHTML = '<i class="far fa-eye"></i>';
      }
    });
  }
}

// Show success modal after password reset
function showSuccessModal() {
  const modalHTML = `
    <div class="modal fade" id="password-reset-success" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header border-secondary bg-success">
            <h5 class="modal-title">
              <i class="fas fa-check-circle me-2"></i>Password Reset Successful!
            </h5>
          </div>
          <div class="modal-body text-center">
            <div class="mb-3">
              <i class="fas fa-shield-check text-success" style="font-size: 4rem;"></i>
            </div>
            <h4 class="text-success mb-3">Password Updated Successfully!</h4>
            <p class="mb-3">Your password has been reset successfully. You can now log in with your new password.</p>
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              For security, please log in again with your new password.
            </div>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-success" onclick="window.location.href='login.html'">
              <i class="fas fa-sign-in-alt me-2"></i>Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('password-reset-success'));
  modal.show();
}

// Utility functions
function showLoading(show) {
  const buttons = document.querySelectorAll('button[type="submit"]');
  buttons.forEach(btn => {
    btn.disabled = show;
    if (show) {
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    }
  });
}

function showErrorMessage(message) {
  removeExistingMessages();
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-danger mt-3';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>${message}`;
  
  const form = document.querySelector('form');
  if (form) {
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
    setTimeout(() => errorDiv.remove(), 5000);
  }
}

function showSuccessMessage(message) {
  removeExistingMessages();
  const successDiv = document.createElement('div');
  successDiv.className = 'alert alert-success mt-3';
  successDiv.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
  
  const form = document.querySelector('form');
  if (form) {
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    setTimeout(() => successDiv.remove(), 8000);
  }
}

function removeExistingMessages() {
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());
}