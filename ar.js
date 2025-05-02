const viewArBtn = document.querySelectorAll(".view-ar-btn");

  function openCamera() {
    // Create a video element to show the camera stream
    const video = document.createElement('video');
    video.autoplay = true;
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.zIndex = '1000';
    video.style.objectFit = 'cover';
    video.style.backgroundColor = 'black';
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.zIndex = '1001';
    closeBtn.style.background = 'red';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.width = '40px';
    closeBtn.style.height = '40px';
    closeBtn.style.fontSize = '20px';
    closeBtn.onclick = () => {
      document.body.removeChild(video);
      document.body.removeChild(closeBtn);
      // Stop all video tracks
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    };
    
    // Request camera access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          document.body.appendChild(video);
          document.body.appendChild(closeBtn);
        })
        .catch(err => {
          alert("Could not access camera: " + err.message);
        });
    } else {
      alert("Camera access is not supported by your browser");
    }
  }

viewArBtn.forEach((button) =>{
    button.addEventListener("click", (event) =>{
        openCamera();
    });
});