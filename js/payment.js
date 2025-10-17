// payment.js - Fizetési rendszer
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get('carId');
  const date = urlParams.get('date');
  const price = urlParams.get('price');

  if (!carId || !date || !price) {
    alert('Hiányzó foglalási adatok!');
    window.location.href = 'cars.html';
    return;
  }

  // Bejelentkezés ellenőrzése
  setTimeout(function() {
    if (!window.DreamCarsAuth.isLoggedIn) {
      alert('A fizetéshez be kell jelentkezned!');
      window.location.href = 'login.html';
      return;
    }
    loadSummary();
  }, 500);

  // Összegzés betöltése
  function loadSummary() {
    fetch('../php/get_car.php?id=' + carId)
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.error) {
          alert('Hiba: ' + data.message);
          window.location.href = 'cars.html';
          return;
        }

        displaySummary(data, date, price);
      })
      .catch(function(error) {
        alert('Hiba az adatok betöltésekor!');
        console.error(error);
      });
  }

  // Összegzés megjelenítése
  function displaySummary(car, bookingDate, totalPrice) {
    const formattedDate = new Date(bookingDate).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedPrice = parseInt(totalPrice).toLocaleString('hu-HU') + ' Ft';

    document.getElementById('summary-details').innerHTML = `
      <div class="summary-item">
        <span>Autó:</span>
        <strong>${car.nev}</strong>
      </div>
      <div class="summary-item">
        <span>Dátum:</span>
        <strong>${formattedDate}</strong>
      </div>
      <div class="summary-item">
        <span>Napi díj:</span>
        <strong>${formattedPrice}</strong>
      </div>
      <div class="summary-total">
        <span>Fizetendő:</span>
        <span class="amount">${formattedPrice}</span>
      </div>
    `;

    document.getElementById('pay-amount').textContent = formattedPrice;
  }

  // Fizetési mód váltás
  const paymentMethods = document.querySelectorAll('.payment-method');
  paymentMethods.forEach(function(method) {
    method.addEventListener('click', function() {
      paymentMethods.forEach(function(m) { m.classList.remove('active'); });
      this.classList.add('active');
      this.querySelector('input[type="radio"]').checked = true;

      const selectedMethod = this.querySelector('input[type="radio"]').value;
      if (selectedMethod === 'card') {
        document.getElementById('card-payment').style.display = 'block';
        document.getElementById('paypal-payment').style.display = 'none';
      } else {
        document.getElementById('card-payment').style.display = 'none';
        document.getElementById('paypal-payment').style.display = 'block';
      }
    });
  });

  // Kártyaszám formázás
  const cardNumber = document.getElementById('card-number');
  if (cardNumber) {
    cardNumber.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g);
      e.target.value = formattedValue ? formattedValue.join(' ') : '';
    });
  }

  // Lejárat formázás
  const cardExpiry = document.getElementById('card-expiry');
  if (cardExpiry) {
    cardExpiry.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // CVV formázás
  const cardCvv = document.getElementById('card-cvv');
  if (cardCvv) {
    cardCvv.addEventListener('input', function(e) {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
  }

  // Form submit
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const payButton = document.querySelector('.pay-button');
      payButton.disabled = true;
      payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Feldolgozás...';

      // Szimuláljuk a fizetési folyamatot
      setTimeout(function() {
        processPayment();
      }, 2000);
    });
  }

  // Fizetés feldolgozása
  function processPayment() {
    const formData = new FormData();
    formData.append('carId', carId);
    formData.append('date', date);
    formData.append('price', price);

    fetch('../php/process_booking.php', {
      method: 'POST',
      body: formData
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
      if (data.success) {
        showSuccessModal();
      } else {
        alert('Hiba: ' + data.message);
        const payButton = document.querySelector('.pay-button');
        payButton.disabled = false;
        payButton.innerHTML = '<i class="fas fa-lock"></i> Fizetés: <span id="pay-amount">' + 
                             parseInt(price).toLocaleString('hu-HU') + ' Ft</span>';
      }
    })
    .catch(function(error) {
      alert('Hiba történt a foglalás során!');
      console.error(error);
      const payButton = document.querySelector('.pay-button');
      payButton.disabled = false;
      payButton.innerHTML = '<i class="fas fa-lock"></i> Fizetés: <span id="pay-amount">' + 
                           parseInt(price).toLocaleString('hu-HU') + ' Ft</span>';
    });
  }

  function showSuccessModal() {
    document.getElementById('success-modal').classList.add('show');
  }
});