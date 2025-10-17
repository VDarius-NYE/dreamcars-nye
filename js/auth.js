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

      // Bejelentkezés link cseréje profil linkre
      if (loginLink) {
        loginLink.textContent = '👤 ' + userName;
        loginLink.href = '#';
        loginLink.style.color = '#e50914';
        loginLink.style.cursor = 'default';
      }

      // Regisztráció link cseréje kijelentkezés linkre
      if (registerLink) {
        registerLink.textContent = 'Kijelentkezés';
        registerLink.href = '#';
        registerLink.onclick = function(e) {
          e.preventDefault();
          logout();
        };
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
      // Várunk egy kicsit hogy a session biztosan beálljon
      setTimeout(function() {
        checkSession().then(function(data) {
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