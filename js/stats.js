// stats.js - Statisztikák betöltése
(function() {
  'use strict';

  // Statisztikák betöltése
  async function loadStats() {
    try {
      const response = await fetch('../php/get_stats.php');
      const stats = await response.json();
      
      if (stats.error) {
        console.error('Statisztika hiba:', stats.message);
        return;
      }
      
      animateCounter('stat-users', 0, stats.users, 2000);
      animateCounter('stat-bookings', 0, stats.bookings, 2000);
      animateCounter('stat-cars', 0, stats.cars, 2000);
      
    } catch (error) {
      console.error('Statisztika betöltési hiba:', error);
    }
  }

  function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(function() {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString('hu-HU');
    }, 16);
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.stats-section')) {
      loadStats();
    }
  });
})();