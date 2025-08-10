 if(!sessionStorage.getItem('visited')){
      window.location.href = 'login.html' ; 
    }

    // Redirect to arargasaurus.html on button click
    document.addEventListener('DOMContentLoaded', function() {
      const arargasaurusBtn = document.getElementById('arargasaurus');
      if (arargasaurusBtn) {
        arargasaurusBtn.addEventListener('click', function() {
          window.location.href = 'artifacts_html/arargasaurus.html';
        });
      }

      // Redirect to archaepteryx.html on button click
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
    });