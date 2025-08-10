import { auth } from '../app.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  // User details logic
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById('user-fullname').textContent = user.displayName || "No Name";
      document.getElementById('user-email').textContent = user.email || "";
      document.getElementById('user-avatar').src = user.photoURL 
        ? user.photoURL 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}`;
    } else {
      window.location.href = "../login.html";
    }
  });

  // Logout logic
  const logoutBtn = document.getElementById('log-out-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      try {
        await auth.signOut();
        sessionStorage.removeItem('visited');
        window.location.href = '../login.html';
      } catch (error) {
        alert('Error signing out: ' + error.message);
      }
    });
  }

  // Home button logic
  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', function() {
      window.location.href = '../index.html';
    });
  }

  // Text-to-speech logic
  const ttsBtn = document.getElementById('text-2-speech');
  if (!ttsBtn) return;

  // Find the first element whose id ends with '-desc'
  const descElem = Array.from(document.querySelectorAll('[id$="-desc"]'))[0];
  if (!descElem) return;

  ttsBtn.addEventListener('click', async () => {
    const originalDesc = descElem.textContent;

    try {
      const response = await fetch('http://localhost:3000/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalDesc })
      });

      const data = await response.json();
      if (data.audioContent) {
        const audio = new Audio('data:audio/mp3;base64,' + data.audioContent);
        audio.play();
      } else {
        alert('Failed to synthesize speech: ' + (data.error || 'Unknown error.'));
      }
    } catch (err) {
      alert('Error connecting to AI server.');
    }
  });
});