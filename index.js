import { auth } from './app.js';
import { onAuthStateChanged, applyActionCode } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

if (!sessionStorage.getItem('visited')) {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
  // Handle email verification link
  handleEmailVerification();

  // Button redirects
  const arargasaurusBtn = document.getElementById('arargasaurus');
  if (arargasaurusBtn) {
    arargasaurusBtn.addEventListener('click', function() {
      window.location.href = 'artifacts_html/arargasaurus.html';
    });
  }

  const archaepteryxBtn = document.getElementById('archaepteryx');
  if (archaepteryxBtn) {
    archaepteryxBtn.addEventListener('click', function() {
      window.location.href = 'artifacts_html/archaepteryx.html';
    });
  }

  const tRexBtn = document.getElementById('t-rex');
  if (tRexBtn) {
    tRexBtn.addEventListener('click', function() {
      window.location.href = 'artifacts_html/trex.html';
    });
  }

  const oviraptorBtn = document.getElementById('oviraptor');
  if (oviraptorBtn) {
    oviraptorBtn.addEventListener('click', function() {
      window.location.href = 'artifacts_html/oviraptor.html';
    });
  }

  const longneckBtn = document.getElementById('longneck');
  if (longneckBtn) {
    longneckBtn.addEventListener('click', function() {
      window.location.href = 'artifacts_html/longneck.html';
    });
  }

  // Home button redirect
  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  // User details in sidebar
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Check if email is verified before allowing access
      if (!user.emailVerified) {
        // Sign out unverified user and redirect to login
        auth.signOut().then(() => {
          sessionStorage.removeItem('visited');
          alert('Please verify your email address before accessing the Museum AR experience.');
          window.location.href = "login.html";
        });
        return;
      }
      
      // User is verified, show their details
      document.getElementById('user-fullname').textContent = user.displayName || "No Name";
      document.getElementById('user-email').textContent = user.email || "";
      document.getElementById('user-avatar').src = user.photoURL 
        ? user.photoURL 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}`;
      
      // Check if user is admin and show admin link
      checkAdminAccess(user);
    } else {
      // If not signed in, redirect to login
      window.location.href = "login.html";
    }
  });
  
  // Log out logic
  const logoutBtn = document.getElementById('log-out-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      try {
        await auth.signOut();
        sessionStorage.removeItem('visited');
        window.location.href = 'login.html';
      } catch (error) {
        alert('Error signing out: ' + error.message);
      }
    });
  }

  // Dark mode logic
  const themeToggleBtn = document.getElementById('theme-toggle');
  themeToggleBtn?.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    // Optionally, save preference
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i> Light Mode';
    } else {
      localStorage.setItem('theme', 'light');
      themeToggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i> Dark Mode';
    }
  });

  // On load, apply saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i> Light Mode';
  }
});

// Function to handle email verification links
async function handleEmailVerification() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const oobCode = urlParams.get('oobCode');
  
  if (mode === 'verifyEmail' && oobCode) {
    try {
      // Apply the email verification code
      await applyActionCode(auth, oobCode);
      
      // Show success message
      showVerificationSuccessModal();
      
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
    } catch (error) {
      console.error('Error verifying email:', error);
      showVerificationErrorModal(error.message);
    }
  }
}

// Function to show verification success modal
function showVerificationSuccessModal() {
  const modalHTML = `
    <div class="modal fade" id="verification-success-modal" tabindex="-1" aria-labelledby="verificationSuccessLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title" id="verificationSuccessLabel">
              <i class="fas fa-check-circle me-2"></i>Email Verified Successfully!
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <div class="mb-3">
              <i class="fas fa-shield-check text-success" style="font-size: 4rem;"></i>
            </div>
            <h4 class="text-success mb-3">Welcome to Museum AR!</h4>
            <p class="mb-3">Your email has been successfully verified. You now have full access to the Museum Augmented Reality experience.</p>
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              You can now explore all dinosaur exhibits and enjoy the AR features!
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">
              <i class="fas fa-rocket me-2"></i>Start Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('verification-success-modal'));
  modal.show();
  
  // Remove modal from DOM after it's closed
  document.getElementById('verification-success-modal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
}

// Function to show verification error modal
function showVerificationErrorModal(errorMessage) {
  const modalHTML = `
    <div class="modal fade" id="verification-error-modal" tabindex="-1" aria-labelledby="verificationErrorLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="verificationErrorLabel">
              <i class="fas fa-exclamation-triangle me-2"></i>Verification Failed
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <div class="mb-3">
              <i class="fas fa-times-circle text-danger" style="font-size: 4rem;"></i>
            </div>
            <h4 class="text-danger mb-3">Verification Link Invalid</h4>
            <p class="mb-3">The verification link may have expired or already been used.</p>
            <div class="alert alert-warning">
              <i class="fas fa-info-circle me-2"></i>
              <strong>What to do:</strong> Please try logging in again. If your email is not verified, 
              you'll be given an option to resend the verification email.
            </div>
            <p class="text-muted small">Error: ${errorMessage}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" onclick="window.location.href='login.html'">
              <i class="fas fa-sign-in-alt me-2"></i>Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('verification-error-modal'));
  modal.show();
  
  // Remove modal from DOM after it's closed
  document.getElementById('verification-error-modal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
}

// Check if user has admin access
function checkAdminAccess(user) {
  const ADMIN_DOMAINS = [
    'myturf.ul.ac.za',
    'ul.ac.za'
  ];
  
  const userEmail = user.email.toLowerCase();
  
  // Check admin domains
  const emailDomain = userEmail.split('@')[1];
  if (emailDomain && ADMIN_DOMAINS.includes(emailDomain)) {
    showAdminLink();
  }
}

// Show admin link in the user interface
function showAdminLink() {
  const offcanvasBody = document.querySelector('.offcanvas-body');
  if (offcanvasBody) {
    // Check if admin link already exists
    if (!document.getElementById('admin-link')) {
      const adminLinkHTML = `
        <div class="mt-3 text-center">
          <a href="admin.html" id="admin-link" class="btn btn-outline-warning btn-sm">
            <i class="fas fa-shield-alt me-2"></i>Admin Panel
          </a>
        </div>
      `;
      
      // Insert before the logout button
      const logoutSection = offcanvasBody.querySelector('.mt-auto');
      logoutSection.insertAdjacentHTML('beforebegin', adminLinkHTML);
    }
  }
}
