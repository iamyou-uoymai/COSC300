import { auth, db } from './app.js';
import { onAuthStateChanged, applyActionCode } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// Note: Loading artifacts directly from local files

// Temporarily bypass authentication for testing
// if (!sessionStorage.getItem('visited')) {
//   window.location.href = 'login.html';
// }

// Note: Since we're loading directly from local files, 
// admin panel toggles won't affect display unless you implement local storage persistence

// Load artifacts directly from local files
async function loadArtifacts() {
  console.log('Loading artifacts from local COSC300 folder...');
  const artifactGallery = document.getElementById('artifact-gallery');
  
  if (!artifactGallery) {
    console.error('Artifact gallery element not found');
    return;
  }
  
  // Show loading state
  artifactGallery.innerHTML = `
    <div class="col-12 text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading AR artifacts...</p>
    </div>
  `;

  try {
    // Define local artifacts based on your COSC300 folder structure
    const localArtifacts = [
      {
        id: 'trex',
        name: 'T-Rex',
        description: 'The iconic apex predator of the Late Cretaceous period.',
        image: 'T-rex.png',
        htmlFile: 'trex.html',
        enabled: true
      },
      {
        id: 'arargasaurus',
        name: 'Arargasaurus',
        description: 'A unique sauropod dinosaur from the Early Cretaceous period.',
        image: 'Arargasaurus.png',
        htmlFile: 'arargasaurus.html',
        enabled: true
      },
      {
        id: 'archaepteryx',
        name: 'Archaepteryx',
        description: 'An ancient bird-like dinosaur with feathers and wings.',
        image: 'Archaepteryx.png',
        htmlFile: 'archaepteryx.html',
        enabled: true
      },
      {
        id: 'longneck',
        name: 'Longneck',
        description: 'A classic sauropod known for its long neck and massive size.',
        image: 'Longneck.png',
        htmlFile: 'longneck.html',
        enabled: true
      },
      {
        id: 'oviraptor',
        name: 'Oviraptor',
        description: 'A small, fast dinosaur known for its beak and egg-stealing reputation.',
        image: 'Oviraptor.png',
        htmlFile: 'oviraptor.html',
        enabled: true
      }
    ];

    console.log('Local artifacts loaded:', localArtifacts);

    // Generate artifact cards with admin-style design
    artifactGallery.innerHTML = localArtifacts.map(artifact => `
      <div class="col-md-6 col-lg-4 col-xl-3" data-artifact-id="${artifact.id}">
        <div class="card artifact-card h-100">
          <div class="position-relative">
            <img src="./AR_QR_CODES/${artifact.image}" class="card-img-top" alt="${artifact.name} QR" 
                 style="height: 200px; object-fit: cover;" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(artifact.name)}'">
            <div class="position-absolute top-0 end-0 m-2">
              <span class="badge bg-success">
                <i class="fas fa-check-circle me-1"></i>Active
              </span>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">${artifact.name}</h5>
              <button class="btn btn-sm btn-outline-light" onclick="showArtifactDetails('${artifact.id}')" title="More Info">
                <i class="fas fa-info-circle"></i>
              </button>
            </div>
            <p class="card-text text-muted small mb-3">${artifact.description}</p>
            <div class="mt-auto">
              <button id="${artifact.id}" class="btn btn-ar w-100 view-ar-btn" 
                      data-artifact-id="${artifact.id}" data-html-file="${artifact.htmlFile}">
                <i class="fas fa-cube me-2"></i>Experience in AR
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Add event listeners to all AR buttons
    const arButtons = document.querySelectorAll('.view-ar-btn');
    arButtons.forEach(button => {
      button.addEventListener('click', function() {
        const artifactId = this.getAttribute('data-artifact-id');
        const htmlFile = this.getAttribute('data-html-file');
        
        console.log(`Opening AR view for: ${artifactId}`);
        
        // Redirect to AR page
        window.location.href = `artifacts_html/${htmlFile}`;
      });
    });

    console.log(`Successfully loaded ${localArtifacts.length} local artifacts`);

    // Add search functionality
    setupSearchFunction(localArtifacts);

  } catch (error) {
    console.error('Error loading artifacts:', error);
    artifactGallery.innerHTML = `
      <div class="col-12 text-center">
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Error loading artifacts. Please refresh the page.
          <button class="btn btn-outline-danger btn-sm ms-2" onclick="loadArtifacts()">Retry</button>
        </div>
      </div>
    `;
  }
}

// Make loadArtifacts globally available for retry button
window.loadArtifacts = loadArtifacts;

// Show artifact details in modal
function showArtifactDetails(artifactId) {
  const localArtifacts = [
    {
      id: 'trex',
      name: 'T-Rex',
      description: 'The iconic apex predator of the Late Cretaceous period. Tyrannosaurus rex was one of the largest land-based predators ever known, with powerful jaws containing dozens of sharp teeth.',
      image: 'T-rex.png',
      htmlFile: 'trex.html'
    },
    {
      id: 'arargasaurus',
      name: 'Arargasaurus',
      description: 'A unique sauropod dinosaur from the Early Cretaceous period. This distinctive dinosaur had tall spines along its neck and back, making it easily recognizable among sauropods.',
      image: 'Arargasaurus.png',
      htmlFile: 'arargasaurus.html'
    },
    {
      id: 'archaepteryx',
      name: 'Archaepteryx',
      description: 'An ancient bird-like dinosaur with feathers and wings. Often called the "first bird," Archaepteryx represents a crucial link between dinosaurs and modern birds.',
      image: 'Archaepteryx.png',
      htmlFile: 'archaepteryx.html'
    },
    {
      id: 'longneck',
      name: 'Longneck',
      description: 'A classic sauropod known for its long neck and massive size. These gentle giants used their extended necks to reach vegetation high in ancient forests.',
      image: 'Longneck.png',
      htmlFile: 'longneck.html'
    },
    {
      id: 'oviraptor',
      name: 'Oviraptor',
      description: 'A small, fast dinosaur known for its beak and egg-stealing reputation. Despite its name meaning "egg thief," recent discoveries suggest it was actually protecting its own eggs.',
      image: 'Oviraptor.png',
      htmlFile: 'oviraptor.html'
    }
  ];
  
  const artifact = localArtifacts.find(a => a.id === artifactId);
  if (artifact) {
    document.getElementById('artifactName').textContent = artifact.name;
    document.getElementById('artifactDescription').textContent = artifact.description;
    document.getElementById('artifactImage').src = `./AR_QR_CODES/${artifact.image}`;
    
    // Set up the modal AR button
    const modalARBtn = document.getElementById('modalViewAR');
    modalARBtn.onclick = () => {
      window.location.href = `artifacts_html/${artifact.htmlFile}`;
    };
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('artifactModal'));
    modal.show();
  }
}

// Make function globally available
window.showArtifactDetails = showArtifactDetails;

// Handle user logout
async function handleLogout() {
  try {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
      console.log('Logging out user...');
      
      // Sign out from Firebase if available
      if (auth && auth.signOut) {
        await auth.signOut();
      }
      
      // Clear session storage
      sessionStorage.clear();
      localStorage.removeItem('visited');
      
      // Show logout success message
      alert('You have been successfully logged out.');
      
      // Redirect to login page
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Error during logout:', error);
    alert('Error during logout. Please try again.');
  }
}

// Setup search functionality
function setupSearchFunction(artifacts) {
  const searchBar = document.getElementById('search-bar');
  if (!searchBar) return;

  searchBar.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const artifactCards = document.querySelectorAll('[data-artifact-id]');
    
    artifactCards.forEach(card => {
      const artifactName = card.querySelector('.card-title').textContent.toLowerCase();
      const artifactDesc = card.querySelector('.card-text').textContent.toLowerCase();
      
      if (searchTerm === '' || 
          artifactName.includes(searchTerm) || 
          artifactDesc.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// Function to handle email verification links
async function handleEmailVerification() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const oobCode = urlParams.get('oobCode');
  
  if (mode === 'verifyEmail' && oobCode) {
    try {
      // Apply the email verification code
      await applyActionCode(auth, oobCode);
      
      // Update user verification status in Firestore
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          emailVerified: true,
          status: 'active',
          verifiedAt: new Date()
        });
      }
      
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');
  
  // Handle email verification link
  handleEmailVerification();
  
  // Load dynamic artifacts
  loadArtifacts();

  // Refresh artifacts button
  const refreshBtn = document.getElementById('refresh-artifacts-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      console.log('Manual refresh requested');
      // Show loading state on button
      const originalContent = this.innerHTML;
      this.innerHTML = '<i class="bi bi-arrow-clockwise" style="animation: spin 1s linear infinite;"></i>';
      this.disabled = true;
      
      loadArtifacts().finally(() => {
        // Restore button state
        this.innerHTML = originalContent;
        this.disabled = false;
      });
    });
  }

  // Settings button functionality
  const settingsBtn = document.getElementById('user-settings');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
      settingsModal.show();
    });
  }

  // Initialize user info with default values
  document.getElementById('user-name').textContent = 'Guest User';
  document.getElementById('user-avatar').src = 'https://ui-avatars.com/api/?name=Guest+User&background=4ecdc4&color=fff';

  // Logout button functionality (dropdown)
  const dropdownLogoutBtn = document.getElementById('user-logout');
  if (dropdownLogoutBtn) {
    dropdownLogoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
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
      // Check if email is verified before allowing access (disabled for testing)
      // if (!user.emailVerified) {
      //   // Sign out unverified user and redirect to login
      //   auth.signOut().then(() => {
      //     sessionStorage.removeItem('visited');
      //     alert('Please verify your email address before accessing the Museum AR experience.');
      //     window.location.href = "login.html";
      //   });
      //   return;
      // }
      
      // User is verified, show their details in sidebar (if elements exist)
      const userFullname = document.getElementById('user-fullname');
      const userEmail = document.getElementById('user-email');
      if (userFullname) userFullname.textContent = user.displayName || "No Name";
      if (userEmail) userEmail.textContent = user.email || "";
      
      // Update header user info
      document.getElementById('user-name').textContent = user.displayName || user.email || "User";
      document.getElementById('user-avatar').src = user.photoURL 
        ? user.photoURL 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || "User")}&background=4ecdc4&color=fff`;
      
      // Update last login time in Firestore
      updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date()
      }).catch(error => {
        console.log('Note: Could not update last login time:', error.message);
      });
      
      // Check if user is admin and show admin link
      checkAdminAccess(user);
    } else {
      // If not signed in, show guest user info (for testing)
      console.log('No user signed in, showing as guest user');
      document.getElementById('user-name').textContent = 'Guest User';
      document.getElementById('user-avatar').src = 'https://ui-avatars.com/api/?name=Guest+User&background=6c757d&color=fff';
      // window.location.href = "login.html";
    }
  });
  
  // Log out logic (sidebar button)
  const logoutBtn = document.getElementById('log-out-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
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
