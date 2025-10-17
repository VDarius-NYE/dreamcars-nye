// auth.js - Frontend session kezelő
(function() {
  'use strict';

  // Session állapot globális változó
  window.DreamCarsAuth = {
    user: null,
    isLoggedIn: false,
    initialized: false
  };

  // Session ellenőrzése
  async function checkSession(forceRefresh = false) {
    try {
      // Cache busting ha force refresh
      const timestamp = forceRefresh ? '?t=' + Date.now() : '';
      const response = await fetch('../php/check_session.php' + timestamp);
      const data = await response.json();
      
      window.DreamCarsAuth.isLoggedIn = data.loggedIn;
      window.DreamCarsAuth.user = data.user;
      window.DreamCarsAuth.initialized = true;
      
      updateNavigation();
      
      return data;
    } catch (error) {
      console.error('Session ellenőrzési hiba:', error);
      return { loggedIn: false, user: null };
    }
  }

  // Navigáció frissítése
  function updateNavigation() {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    // Keressük meg a bejelentkezés és regisztráció linkeket
    const loginLink = navLinks.querySelector('a[href*="login.html"]');
    const registerLink = navLinks.querySelector('a[href*="register.html"]');

    if (window.DreamCarsAuth.isLoggedIn && window.DreamCarsAuth.user) {
      // Ha be van jelentkezve
      const userName = window.DreamCarsAuth.user.fullname;
      const isAdmin = window.DreamCarsAuth.user.isAdmin == 1;

      // Bejelentkezés link cseréje profil linkre
      if (loginLink) {
        loginLink.textContent = '👤 ' + userName + (isAdmin ? ' (Admin)' : '');
        loginLink.href = '#';
        loginLink.style.color = isAdmin ? '#ffd700' : '#e50914';
        loginLink.style.cursor = 'default';
      }

      // Regisztráció link cseréje kijelentkezés linkre
      if (registerLink) {
        registerLink.textContent = '🚪 Kijelentkezés';
        registerLink.href = '#';
        registerLink.onclick = function(e) {
          e.preventDefault();
          logout();
        };
      }

      // Admin panel link hozzáadása ha admin
      if (isAdmin) {
        addAdminLink(navLinks);
      }
    } else {
      // Ha nincs bejelentkezve, állítsuk vissza az eredeti állapotot
      if (loginLink) {
        loginLink.textContent = 'Bejelentkezés';
        loginLink.href = 'login.html';
        loginLink.style.color = '';
        loginLink.style.cursor = '';
      }

      if (registerLink) {
        registerLink.textContent = 'Regisztráció';
        registerLink.href = 'register.html';
        registerLink.onclick = null;
      }
    }
  }

  // Admin link hozzáadása
  function addAdminLink(navLinks) {
    // Ellenőrizzük, hogy már nincs-e Admin link
    if (navLinks.querySelector('a[href*="admin.html"]')) return;

    // Keressük meg a Foglalás linket
    const bookingLink = navLinks.querySelector('a[href*="booking.html"]');
    
    if (bookingLink && bookingLink.parentElement) {
      // Hozzunk létre új li elemet
      const adminLi = document.createElement('li');
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.textContent = 'Admin Panel';
      adminLink.style.color = '#ffd700';
      adminLi.appendChild(adminLink);
      
      // Beszúrás a Foglalás után
      bookingLink.parentElement.parentNode.insertBefore(adminLi, bookingLink.parentElement.nextSibling);
    }
  }

  // Kijelentkezés
  async function logout() {
    const confirmed = confirm('Biztosan ki szeretnél jelentkezni?');
    if (!confirmed) return;

    try {
      const response = await fetch('../php/logout.php');
      const text = await response.text();
      
      // Sikeres kijelentkezés után frissítjük az oldalt
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Kijelentkezési hiba:', error);
      alert('Hiba történt a kijelentkezés során!');
    }
  }

  // Védett oldal ellenőrzés
  function requireLogin() {
    if (!window.DreamCarsAuth.isLoggedIn) {
      alert('Ehhez az oldalhoz be kell jelentkezned!');
      const currentPage = window.location.pathname;
      window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
    }
  }

  // Már bejelentkezett felhasználó átirányítása
  function redirectIfLoggedIn() {
    if (window.DreamCarsAuth.isLoggedIn) {
      window.location.href = 'index.html';
    }
  }

  // Exportálás
  window.DreamCarsAuth.check = checkSession;
  window.DreamCarsAuth.logout = logout;
  window.DreamCarsAuth.requireLogin = requireLogin;
  window.DreamCarsAuth.redirectIfLoggedIn = redirectIfLoggedIn;

  // Automatikus inicializálás
  document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    
    // Ellenőrizzük van-e login=success paraméter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      // Force refresh a session-nel
      setTimeout(function() {
        checkSession(true).then(function(data) {
          if (data.loggedIn && data.user) {
            alert('Sikeres bejelentkezés! Üdvözöljük, ' + data.user.fullname + '!');
          }
        });
      }, 300);
      
      // Távolítsuk el a paramétert az URL-ből
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  });
})();