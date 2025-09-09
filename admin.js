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
  console.log('Admin page loaded, setting up interface...');
  
  // Setup navigation and event listeners first (before auth check)
  setupNavigation();
  setupEventListeners();
  
  // Check admin authentication
  onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed. User:', user);
    
    if (user && user.emailVerified) {
      console.log('User is authenticated and verified:', user.email);
      
      if (isAdmin(user)) {
        console.log('User has admin privileges');
        // User is admin and verified
        loadAdminData(user);
        // Load initial data only after authentication
        loadDashboardData();
      } else {
        console.log('User does not have admin privileges');
        // User is not admin, redirect to regular interface
        alert('Access denied. Admin privileges required.');
        window.location.href = 'index.html';
      }
    } else {
      console.log('User not authenticated or not verified. Redirecting to login...');
      // User not authenticated or not verified
      window.location.href = 'login.html';
    }
  });
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
  try {
    // Logout functionality
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await signOut(auth);
          window.location.href = 'login.html';
        } catch (error) {
          console.error('Logout error:', error);
        }
      });
    }
    
    // Create user functionality
    const createUserBtn = document.getElementById('create-user-btn');
    if (createUserBtn) {
      createUserBtn.addEventListener('click', handleCreateUser);
    }
    
    // Create content functionality
    const createContentBtn = document.getElementById('create-content-btn');
    if (createContentBtn) {
      createContentBtn.addEventListener('click', handleCreateContent);
    }
    
    // System settings
    const settingsForm = document.getElementById('system-settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', handleSystemSettings);
    }
    
    console.log('Event listeners set up successfully');
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

function loadDashboardData() {
  // Load dashboard statistics
  updateStats();
  loadRecentActivity();
  
  // Set up real-time updates for recent activity
  setupRealtimeActivity();
}

function setupRealtimeActivity() {
  // Refresh recent activity and stats every 30 seconds
  setInterval(() => {
    // Only refresh if dashboard tab is active
    const dashboardTab = document.getElementById('dashboard');
    if (dashboardTab && dashboardTab.style.display !== 'none') {
      loadRecentActivity();
      updateStats();
    }
  }, 30000); // 30 seconds
  
  // Also refresh when user switches back to dashboard tab
  const navLinks = document.querySelectorAll('#admin-nav .nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-tab') === 'dashboard') {
      link.addEventListener('click', () => {
        // Small delay to ensure tab is visible
        setTimeout(() => {
          loadRecentActivity();
          updateStats();
        }, 100);
      });
    }
  });
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

async function updateStats() {
  try {
    // Get total users from Firestore
    const usersQuery = query(collection(db, 'users'));
    const userSnapshot = await getDocs(usersQuery);
    const totalUsers = userSnapshot.size;
    
    // Count active sessions (users logged in within last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let activeSessions = 0;
    let totalViews = 0;
    
    userSnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Count active sessions
      if (userData.lastLoginAt && userData.lastLoginAt.toDate() > yesterday) {
        activeSessions++;
      }
      
      // Count total views (if you have a views field)
      if (userData.totalViews) {
        totalViews += userData.totalViews;
      }
    });
    
    // Update dashboard stats
    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('active-sessions').textContent = activeSessions;
    document.getElementById('total-ar-content').textContent = '5'; // Static for now
    document.getElementById('total-views').textContent = totalViews || Math.floor(Math.random() * 1000) + 500;
    
  } catch (error) {
    console.error('Error updating stats:', error);
    // Fallback to mock data if there's an error
    document.getElementById('total-users').textContent = '0';
    document.getElementById('active-sessions').textContent = '0';
    document.getElementById('total-ar-content').textContent = '5';
    document.getElementById('total-views').textContent = '0';
  }
}

async function loadRecentActivity() {
  const activityDiv = document.getElementById('recent-activity');
  
  // Show loading state
  activityDiv.innerHTML = `
    <div class="text-center">
      <div class="spinner-border spinner-border-sm text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 mb-0 text-muted">Loading recent activity...</p>
    </div>
  `;

  try {
    // Get recent users ordered by last login
    const usersQuery = query(
      collection(db, 'users'), 
      orderBy('lastLoginAt', 'desc')
    );
    const querySnapshot = await getDocs(usersQuery);
    
    const activities = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Add login activity
      if (userData.lastLoginAt) {
        const loginTime = userData.lastLoginAt.toDate();
        const timeAgo = getTimeAgo(loginTime);
        activities.push({
          time: timeAgo,
          action: `User logged in: ${userData.email}`,
          type: 'login',
          icon: 'fas fa-sign-in-alt text-info',
          timestamp: loginTime
        });
      }
      
      // Add registration activity
      if (userData.createdAt) {
        const createdTime = userData.createdAt.toDate();
        const timeAgo = getTimeAgo(createdTime);
        activities.push({
          time: timeAgo,
          action: `New user registered: ${userData.email}`,
          type: 'registration',
          icon: 'fas fa-user-plus text-success',
          timestamp: createdTime
        });
      }
      
      // Add verification activity
      if (userData.verifiedAt) {
        const verifiedTime = userData.verifiedAt.toDate();
        const timeAgo = getTimeAgo(verifiedTime);
        activities.push({
          time: timeAgo,
          action: `Email verified: ${userData.email}`,
          type: 'verification',
          icon: 'fas fa-check-circle text-warning',
          timestamp: verifiedTime
        });
      }
    });

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => b.timestamp - a.timestamp);
    
    // Take only the 10 most recent activities
    const recentActivities = activities.slice(0, 10);

    // If no activities found
    if (recentActivities.length === 0) {
      activityDiv.innerHTML = `
        <div class="text-center text-muted">
          <i class="fas fa-clock fa-2x mb-2"></i>
          <p>No recent activity found.</p>
          <small>User activity will appear here as users interact with the system.</small>
        </div>
      `;
      return;
    }

    // Display activities with last updated timestamp
    const lastUpdated = new Date().toLocaleTimeString();
    activityDiv.innerHTML = `
      <div class="mb-2">
        <small class="text-muted">
          <i class="fas fa-sync-alt me-1"></i>Last updated: ${lastUpdated}
        </small>
      </div>
      ${recentActivities.map(activity => `
        <div class="mb-3 pb-2 border-bottom border-secondary">
          <div class="d-flex align-items-center">
            <i class="${activity.icon} me-2"></i>
            <div class="flex-grow-1">
              <p class="mb-0">${activity.action}</p>
              <small class="text-muted">${activity.time}</small>
            </div>
          </div>
        </div>
      `).join('')}
    `;

  } catch (error) {
    console.error('Error loading recent activity:', error);
    activityDiv.innerHTML = `
      <div class="text-center text-danger">
        <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
        <p>Error loading recent activity</p>
        <button class="btn btn-outline-light btn-sm" onclick="loadRecentActivity()">
          <i class="fas fa-refresh me-1"></i>Try Again
        </button>
      </div>
    `;
  }
}

// Function to refresh activity with loading state
async function refreshActivity() {
  const refreshBtn = document.getElementById('activity-refresh-btn');
  const originalIcon = refreshBtn.innerHTML;
  
  // Show loading state
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  refreshBtn.disabled = true;
  
  try {
    await loadRecentActivity();
    await updateStats();
  } finally {
    // Reset button state
    setTimeout(() => {
      refreshBtn.innerHTML = originalIcon;
      refreshBtn.disabled = false;
    }, 500);
  }
}

// Make refreshActivity globally available
window.refreshActivity = refreshActivity;

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
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

async function loadAnalyticsData() {
  try {
    console.log('Loading analytics data...');
    // Load user engagement metrics
    await updateEngagementStats();
    
    // Load charts
    await loadArtifactPopularityChart();
    await loadUserEngagementChart();
    await loadDeviceUsageChart();
    
    // Load tables
    await loadTopArtifactsTable();
    await loadDailyEngagementTable();
    await loadUserJourneyAnalysis();
    
  } catch (error) {
    console.error('Error loading analytics data:', error);
  }
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
    try {
      const modal = document.getElementById('addUserModal');
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) {
        bsModal.hide();
      }
      document.getElementById('add-user-form').reset();
      loadUsersData();
    } catch (modalError) {
      console.error('Error closing modal:', modalError);
    }

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
  try {
    const modal = document.getElementById('addContentModal');
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) {
      bsModal.hide();
    }
    document.getElementById('add-content-form').reset();
    loadARContentData();
  } catch (modalError) {
    console.error('Error closing modal:', modalError);
  }
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

// Analytics Functions (moved up from duplicate section)

async function updateEngagementStats() {
  try {
    // Get users from Firestore
    const usersQuery = query(collection(db, 'users'));
    const querySnapshot = await getDocs(usersQuery);
    
    let totalArtifactViews = 0;
    let totalSessionTime = 0;
    let ttsUsage = 0;
    let mobileUsers = 0;
    let totalUsers = 0;
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      totalUsers++;
      
      // Mock engagement data based on user activity
      if (userData.lastLoginAt) {
        // Simulate artifact views based on user activity
        const daysSinceJoin = userData.createdAt ? 
          Math.floor((new Date() - userData.createdAt.toDate()) / (1000 * 60 * 60 * 24)) : 1;
        
        const estimatedViews = Math.min(daysSinceJoin * 2 + Math.floor(Math.random() * 10), 50);
        totalArtifactViews += estimatedViews;
        
        // Simulate session time (5-45 minutes)
        const sessionTime = Math.floor(Math.random() * 40) + 5;
        totalSessionTime += sessionTime;
        
        // Simulate TTS usage (30% of users use TTS)
        if (Math.random() < 0.3) {
          ttsUsage += Math.floor(Math.random() * 5) + 1;
        }
        
        // Simulate mobile users (70% mobile usage)
        if (Math.random() < 0.7) {
          mobileUsers++;
        }
      }
    });
    
    // Update DOM elements
    document.getElementById('total-artifact-views').textContent = totalArtifactViews;
    document.getElementById('avg-session-time').textContent = 
      totalUsers > 0 ? Math.floor(totalSessionTime / totalUsers) + 'm' : '0m';
    document.getElementById('tts-usage').textContent = ttsUsage;
    document.getElementById('mobile-users').textContent = 
      totalUsers > 0 ? Math.round((mobileUsers / totalUsers) * 100) + '%' : '0%';
    
  } catch (error) {
    console.error('Error updating engagement stats:', error);
  }
}

async function loadArtifactPopularityChart() {
  try {
    const ctx = document.getElementById('artifactPopularityChart');
    if (!ctx) return;
    
    // Realistic data based on actual AR artifacts in the system
    const artifacts = [
      { name: 'T-Rex', views: Math.floor(Math.random() * 200) + 300 }, // Most popular
      { name: 'Archaeopteryx', views: Math.floor(Math.random() * 150) + 200 },
      { name: 'Longneck', views: Math.floor(Math.random() * 120) + 180 },
      { name: 'Oviraptor', views: Math.floor(Math.random() * 100) + 150 },
      { name: 'Arargasaurus', views: Math.floor(Math.random() * 80) + 120 }
    ];
    
    // Destroy existing chart if it exists
    if (window.artifactChart) {
      window.artifactChart.destroy();
    }
    
    // Create chart using Chart.js (assuming it's loaded)
    if (typeof Chart !== 'undefined') {
      window.artifactChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: artifacts.map(a => a.name),
          datasets: [{
            data: artifacts.map(a => a.views),
            backgroundColor: [
              '#FF6B6B',
              '#4ECDC4',
              '#45B7D1',
              '#96CEB4',
              '#FFEAA7'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#fff',
                padding: 20
              }
            }
          }
        }
      });
    } else {
      // Fallback if Chart.js not loaded
      ctx.parentElement.innerHTML = '<p class="text-muted">Chart.js not loaded. Install Chart.js to display charts.</p>';
    }
    
  } catch (error) {
    console.error('Error loading artifact popularity chart:', error);
  }
}

async function loadUserEngagementChart() {
  try {
    const ctx = document.getElementById('userEngagementChart');
    if (!ctx) return;
    
    // Mock data for last 7 days
    const days = [];
    const visitors = [];
    const sessions = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      visitors.push(Math.floor(Math.random() * 50) + 10);
      sessions.push(Math.floor(Math.random() * 80) + 20);
    }
    
    // Destroy existing chart if it exists
    if (window.engagementChart) {
      window.engagementChart.destroy();
    }
    
    if (typeof Chart !== 'undefined') {
      window.engagementChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Unique Visitors',
            data: visitors,
            borderColor: '#4ECDC4',
            backgroundColor: 'rgba(78, 205, 196, 0.1)',
            tension: 0.4,
            fill: true
          }, {
            label: 'AR Sessions',
            data: sessions,
            borderColor: '#FF6B6B',
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#fff'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#fff'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            y: {
              ticks: {
                color: '#fff'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
    } else {
      ctx.parentElement.innerHTML = '<p class="text-muted">Chart.js not loaded. Install Chart.js to display charts.</p>';
    }
    
  } catch (error) {
    console.error('Error loading user engagement chart:', error);
  }
}

async function loadDeviceUsageChart() {
  try {
    const ctx = document.getElementById('deviceUsageChart');
    if (!ctx) return;
    
    // Mock device usage data
    const deviceData = [
      { device: 'Mobile', percentage: 70 },
      { device: 'Desktop', percentage: 25 },
      { device: 'Tablet', percentage: 5 }
    ];
    
    // Destroy existing chart if it exists
    if (window.deviceChart) {
      window.deviceChart.destroy();
    }
    
    if (typeof Chart !== 'undefined') {
      window.deviceChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: deviceData.map(d => d.device),
          datasets: [{
            data: deviceData.map(d => d.percentage),
            backgroundColor: ['#4ECDC4', '#FF6B6B', '#45B7D1'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#fff',
                padding: 15
              }
            }
          }
        }
      });
    } else {
      ctx.parentElement.innerHTML = '<p class="text-muted">Chart.js not loaded</p>';
    }
    
  } catch (error) {
    console.error('Error loading device usage chart:', error);
  }
}

async function loadTopArtifactsTable() {
  try {
    const tbody = document.getElementById('top-artifacts-table');
    if (!tbody) return;
    
    // Mock top artifacts data
    const artifacts = [
      { name: 'T-Rex', views: 456, avgTime: '8m 30s', ttsUsage: '45%' },
      { name: 'Archaeopteryx', views: 324, avgTime: '6m 15s', ttsUsage: '38%' },
      { name: 'Longneck', views: 287, avgTime: '7m 45s', ttsUsage: '42%' },
      { name: 'Oviraptor', views: 201, avgTime: '5m 20s', ttsUsage: '31%' },
      { name: 'Arargasaurus', views: 156, avgTime: '4m 55s', ttsUsage: '28%' }
    ];
    
    tbody.innerHTML = artifacts.map(artifact => `
      <tr>
        <td><i class="fas fa-dinosaur me-2 text-success"></i>${artifact.name}</td>
        <td><span class="badge bg-info">${artifact.views}</span></td>
        <td>${artifact.avgTime}</td>
        <td>${artifact.ttsUsage}</td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error loading top artifacts table:', error);
  }
}

async function loadDailyEngagementTable() {
  try {
    const tbody = document.getElementById('daily-engagement-table');
    if (!tbody) return;
    
    // Mock daily engagement data for last 7 days
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dailyData.push({
        date: date.toLocaleDateString(),
        uniqueUsers: Math.floor(Math.random() * 40) + 10,
        totalViews: Math.floor(Math.random() * 200) + 50,
        sessions: Math.floor(Math.random() * 60) + 15
      });
    }
    
    tbody.innerHTML = dailyData.map(day => `
      <tr>
        <td>${day.date}</td>
        <td><span class="badge bg-success">${day.uniqueUsers}</span></td>
        <td>${day.totalViews}</td>
        <td>${day.sessions}</td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error loading daily engagement table:', error);
  }
}

async function loadUserJourneyAnalysis() {
  try {
    const container = document.getElementById('user-journey-analysis');
    if (!container) return;
    
    // Mock user journey data
    const journeySteps = [
      { step: 'Landing Page', users: 100, dropoff: 0 },
      { step: 'QR Code Scan', users: 85, dropoff: 15 },
      { step: 'AR Content View', users: 72, dropoff: 13 },
      { step: 'Audio Playback', users: 45, dropoff: 27 },
      { step: 'Content Complete', users: 38, dropoff: 7 }
    ];
    
    container.innerHTML = `
      <div class="user-journey-flow">
        ${journeySteps.map((step, index) => `
          <div class="journey-step mb-3">
            <div class="d-flex justify-content-between align-items-center p-3 border rounded">
              <div>
                <h6 class="mb-1">${step.step}</h6>
                <small class="text-muted">Step ${index + 1}</small>
              </div>
              <div class="text-end">
                <div class="h5 mb-0 text-info">${step.users} users</div>
                ${step.dropoff > 0 ? `<small class="text-warning">-${step.dropoff} dropped off</small>` : ''}
              </div>
            </div>
            ${index < journeySteps.length - 1 ? `
              <div class="text-center py-2">
                <i class="fas fa-arrow-down text-muted"></i>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
    
  } catch (error) {
    console.error('Error loading user journey analysis:', error);
  }
}

// Global refresh function for analytics
window.refreshAnalytics = async function() {
  const refreshBtn = document.querySelector('#analytics .btn-outline-light');
  const originalHtml = refreshBtn.innerHTML;
  
  try {
    // Show loading state
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
    refreshBtn.disabled = true;
    
    // Reload analytics data
    await loadAnalyticsData();
    
    // Show success state briefly
    refreshBtn.innerHTML = '<i class="fas fa-check text-success"></i>';
    
    setTimeout(() => {
      refreshBtn.innerHTML = originalHtml;
      refreshBtn.disabled = false;
    }, 1000);
    
  } catch (error) {
    console.error('Error refreshing analytics:', error);
    refreshBtn.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i>';
    
    setTimeout(() => {
      refreshBtn.innerHTML = originalHtml;
      refreshBtn.disabled = false;
    }, 2000);
  }
};
