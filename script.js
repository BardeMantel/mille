// Navigation Bar Toggle
const nav_toggle = document.getElementById('nav-toggle');
const nav_links = document.getElementById('nav-links');

nav_toggle.addEventListener('click', () => {
  nav_links.classList.toggle('open');
});

// IMAGE SLIDESHOW

const slides = [...document.querySelectorAll(".image-slide")];

let currentSlide = 0;
let imageTimer;

function updateSlide(index) {
  slides[currentSlide].classList.remove("active");

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add("active");
}

function nextSlide() {
  updateSlide(currentSlide + 1);
}

function previousSlide() {
  updateSlide(currentSlide - 1);
}

function resetImageTimer() {
  clearInterval(imageTimer);
  imageTimer = setInterval(nextSlide, 5000);
}

// Automatic movement
if (slides.length > 1) {
  resetImageTimer();
}

// REVIEW TRACK
const track = document.querySelector(".review-track");
const reviews = [...document.querySelectorAll(".review")];

const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const dots = [...document.querySelectorAll(".dot")];

// Animation durations
const manualDuration = 0.5;
const automaticDuration = 1.5;

// Automatic interval
const automaticInterval = 10000;
let automaticTimer;

// Create copies of the first and last reviews
const firstClone = reviews[0].cloneNode(true);
const lastClone = reviews[reviews.length - 1].cloneNode(true);

// Put the copies at the beginning and end
track.appendChild(firstClone);
track.insertBefore(lastClone, track.firstChild);

// Start at the first real review.
// Index 0 is the last review's clone.
let currentReview = 1;
let isAnimating = false;


// Initial positioning WITHOUT animation
track.style.transition = "none";
track.style.transform = `translateX(-${currentReview * 100}%)`;

// Wait until positioning has been applied
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    track.style.transition = `transform ${manualDuration}s ease`;
    track.style.visibility = "visible";
  });
});


// Update active dots
function updateDots() {
  let dotIndex = currentReview - 1;

  if (currentReview === 0) {
    dotIndex = reviews.length - 1;
  }

  if (currentReview === reviews.length + 1) {
    dotIndex = 0;
  }

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === dotIndex);
  });
}


// Move to a specific review
function moveTo(index, duration) {
  currentReview = index;

  track.style.transition = `transform ${duration}s ease`;
  track.style.transform = `translateX(-${currentReview * 100}%)`;

  updateDots();
}


// Reset automatic timer
function resetAutomaticTimer() {
  clearInterval(automaticTimer);
  automaticTimer = setInterval(automaticReview, automaticInterval);
}


// Manual navigation
function nextReview() {
  if (isAnimating) return;

  isAnimating = true;
  moveTo(currentReview + 1, manualDuration);

  resetAutomaticTimer();
}

function previousReview() {
  if (isAnimating) return;

  isAnimating = true;
  moveTo(currentReview - 1, manualDuration);

  resetAutomaticTimer();
}

// Click anywhere on the review track to move forward
track.addEventListener("click", (event) => {

  // Ignore clicks on navigation buttons
  if (event.target.closest(".previous, .next, .dot")) return;

  nextReview();
});


// Automatic navigation
function automaticReview() {
  if (isAnimating) return;

  isAnimating = true;
  moveTo(currentReview + 1, automaticDuration);
}


// When an animation finishes, check whether we're on a clone
track.addEventListener("transitionend", (event) => {
  if (event.propertyName !== "transform") return;

  // We reached the clone of the first review
  if (currentReview === reviews.length + 1) {
    track.style.transition = "none";
    currentReview = 1;
    track.style.transform = `translateX(-${currentReview * 100}%)`;
  }

  // We reached the clone of the last review
  else if (currentReview === 0) {
    track.style.transition = "none";
    currentReview = reviews.length;
    track.style.transform = `translateX(-${currentReview * 100}%)`;
  }

  updateDots();

  // Restore the animation after invisible repositioning
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      track.style.transition = `transform ${manualDuration}s ease`;
      isAnimating = false;
    });
  });
});


// Arrow buttons
next.addEventListener("click", nextReview);
previous.addEventListener("click", previousReview);


// Indicator dots
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    if (isAnimating) return;

    isAnimating = true;
    moveTo(index + 1, manualDuration);

    resetAutomaticTimer();
  });
});


// Start automatic movement after 10 seconds
resetAutomaticTimer();


// Set the initial active dot
updateDots();
