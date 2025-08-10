import { auth } from './app.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

if (!sessionStorage.getItem('visited')) {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
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

  // User details in sidebar
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById('user-fullname').textContent = user.displayName || "No Name";
      document.getElementById('user-email').textContent = user.email || "";
      document.getElementById('user-avatar').src = user.photoURL 
        ? user.photoURL 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}`;
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
});
