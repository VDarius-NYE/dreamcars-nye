// booking.js - Foglalási rendszer
document.addEventListener('DOMContentLoaded', function() {
  let carData = null;
  let bookedDates = [];
  let selectedDate = null;
  let currentMonth = new Date();

  const loading = document.getElementById('loading');
  const bookingContainer = document.getElementById('booking-container');
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');

  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get('carId');

  if (!carId) {
    showError('Nincs kiválasztott autó!');
    return;
  }

  function checkAuthAndLoad() {
    if (typeof window.DreamCarsAuth === 'undefined' || !window.DreamCarsAuth.initialized) {
      setTimeout(checkAuthAndLoad, 100);
      return;
    }

    if (!window.DreamCarsAuth.isLoggedIn) {
      alert('A foglaláshoz be kell jelentkezned!');
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
      return;
    }
    
    loadCarData();
  }

  checkAuthAndLoad();

  function loadCarData() {
    fetch('../php/get_car.php?id=' + carId)
      .then(function(response) { 
        if (!response.ok) throw new Error('HTTP hiba: ' + response.status);
        return response.json(); 
      })
      .then(function(data) {
        if (data.error) {
          showError(data.message);
          return;
        }
        carData = data;
        displayCarInfo();
        loadBookedDates();
      })
      .catch(function(error) {
        showError('Hiba az autó adatainak betöltésekor!');
        console.error('Részletek:', error);
      });
  }

  function displayCarInfo() {
    document.getElementById('car-image').src = carData.img;
    document.getElementById('car-image').alt = carData.nev;
    document.getElementById('car-name').textContent = carData.nev;
    document.getElementById('car-description').textContent = carData.desc;
    document.getElementById('car-year').textContent = carData.evjarat;
    document.getElementById('car-fuel').textContent = carData.uzemanyag;
    document.getElementById('car-price').textContent = carData.arFormat;
    document.getElementById('daily-price').textContent = carData.arFormat;
  }

  function loadBookedDates() {
    fetch('../php/get_bookings.php?carId=' + carId)
      .then(function(response) { 
        if (!response.ok) throw new Error('HTTP hiba: ' + response.status);
        return response.json(); 
      })
      .then(function(data) {
        bookedDates = Array.isArray(data) ? data : [];
        renderCalendar();
        loading.style.display = 'none';
        bookingContainer.style.display = 'grid';
      })
      .catch(function(error) {
        showError('Hiba a foglalások betöltésekor!');
        console.error('Részletek:', error);
      });
  }

  function renderCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) {
      console.error('A calendar elem nem található!');
      return;
    }
    
    calendar.innerHTML = '';

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const monthNames = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június',
                        'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'];
    
    const monthDisplay = document.getElementById('current-month');
    if (monthDisplay) {
      monthDisplay.textContent = monthNames[month] + ' ' + year;
    }

    const dayNames = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
    dayNames.forEach(function(day) {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'calendar-day header';
      dayHeader.textContent = day;
      calendar.appendChild(dayHeader);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    for (let i = 0; i < adjustedFirstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day empty';
      calendar.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;

      const currentDate = new Date(year, month, day);
      const dateString = formatDate(currentDate);

      if (currentDate < today) {
        dayElement.classList.add('disabled');
      } else if (currentDate > oneYearLater) {
        dayElement.classList.add('disabled');
      } else if (isDateBooked(dateString)) {
        dayElement.classList.add('booked');
      } else {
        dayElement.classList.add('available');
        dayElement.addEventListener('click', function() {
          selectDate(currentDate, dateString);
        });
      }

      if (selectedDate && selectedDate === dateString) {
        dayElement.classList.remove('available');
        dayElement.classList.add('selected');
      }

      calendar.appendChild(dayElement);
    }
  }

  function isDateBooked(dateString) {
    return bookedDates.includes(dateString);
  }

  function selectDate(date, dateString) {
    selectedDate = dateString;
    renderCalendar();
    updateSummary(date);
  }

  function updateSummary(date) {
    const dateFormatted = date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    document.getElementById('selected-date').textContent = dateFormatted;
    document.getElementById('total-price').textContent = carData.arFormat;
    document.getElementById('confirm-booking').disabled = false;
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  const prevMonthBtn = document.getElementById('prev-month');
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function() {
      currentMonth.setMonth(currentMonth.getMonth() - 1);
      renderCalendar();
    });
  }

  const nextMonthBtn = document.getElementById('next-month');
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function() {
      currentMonth.setMonth(currentMonth.getMonth() + 1);
      renderCalendar();
    });
  }

  const confirmBtn = document.getElementById('confirm-booking');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function() {
      if (!selectedDate) {
        alert('Válassz dátumot!');
        return;
      }
      window.location.href = 'payment.html?carId=' + carId + '&date=' + selectedDate + '&price=' + carData.ar;
    });
  }

  function showError(message) {
    if (loading) loading.style.display = 'none';
    if (bookingContainer) bookingContainer.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'block';
    if (errorText) errorText.textContent = message;
  }
});