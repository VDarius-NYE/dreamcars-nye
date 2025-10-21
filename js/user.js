// user.js - Felhasználói profil kezelés
document.addEventListener('DOMContentLoaded', function() {
  
  // Bejelentkezés ellenőrzése
  function checkAuthAndLoad() {
    if (typeof window.DreamCarsAuth === 'undefined' || !window.DreamCarsAuth.initialized) {
      setTimeout(checkAuthAndLoad, 100);
      return;
    }

    if (!window.DreamCarsAuth.isLoggedIn) {
      alert('A profilhoz be kell jelentkezned!');
      window.location.href = 'login.html';
      return;
    }
    
    loadUserData();
    loadBookings();
  }

  checkAuthAndLoad();

  // Tab váltás
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      tabButtons.forEach(function(b) { b.classList.remove('active'); });
      tabContents.forEach(function(c) { c.classList.remove('active'); });
      
      this.classList.add('active');
      document.getElementById(targetTab + '-tab').classList.add('active');
    });
  });

  // Felhasználói adatok betöltése
  function loadUserData() {
    fetch('../php/get_user_data.php')
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.success) {
          document.getElementById('user-fullname').textContent = data.user.fullname;
          document.getElementById('user-email-display').textContent = data.user.email;
          document.getElementById('fullname').value = data.user.fullname;
          document.getElementById('email').value = data.user.email;
          document.getElementById('phone').value = data.user.phone || '';
        }
      })
      .catch(function(error) {
        console.error('Hiba:', error);
      });
  }

  // Profil adatok mentése
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append('fullname', document.getElementById('fullname').value);
      formData.append('email', document.getElementById('email').value);
      formData.append('phone', document.getElementById('phone').value);

      fetch('../php/update_profile.php', {
        method: 'POST',
        body: formData
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.success) {
          alert('Profil sikeresen frissitve!');
          loadUserData();
          // Frissítjük az auth adatokat is
          window.DreamCarsAuth.check(true);
        } else {
          alert('Hiba: ' + data.message);
        }
      })
      .catch(function(error) {
        alert('Hiba tortent!');
        console.error(error);
      });
    });
  }

  // Jelszó módosítás
  const passwordForm = document.getElementById('password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const newPass = document.getElementById('new-password').value;
      const confirmPass = document.getElementById('confirm-password').value;

      if (newPass !== confirmPass) {
        alert('Az uj jelszavak nem egyeznek!');
        return;
      }

      if (newPass.length < 6) {
        alert('A jelszo legalabb 6 karakter hosszu kell legyen!');
        return;
      }

      const formData = new FormData();
      formData.append('current_password', document.getElementById('current-password').value);
      formData.append('new_password', newPass);

      fetch('../php/change_password.php', {
        method: 'POST',
        body: formData
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.success) {
          alert('Jelszo sikeresen modositva!');
          passwordForm.reset();
        } else {
          alert('Hiba: ' + data.message);
        }
      })
      .catch(function(error) {
        alert('Hiba tortent!');
        console.error(error);
      });
    });
  }

  // Foglalások betöltése
  function loadBookings() {
    fetch('../php/get_user_bookings.php')
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.success) {
          displayBookings(data.future, 'future-bookings');
          displayBookings(data.past, 'past-bookings');
        }
      })
      .catch(function(error) {
        console.error('Hiba:', error);
      });
  }

  // Foglalások megjelenítése
  function displayBookings(bookings, containerId) {
    const container = document.getElementById(containerId);
    
    if (!bookings || bookings.length === 0) {
      container.innerHTML = `
        <div class="empty-message">
          <i class="fas fa-calendar-times"></i>
          <p>Nincs meg foglalas</p>
        </div>
      `;
      return;
    }

    let html = '';
    bookings.forEach(function(booking) {
      const isPast = containerId === 'past-bookings';
      const statusClass = isPast ? 'past' : 'confirmed';
      const statusText = isPast ? 'Lezarult' : 'Aktiv';

      html += `
        <div class="booking-item">
          <div class="booking-header">
            <div class="booking-car">${booking.car_name}</div>
            <div class="booking-status ${statusClass}">${statusText}</div>
          </div>
          <div class="booking-details">
            <div class="booking-detail">
              <i class="fas fa-calendar"></i>
              <span>${booking.formatted_date}</span>
            </div>
            <div class="booking-detail">
              <i class="fas fa-money-bill-wave"></i>
              <span>${booking.formatted_price}</span>
            </div>
            <div class="booking-detail">
              <i class="fas fa-clock"></i>
              <span>Foglalva: ${booking.created_at}</span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }
});