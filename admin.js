import { auth, db } from './app.js';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Check if current user is admin
function isAdmin(user) {
    const ADMIN_DOMAINS = [
        'myturf.ul.ac.za',
        'ul.ac.za'
    ];
    
    const userEmail = user.email.toLowerCase();
    
    // Check admin domains
    const emailDomain = userEmail.split('@')[1];
    return emailDomain && ADMIN_DOMAINS.includes(emailDomain);
}

document.addEventListener('DOMContentLoaded', function() {
  // Check admin authentication
  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
      if (isAdmin(user)) {
        // User is admin and verified
        loadAdminData(user);
      } else {
        // User is not admin, redirect to regular interface
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
      }
    } else {
      // User not authenticated or not verified
      window.location.href = 'login.html';
    }
  });

  // Setup navigation
  setupNavigation();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load initial data
  loadDashboardData();
});

function loadAdminData(user) {
  // Update admin info in header
  document.getElementById('admin-name').textContent = user.displayName || 'Admin User';
  document.getElementById('admin-avatar').src = user.photoURL || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'Admin')}`;
}

function setupNavigation() {
  const navLinks = document.querySelectorAll('#admin-nav .nav-link');
  const tabContents = document.querySelectorAll('.tab-content');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links and contents
      navLinks.forEach(l => l.classList.remove('active'));
      tabContents.forEach(content => content.style.display = 'none');
      
      // Add active class to clicked link
      link.classList.add('active');
      
      // Show corresponding content
      const tabId = link.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.style.display = 'block';
        
        // Load specific tab data
        loadTabData(tabId);
      }
    });
  });
}

function setupEventListeners() {
        // Logout functionality
        document.getElementById('admin-logout').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });  // Create user functionality
  document.getElementById('create-user-btn').addEventListener('click', handleCreateUser);
  
  // Create content functionality
  document.getElementById('create-content-btn').addEventListener('click', handleCreateContent);
  
  // System settings
  document.getElementById('system-settings-form').addEventListener('submit', handleSystemSettings);
}

function loadDashboardData() {
  // Load dashboard statistics
  updateStats();
  loadRecentActivity();
}

function loadTabData(tabId) {
  switch(tabId) {
    case 'users':
      loadUsersData();
      break;
    case 'ar-content':
      loadARContentData();
      break;
    case 'analytics':
      loadAnalyticsData();
      break;
    case 'settings':
      loadSystemSettings();
      break;
  }
}

function updateStats() {
  // In a real application, this would fetch from a database
  // For now, we'll use mock data
  
  // Simulate API calls
  setTimeout(() => {
    document.getElementById('total-users').textContent = Math.floor(Math.random() * 100) + 50;
    document.getElementById('total-ar-content').textContent = '5';
    document.getElementById('active-sessions').textContent = Math.floor(Math.random() * 20) + 5;
    document.getElementById('total-views').textContent = Math.floor(Math.random() * 1000) + 500;
  }, 500);
}

function loadRecentActivity() {
  const activities = [
    { time: '2 minutes ago', action: 'New user registered: john.doe@email.com' },
    { time: '15 minutes ago', action: 'AR content "T-Rex" was viewed 5 times' },
    { time: '1 hour ago', action: 'Admin updated system settings' },
    { time: '3 hours ago', action: 'User verification email sent to mary@email.com' },
    { time: '1 day ago', action: 'New AR content "Longneck" was added' }
  ];

  const activityDiv = document.getElementById('recent-activity');
  activityDiv.innerHTML = activities.map(activity => `
    <div class="mb-2 pb-2 border-bottom border-secondary">
      <small class="text-muted">${activity.time}</small>
      <p class="mb-0">${activity.action}</p>
    </div>
  `).join('');
}

async function loadUsersData() {
  const tbody = document.getElementById('users-table-body');
  
  // Show loading state
  tbody.innerHTML = `
    <tr>
      <td colspan="7" class="text-center">
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading users...</p>
      </td>
    </tr>
  `;

  try {
    // Get users from Firestore
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(usersQuery);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        name: userData.displayName || userData.name || 'No Name',
        email: userData.email || 'No Email',
        role: userData.role || 'user',
        status: userData.emailVerified ? 'active' : 'inactive',
        lastLogin: userData.lastLoginAt ? new Date(userData.lastLoginAt.toDate()).toLocaleDateString() : 'Never',
        createdAt: userData.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'Unknown',
        avatar: userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName || userData.name || 'User')}`,
        emailVerified: userData.emailVerified || false
      });
    });

    // If no users found, show empty state
    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted">
            <i class="fas fa-users fa-3x mb-3"></i>
            <p>No users found in the database.</p>
            <p>Users will appear here when they register.</p>
          </td>
        </tr>
      `;
      return;
    }

    // Display users
    tbody.innerHTML = users.map(user => `
      <tr>
        <td><img src="${user.avatar}" alt="${user.name}" class="rounded-circle" width="40" height="40"></td>
        <td>
          <div>${user.name}</div>
          <small class="text-muted">Joined: ${user.createdAt}</small>
        </td>
        <td>
          <div>${user.email}</div>
          <small class="text-muted">
            <i class="fas fa-${user.emailVerified ? 'check-circle text-success' : 'exclamation-circle text-warning'}"></i>
            ${user.emailVerified ? 'Verified' : 'Unverified'}
          </small>
        </td>
        <td><span class="badge ${isAdmin({email: user.email}) ? 'bg-danger' : 'bg-primary'}">${isAdmin({email: user.email}) ? 'admin' : 'user'}</span></td>
        <td><span class="badge ${user.emailVerified ? 'bg-success' : 'bg-warning'}">${user.emailVerified ? 'active' : 'pending'}</span></td>
        <td>${user.lastLogin}</td>
        <td>
          <button class="btn btn-sm btn-outline-light me-1" onclick="editUser('${user.id}')" title="Edit User">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user.id}')" title="Delete User">
            <i class="fas fa-trash"></i>
          </button>
          ${!user.emailVerified ? `
            <button class="btn btn-sm btn-outline-warning" onclick="resendVerification('${user.id}')" title="Resend Verification">
              <i class="fas fa-envelope"></i>
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');

    // Update user count in dashboard
    document.getElementById('total-users').textContent = users.length;

  } catch (error) {
    console.error('Error loading users:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
          <p>Error loading users: ${error.message}</p>
          <button class="btn btn-outline-light btn-sm" onclick="loadUsersData()">
            <i class="fas fa-refresh me-1"></i>Try Again
          </button>
        </td>
      </tr>
    `;
  }
}

function loadARContentData() {
  // Mock AR content data
  const arContent = [
    {
      id: '1',
      name: 'T-Rex',
      description: 'Tyrannosaurus Rex in Augmented Reality',
      image: 'T-rex_QR.png',
      status: 'active',
      views: 150
    },
    {
      id: '2',
      name: 'Arargasaurus',
      description: 'Aragosaurus ischiaticus sauropod dinosaur',
      image: 'Arargasaurus_QR.png',
      status: 'active',
      views: 89
    },
    {
      id: '3',
      name: 'Archaepteryx',
      description: 'Archaeopteryx, the transitional fossil',
      image: 'Archaepteryx_QR.png',
      status: 'active',
      views: 76
    },
    {
      id: '4',
      name: 'Longneck',
      description: 'Long-necked sauropod dinosaur',
      image: 'Longneck_QR.png',
      status: 'active',
      views: 112
    },
    {
      id: '5',
      name: 'Oviraptor',
      description: 'Oviraptor, the egg thief dinosaur',
      image: 'Oviraptor_QR.png',
      status: 'active',
      views: 94
    }
  ];

  const contentGrid = document.getElementById('ar-content-grid');
  contentGrid.innerHTML = arContent.map(content => `
    <div class="col-md-4 mb-4">
      <div class="card">
        <img src="./artifacts_html/${content.image}" class="card-img-top" alt="${content.name}" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${content.name}</h5>
          <p class="card-text">${content.description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge ${content.status === 'active' ? 'bg-success' : 'bg-secondary'}">${content.status}</span>
            <small class="text-muted">${content.views} views</small>
          </div>
          <div class="mt-3">
            <button class="btn btn-sm btn-outline-light me-2" onclick="editContent('${content.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteContent('${content.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function loadAnalyticsData() {
  // This would typically load Chart.js or another charting library
  console.log('Loading analytics data...');
}

function loadSystemSettings() {
  // Load current system settings
  console.log('Loading system settings...');
}

async function handleCreateUser(e) {
  e.preventDefault();
  
  const name = document.getElementById('new-user-name').value;
  const email = document.getElementById('new-user-email').value;
  const role = document.getElementById('new-user-role').value;
  const password = document.getElementById('new-user-password').value;

  if (!name || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  // Show loading state
  const createBtn = document.getElementById('create-user-btn');
  const originalText = createBtn.innerHTML;
  createBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating...';
  createBtn.disabled = true;

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile
    await updateProfile(user, { displayName: name });

    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      displayName: name,
      email: email,
      role: role,
      emailVerified: false,
      createdAt: new Date(),
      createdBy: auth.currentUser.uid,
      status: 'pending'
    });

    // Send verification email
    await sendEmailVerification(user, {
      url: window.location.origin + '/index.html',
      handleCodeInApp: true
    });

    // Sign out the newly created user so admin stays logged in
    await auth.signOut();
    
    alert('User created successfully! Verification email sent to ' + email);
    
    // Close modal and refresh users list
    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
    document.getElementById('add-user-form').reset();
    loadUsersData();

  } catch (error) {
    console.error('Error creating user:', error);
    alert('Error creating user: ' + error.message);
  } finally {
    // Reset button state
    createBtn.innerHTML = originalText;
    createBtn.disabled = false;
  }
}

function handleCreateContent(e) {
  e.preventDefault();
  
  const name = document.getElementById('content-name').value;
  const description = document.getElementById('content-description').value;
  const active = document.getElementById('content-active').checked;

  if (!name || !description) {
    alert('Please fill in all required fields.');
    return;
  }

  // In a real application, you would upload files and save to database
  alert('AR Content creation would be implemented with file upload and database storage.');
  
  // Close modal and refresh content
  bootstrap.Modal.getInstance(document.getElementById('addContentModal')).hide();
  document.getElementById('add-content-form').reset();
  loadARContentData();
}

function handleSystemSettings(e) {
  e.preventDefault();
  
  const museumName = document.getElementById('museum-name').value;
  const maxUsers = document.getElementById('max-users').value;
  const emailVerification = document.getElementById('email-verification').checked;
  const autoSpeech = document.getElementById('auto-speech').checked;

  // Save settings (in production, this would save to database)
  localStorage.setItem('adminSettings', JSON.stringify({
    museumName,
    maxUsers,
    emailVerification,
    autoSpeech
  }));

  alert('Settings saved successfully!');
}

// Global functions for user actions
window.editUser = function(userId) {
  alert(`Edit user functionality would be implemented for user ID: ${userId}`);
};

window.deleteUser = async function(userId) {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', userId));
      
      alert('User deleted successfully from database.');
      loadUsersData(); // Refresh the table
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + error.message);
    }
  }
};

window.resendVerification = async function(userId) {
  try {
    // In a real implementation, you would need to handle this differently
    // since you can't send verification emails for other users directly
    alert('Verification email resend functionality would require server-side implementation.');
  } catch (error) {
    console.error('Error resending verification:', error);
  }
};

window.editContent = function(contentId) {
  alert(`Edit AR content functionality would be implemented for content ID: ${contentId}`);
};

window.deleteContent = function(contentId) {
  if (confirm('Are you sure you want to delete this AR content?')) {
    alert(`Delete content functionality would be implemented for content ID: ${contentId}`);
    loadARContentData(); // Refresh the grid
  }
};
