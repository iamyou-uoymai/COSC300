import { auth } from './app.js';
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

function loadUsersData() {
  // Mock user data - in production, this would come from a database
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: 'user',
      status: 'active',
      lastLogin: '2024-01-15',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-01-10',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@ul.ac.za',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-16',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User'
    }
  ];

  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = mockUsers.map(user => `
    <tr>
      <td><img src="${user.avatar}" alt="${user.name}" class="rounded-circle" width="40" height="40"></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.role}</span></td>
      <td><span class="badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}">${user.status}</span></td>
      <td>${user.lastLogin}</td>
      <td>
        <button class="btn btn-sm btn-outline-light me-1" onclick="editUser('${user.id}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
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

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile
    await updateProfile(user, { displayName: name });

    // Send verification email
    await sendEmailVerification(user);

    // Sign out the newly created user so admin stays logged in
    await auth.signOut();
    
    // Re-authenticate admin (you might want to implement this differently)
    alert('User created successfully! Verification email sent.');
    
    // Close modal and refresh users list
    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
    document.getElementById('add-user-form').reset();
    loadUsersData();

  } catch (error) {
    console.error('Error creating user:', error);
    alert('Error creating user: ' + error.message);
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

window.deleteUser = function(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    alert(`Delete user functionality would be implemented for user ID: ${userId}`);
    loadUsersData(); // Refresh the table
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
