/* ========================================
   EMAIL VERIFICATION GUARD
   Ensures users have verified their email before accessing protected content
   ======================================== */

// Configuration
const PUBLIC_PAGES = [
  'login.html',
  'create.html',
  'reset.html'
];

const ADMIN_DOMAINS = ['@douglascollege.ca'];

// Firebase configuration (self-contained)
const firebaseConfig = {
  apiKey: "AIzaSyDCrnnFOvQgkVnDhltaZxiH19PEECNUqd8",
  authDomain: "cosc300-project-latest.firebaseapp.com",
  projectId: "cosc300-project-latest",
  storageBucket: "cosc300-project-latest.appspot.com",
  messagingSenderId: "149525486396",
  appId: "1:149525486396:web:5c7f6edd0d9c4d35619c39",
  measurementId: "G-D7HYG3SE2W"
};

class EmailVerificationGuard {
  constructor() {
    this.auth = null;
    this.init();
  }
  }

  async init() {
    // Don't run verification on public pages
    const currentPage = window.location.pathname.split('/').pop();
    if (PUBLIC_PAGES.includes(currentPage)) {
      return;
    }

    console.log('Email verification guard initialized for:', currentPage);
    
    // Show loading state while checking authentication
    this.showLoadingState();
    
    // Initialize Firebase directly
    await this.initializeFirebase();
    this.checkEmailVerification();
  }

  async initializeFirebase() {
    try {
      // Import Firebase modules
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
      const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
      
      // Initialize Firebase if not already done
      if (!this.auth) {
        const app = initializeApp(firebaseConfig);
        this.auth = getAuth(app);
        console.log('Firebase initialized in guard:', this.auth);
      }
    } catch (error) {
      console.error('Failed to initialize Firebase in guard:', error);
      this.redirectToLogin('System error. Please try again.');
    }
  }

  showLoadingState() {
    // Hide main content while checking authentication
    const body = document.body;
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'auth-loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="d-flex justify-content-center align-items-center min-vh-100" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div class="text-center text-white">
          <div class="spinner-border mb-3" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h4>Verifying Authentication...</h4>
          <p class="text-muted">Please wait while we verify your access.</p>
        </div>
      </div>
    `;
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    `;
    
    body.style.overflow = 'hidden';
    body.appendChild(loadingOverlay);
  }

  hideLoadingState() {
    const loadingOverlay = document.getElementById('auth-loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.remove();
      document.body.style.overflow = '';
    }
  }

  async waitForFirebase() {
    return new Promise((resolve) => {
      // Check if auth is already available
      if (auth) {
        resolve();
        return;
      }
      
      // Wait for auth to be available
      const checkAuth = () => {
        if (auth) {
          resolve();
        } else {
          setTimeout(checkAuth, 100);
        }
      };
      checkAuth();
    });
  }

  checkEmailVerification() {
    onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed in verification guard:', user ? user.email : 'No user');
      
      if (!user) {
        // No user signed in, redirect to login
        console.log('No user signed in, redirecting to login');
        this.redirectToLogin('Please sign in to access this page.');
        return;
      }

      if (!user.emailVerified) {
        // User signed in but email not verified
        console.log('User email not verified, showing verification page');
        this.showEmailVerificationPage(user);
        return;
      }

      // User is signed in and email is verified
      console.log('User authenticated and verified:', user.email);
      this.handleVerifiedUser(user);
    });
  }

  handleVerifiedUser(user) {
    // Hide loading state since user is authenticated
    this.hideLoadingState();
    
    // Check if user should be on admin page
    const currentPage = window.location.pathname.split('/').pop();
    const isAdmin = this.isAdmin(user);
    
    if (currentPage === 'admin.html' && !isAdmin) {
      // Non-admin trying to access admin page
      console.log('Non-admin user trying to access admin page, redirecting');
      window.location.href = 'index.html';
      return;
    }

    // User is properly authenticated and on the right page
    console.log('User properly authenticated for current page');
  }

  isAdmin(user) {
    if (!user?.email) return false;
    const emailDomain = '@' + user.email.split('@')[1];
    return ADMIN_DOMAINS.includes(emailDomain);
  }

  redirectToLogin(message = 'Authentication required') {
    // Store the current page to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', window.location.href);
    
    // Show brief message and redirect
    if (message) {
      this.showMessage(message, 'warning');
    }
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  }

  showEmailVerificationPage(user) {
    // Replace page content with email verification message
    document.body.innerHTML = `
      <div class="verification-guard-overlay">
        <div class="container-fluid vh-100 d-flex align-items-center justify-content-center">
          <div class="row">
            <div class="col-12 col-md-8 col-lg-6 mx-auto">
              <div class="card verification-card">
                <div class="card-body text-center p-5">
                  <div class="mb-4">
                    <i class="fas fa-envelope-open-text fa-4x text-warning mb-3"></i>
                    <h2 class="card-title">Email Verification Required</h2>
                  </div>
                  
                  <div class="alert alert-warning mb-4" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    You must verify your email address before accessing the museum experience.
                  </div>
                  
                  <div class="mb-4">
                    <p class="mb-2">We've sent a verification email to:</p>
                    <p class="fw-bold text-primary fs-5">${user.email}</p>
                    <p class="text-muted">Please check your inbox and click the verification link.</p>
                    <p class="text-muted small">Don't forget to check your spam folder!</p>
                  </div>
                  
                  <div class="d-grid gap-3">
                    <button type="button" class="btn btn-primary btn-lg" id="resendVerificationBtn">
                      <i class="fas fa-paper-plane me-2"></i>Resend Verification Email
                    </button>
                    <button type="button" class="btn btn-outline-secondary" id="checkVerificationBtn">
                      <i class="fas fa-sync-alt me-2"></i>I've Verified My Email
                    </button>
                    <button type="button" class="btn btn-outline-danger" id="signOutBtn">
                      <i class="fas fa-sign-out-alt me-2"></i>Sign Out
                    </button>
                  </div>
                  
                  <div class="mt-4">
                    <small class="text-muted">
                      Having trouble? <a href="mailto:support@museum.com">Contact Support</a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        .verification-guard-overlay {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
        }
        
        .verification-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .verification-card .card-body {
          border-radius: 20px;
        }
        
        .btn {
          border-radius: 12px;
          font-weight: 600;
          padding: 12px 24px;
        }
        
        .btn-primary {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }
      </style>
    `;

    // Add event listeners
    this.setupVerificationPageEvents(user);
  }

  setupVerificationPageEvents(user) {
    // Resend verification email
    document.getElementById('resendVerificationBtn')?.addEventListener('click', async () => {
      try {
        const { sendEmailVerification } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
        await sendEmailVerification(user);
        this.showMessage('Verification email sent! Please check your inbox.', 'success');
      } catch (error) {
        console.error('Error sending verification email:', error);
        this.showMessage('Failed to send verification email. Please try again.', 'danger');
      }
    });

    // Check verification status
    document.getElementById('checkVerificationBtn')?.addEventListener('click', async () => {
      try {
        await user.reload();
        if (user.emailVerified) {
          this.showMessage('Email verified! Redirecting...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          this.showMessage('Email not yet verified. Please check your inbox and click the verification link.', 'warning');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
        this.showMessage('Error checking verification status. Please try again.', 'danger');
      }
    });

    // Sign out
    document.getElementById('signOutBtn')?.addEventListener('click', async () => {
      try {
        const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
        await signOut(auth);
        window.location.href = 'login.html';
      } catch (error) {
        console.error('Error signing out:', error);
      }
    });
  }

  showMessage(text, type = 'info') {
    // Remove existing messages
    const existingAlerts = document.querySelectorAll('.temp-alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new message
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} temp-alert`;
    alertDiv.innerHTML = `<i class="fas fa-info-circle me-2"></i>${text}`;
    
    // Find a container to add the message to
    const container = document.querySelector('.container-fluid') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
}

// Auto-initialize when module is loaded
// Check if DOM is already loaded, if so initialize immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EmailVerificationGuard();
  });
} else {
  // DOM is already loaded, initialize immediately
  new EmailVerificationGuard();
}

export default EmailVerificationGuard;
