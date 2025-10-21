// auth.js - Frontend session kezelő
(function() {
  'use strict';

  window.DreamCarsAuth = {
    user: null,
    isLoggedIn: false,
    initialized: false
  };

  // Session ellenőrzés
  async function checkSession(forceRefresh = false) {
    try {
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

  function updateNavigation() {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    const loginLink = navLinks.querySelector('a[href*="login.html"]');
    const registerLink = navLinks.querySelector('a[href*="register.html"]');

    if (window.DreamCarsAuth.isLoggedIn && window.DreamCarsAuth.user) {
      const userName = window.DreamCarsAuth.user.fullname;
      const isAdmin = window.DreamCarsAuth.user.isAdmin == 1;

      if (loginLink) {
          loginLink.textContent = '👤 ' + userName + (isAdmin ? ' (Admin)' : '');
          loginLink.href = 'user.html'; 
          loginLink.style.color = isAdmin ? '#ffd700' : '#e50914';
          loginLink.style.cursor = 'pointer';
      }

      if (registerLink) {
        registerLink.textContent = 'Kijelentkezés';
        registerLink.href = '#';
        registerLink.onclick = function(e) {
          e.preventDefault();
          logout();
        };
      }

      if (isAdmin) {
        addAdminLink(navLinks);
      }
    } else {
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

  function addAdminLink(navLinks) {
    if (navLinks.querySelector('a[href*="admin.html"]')) return;

    const bookingLink = navLinks.querySelector('a[href*="booking.html"]');
    
    if (bookingLink && bookingLink.parentElement) {
      const adminLi = document.createElement('li');
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.textContent = 'Admin Panel';
      adminLink.style.color = '#ffd700';
      adminLi.appendChild(adminLink);
      
      bookingLink.parentElement.parentNode.insertBefore(adminLi, bookingLink.parentElement.nextSibling);
    }
  }

  async function logout() {
    const confirmed = confirm('Biztosan ki szeretnél jelentkezni?');
    if (!confirmed) return;

    try {
      const response = await fetch('../php/logout.php');
      const text = await response.text();
      
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Kijelentkezési hiba:', error);
      alert('Hiba történt a kijelentkezés során!');
    }
  }

  function requireLogin() {
    if (!window.DreamCarsAuth.isLoggedIn) {
      alert('Ehhez az oldalhoz be kell jelentkezned!');
      const currentPage = window.location.pathname;
      window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
    }
  }

  function redirectIfLoggedIn() {
    if (window.DreamCarsAuth.isLoggedIn) {
      window.location.href = 'index.html';
    }
  }

  window.DreamCarsAuth.check = checkSession;
  window.DreamCarsAuth.logout = logout;
  window.DreamCarsAuth.requireLogin = requireLogin;
  window.DreamCarsAuth.redirectIfLoggedIn = redirectIfLoggedIn;

  document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      setTimeout(function() {
        checkSession(true).then(function(data) {
          if (data.loggedIn && data.user) {
            alert('Sikeres bejelentkezés! Üdvözöljük, ' + data.user.fullname + '!');
          }
        });
      }, 300);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  });
})();