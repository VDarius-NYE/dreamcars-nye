document.addEventListener('DOMContentLoaded', function() {
  const elements = {
    brandSelect: document.getElementById('brand-select'),
    filterPanel: document.getElementById('filter-panel'),
    carDetails: document.getElementById('car-details'),
    fuelFilter: document.getElementById('fuel-filter'),
    yearFilter: document.getElementById('year-filter'),
    priceFilter: document.getElementById('price-filter')
  };

  // Ellenőrizzük, hogy minden elem megvan-e
  const missingElements = Object.entries(elements)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingElements.length > 0) {
    console.error('Hiányzó elemek:', missingElements);
    alert('HIBA: Hiányzó HTML elemek: ' + missingElements.join(', '));
    return;
  }

  console.log('✅ Minden elem megvan, inicializálás sikeres!');

  const state = {
    currentBrand: null,
    cars: []
  };

  initBrands();

  elements.brandSelect.addEventListener('change', handleBrandChange);
  elements.fuelFilter.addEventListener('change', applyFilters);
  elements.yearFilter.addEventListener('change', applyFilters);
  elements.priceFilter.addEventListener('input', debounce(applyFilters, 500));

  function initBrands() {
    const url = '../php/get_brands.php';
    
    fetch(url)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP hiba: ' + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        if (!Array.isArray(data)) {
          throw new Error('nem tömb: ' + typeof data);
        }

        if (data.length === 0) {
          console.warn('Nincsenek márkák az adatbázisban');
          elements.brandSelect.innerHTML += '<option disabled>Nincsenek elérhető márkák</option>';
          return;
        }

        data.forEach(function(brand) {
          const option = document.createElement('option');
          option.value = brand;
          option.textContent = brand;
          elements.brandSelect.appendChild(option);
        });
      })
      .catch(function(error) {
        alert('Hiba: Nem sikerült betölteni a márkákat!\n\n' + error.message);
      });
  }

  function handleBrandChange() {
    const brand = elements.brandSelect.value;
    
    if (!brand) {
      elements.filterPanel.style.display = 'none';
      elements.carDetails.innerHTML = '<div class="empty-message" style="grid-column: 1 / -1;"><p>🚗 Válassz egy márkát a keresés megkezdéséhez!</p></div>';
      return;
    }

    state.currentBrand = brand;
    elements.filterPanel.style.display = 'block';
    
    elements.fuelFilter.value = '';
    elements.yearFilter.value = '';
    elements.priceFilter.value = '';
    
    loadCars(brand);
  }

  function loadCars(brand) {
    showLoading(elements.carDetails, 'Autók betöltése...');

    let url = '../php/get_cars.php?marka=' + encodeURIComponent(brand);
    
    const fuel = elements.fuelFilter.value;
    const year = elements.yearFilter.value;
    const maxPrice = elements.priceFilter.value;
    
    if (fuel) url += '&fuel=' + fuel;
    if (year) url += '&year=' + year;
    if (maxPrice) url += '&maxPrice=' + maxPrice;

    fetch(url)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('HTTP hiba: ' + response.status);
        }
        return response.json();
      })
      .then(function(cars) {
        if (!Array.isArray(cars)) {
          throw new Error('A válasz nem tömb');
        }

        state.cars = cars;
        displayCars(cars);
      })
      .catch(function(error) {
        showError('Nem sikerült betölteni az autókat: ' + error.message);
      });
  }

  function applyFilters() {
    if (!state.currentBrand) return;
    loadCars(state.currentBrand);
  }

  function displayCars(cars) {
    if (!cars || cars.length === 0) {
      elements.carDetails.innerHTML = `
        <div class="empty-message">
          <p>😔 Nincs találat a megadott szűrőkkel.</p>
          <p style="font-size: 0.9rem; margin-top: 10px;">Próbálj más szűrőket használni!</p>
        </div>
      `;
      return;
    }

    let html = '';
    
    cars.forEach(function(car) {
      html += `
        <div class="car-card" data-car-id="${car.id}">
          <img src="${car.img}" alt="${car.nev}" onerror="this.onerror=null; this.src='../assets/placeholder.jpg';">
          <div class="car-card-content">
            <h3>${car.nev}</h3>
            <p class="car-desc">${car.desc}</p>
            <div class="car-details-list">
              <ul>
                <li><strong>Évjárat:</strong> <span>${car.evjarat}</span></li>
                <li><strong>Üzemanyag:</strong> <span>${car.uzemanyag}</span></li>
                <li><strong>Ár:</strong> <span>${car.arFormat}</span></li>
              </ul>
            </div>
            <button class="car-book-btn" data-car-id="${car.id}" data-car-name="${car.nev}">
              🎫 Foglalás
            </button>
          </div>
        </div>
      `;
    });

    elements.carDetails.innerHTML = html;
    
    // Foglalás gombok eseménykezelői
    const bookButtons = document.querySelectorAll('.car-book-btn');
    bookButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const carId = this.getAttribute('data-car-id');
        const carName = this.getAttribute('data-car-name');
        handleBooking(carId, carName);
      });
    });
  }

  function handleBooking(carId, carName) {
    // Itt lehet továbbfejleszteni: modal ablak, vagy átirányítás a booking oldalra
    const confirmed = confirm('Szeretnéd lefoglalni a következő autót?\n\n' + carName + '\n\nFolytatod a foglalást?');
    
    if (confirmed) {
      // Átirányítás a foglalási oldalra az autó ID-jával
      window.location.href = 'booking.html?carId=' + carId + '&brand=' + encodeURIComponent(state.currentBrand);
    }
  }

  function showLoading(element, message) {
    element.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #999;">
        <p style="font-size: 1.2rem;">⏳ ${message}</p>
      </div>
    `;
  }

  function showError(message) {
    elements.carDetails.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e50914;">
        <p style="font-size: 1.2rem;">❌ ${message}</p>
        <p style="font-size: 0.9rem; margin-top: 10px; color: #999;">Ellenőrizd a konzolt további információkért!</p>
      </div>
    `;
  }

  function debounce(func, delay) {
    let timeoutId;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function() {
        func.apply(context, args);
      }, delay);
    };
  }
});