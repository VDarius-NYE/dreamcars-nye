const track = document.querySelector('.slider-track');
const slides = Array.from(track.children);
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

let currentIndex = 0;

function getSlideWidth() {
  const gap = parseInt(getComputedStyle(track).gap) || 0;
  return slides[0].getBoundingClientRect().width + gap;
}

function getVisibleCount() {
  const viewportWidth = document.querySelector('.slider-container').offsetWidth;
  const slideWidth = getSlideWidth();
  return Math.max(1, Math.floor(viewportWidth / slideWidth));
}

function updateSlider() {
  const slideWidth = getSlideWidth();
  const visibleCount = getVisibleCount();

  // utolsó index, aminél még teljes sor látszik
  const maxIndex = Math.max(0, slides.length - visibleCount);

  if (currentIndex > maxIndex) currentIndex = maxIndex;
  if (currentIndex < 0) currentIndex = 0;

  let newTranslateX = -slideWidth * currentIndex;

  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(${newTranslateX}px)`;

  // gombok elrejtése a széleken
  prevBtn.style.display = currentIndex === 0 ? "none" : "block";
  nextBtn.style.display = currentIndex === maxIndex ? "none" : "block";
}

prevBtn.addEventListener('click', () => {
  currentIndex--;
  updateSlider();
});

nextBtn.addEventListener('click', () => {
  currentIndex++;
  updateSlider();
});

window.addEventListener('resize', updateSlider);

// induláskor
updateSlider();
