const carSelect = document.getElementById('car-select');
const carDetails = document.getElementById('car-details');
const bookBtn = document.getElementById('book-btn');

const EMPTY_MESSAGE = `<span class="empty-message">Kérem válasszon egy autót!</span>`;
carDetails.innerHTML = EMPTY_MESSAGE;

const carData = {
  "gt-r": {
    title: "Nissan GT-R",
    description: "A japán szörnyeteg, amely utcai autóként is pályabajnok.",
    img: "../assets/nissan.png",
    details: `
      <ul>
        <li>Teljesítmény: 565 lóerő</li>
        <li>Gyorsulás 0-100 km/h: 2.9 mp</li>
        <li>Végsebesség: 315 km/h</li>
        <li>Motor: 3.8 literes V6 biturbo</li>
        <li>Kiváló vezetési dinamika és aerodinamika</li>
      </ul>`
  },
  "bmw-m4": {
    title: "BMW M4",
    description: "Német erő és luxus, turbóval megtámogatva.",
    img: "../assets/bmw.png",
    details: `
      <ul>
        <li>Teljesítmény: 503 lóerő</li>
        <li>Gyorsulás 0-100 km/h: 3.8 mp</li>
        <li>Végsebesség: 280 km/h</li>
        <li>Motor: 3.0 literes soros 6 hengeres turbó</li>
        <li>Kényelem és technológia csúcsminőségben</li>
      </ul>`
  },
  "ford-mustang": {
    title: "Ford Mustang",
    description: "Az amerikai izomautó ikon, V8-as bömböléssel.",
    img: "../assets/mustang.jpg",
    details: `
      <ul>
        <li>Teljesítmény: 450 lóerő</li>
        <li>Gyorsulás 0-100 km/h: 4.2 mp</li>
        <li>Végsebesség: 250 km/h</li>
        <li>Motor: 5.0 literes V8</li>
        <li>Klasszikus amerikai stílus</li>
      </ul>`
  }
};

carSelect.addEventListener('change', () => {
  const selected = carSelect.value;
  if (carData[selected]) {
    carDetails.innerHTML = `
      <h3>${carData[selected].title}</h3>
      <img src="${carData[selected].img}" alt="${carData[selected].title}">
      <p>${carData[selected].description}</p>
      <div class="car-details-list">${carData[selected].details}</div>
    `;
    bookBtn.style.display = 'block';
  } else {
    carDetails.innerHTML = EMPTY_MESSAGE;
    bookBtn.style.display = 'none';
  }
});

bookBtn.addEventListener('click', () => {
  window.location.href = 'booking.html';
});