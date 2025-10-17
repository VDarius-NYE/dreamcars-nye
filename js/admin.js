document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if (!window.DreamCarsAuth.isLoggedIn) {
      alert('Ehhez az oldalhoz be kell jelentkezned!');
      window.location.href = 'login.html';
      return;
    }

    if (!window.DreamCarsAuth.user || window.DreamCarsAuth.user.isAdmin != 1) {
      alert('Nincs jogosultságod ehhez az oldalhoz!');
      window.location.href = 'index.html';
      return;
    }
  }, 500);

  const imgInput = document.getElementById('img');
  const previewContainer = document.getElementById('preview-container');
  const imgPreview = document.getElementById('img-preview');

  if (imgInput) {
    imgInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('A fájl túl nagy! Maximum 5MB lehet.');
          imgInput.value = '';
          previewContainer.style.display = 'none';
          return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
          imgPreview.src = event.target.result;
          previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        previewContainer.style.display = 'none';
      }
    });
  }

  const form = document.getElementById('add-car-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      const evjarat = parseInt(document.getElementById('evjarat').value);
      const ar = parseInt(document.getElementById('ar').value);
      
      const currentYear = new Date().getFullYear();
      if (evjarat < 1900 || evjarat > currentYear + 1) {
        e.preventDefault();
        alert('Az évjárat nem lehet kisebb 1900-nál vagy nagyobb ' + (currentYear + 1) + '-nél!');
        return false;
      }

      if (ar < 0 || ar > 10000000) {
        e.preventDefault();
        alert('Az ár 0 és 10,000,000 Ft között kell legyen!');
        return false;
      }

      if (!imgInput.files || imgInput.files.length === 0) {
        e.preventDefault();
        alert('Kérlek tölts fel egy képet!');
        return false;
      }

      return true;
    });
  }
});