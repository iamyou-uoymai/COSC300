const viewArBtn = document.querySelectorAll(".view-ar-btn");

function openCamera() {
    const video = document.createElement('video');
    video.autoplay = true;
    video.style.position = 'fixed';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.zIndex = '1000';
    video.style.objectFit = 'cover';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = '35%';
    closeBtn.style.right = '5px';
    closeBtn.style.zIndex = '1001';
    closeBtn.style.background = 'red';
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.onclick = () => {
      document.body.removeChild(video);
      document.body.removeChild(closeBtn);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      clearInterval(scanInterval); // Stop scanning when closed
      location.reload();

    };

    // Canvas for QR processing (hidden)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    // Start QR scanning
    let scanInterval;
    
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    }).then(stream => {
      video.srcObject = stream;
      document.body.appendChild(video);
      document.body.appendChild(closeBtn);
      
      // Start scanning for QR codes
      scanInterval = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            // QR Code detected!
            console.log("Found QR code:", code.data);
            clearInterval(scanInterval);
            
            // Redirect if it's a URL
            if (code.data.startsWith('http://') || code.data.startsWith('https://')) {
              window.location.href = code.data; // Redirect to the URL
            } else {
              alert("Scanned content: " + code.data);
            }
            
            // Clean up
            document.body.removeChild(video);
            document.body.removeChild(closeBtn);
            stream.getTracks().forEach(track => track.stop());
          }
        }
      }, 500); // Scan every 500ms
    }).catch(err => {
      alert("Camera error: " + err.message);
    });
  }

  viewArBtn.forEach((button) =>{
    button.addEventListener("click", (event) =>{
        openCamera();
        document.querySelector(".row").style.display = "none";
    });
  });