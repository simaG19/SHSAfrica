// ===== SHS AFRICA — Homepage Scripts =====

// 1. Smooth Reveal on Scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
  .forEach((el) => revealObserver.observe(el));

// 2. Navbar scroll effect
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// 3. Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

// Close menu when clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

// 4. Hero Slider (homepage only)
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("sliderDots");

if (slides.length > 0 && dotsContainer) {
  let currentSlide = 0;
  let slideInterval;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.classList.add("slider-dot");
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[currentSlide].classList.remove("active");
    dotsContainer.children[currentSlide].classList.remove("active");
    currentSlide = index;
    slides[currentSlide].classList.add("active");
    dotsContainer.children[currentSlide].classList.add("active");
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5500);
  }

  startSlider();

  // Pause slider on hover
  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    heroSlider.addEventListener("mouseenter", () =>
      clearInterval(slideInterval)
    );
    heroSlider.addEventListener("mouseleave", startSlider);
  }
}

// 5. Stat Counter Animation (homepage only)
const statNumbers = document.querySelectorAll(".stat-number");
let statsCounted = false;

if (statNumbers.length > 0) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateStats();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsBar = document.querySelector(".stats-bar");
  if (statsBar) statsObserver.observe(statsBar);
}

function animateStats() {
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(counter);
        if (target > 2) {
          stat.textContent = target.toLocaleString() + "+";
        } else {
          stat.textContent = target.toLocaleString();
        }
      } else {
        stat.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  });
}

// 6. Highlight current page in Nav
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const linkPath = link.getAttribute("href");
  if (linkPath === currentPath) {
    link.classList.add("active");
  }
});

// ===== GALLERY PAGE FEATURES =====

// 7. Gallery Filter
const filterBtns = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

if (filterBtns.length > 0) {
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}

// 8. Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
let lightboxIndex = 0;

function getVisibleGalleryItems() {
  return Array.from(galleryItems).filter(
    (item) => !item.classList.contains("hidden")
  );
}

function openLightbox(index) {
  const visible = getVisibleGalleryItems();
  if (!visible[index]) return;
  lightboxIndex = index;
  const img = visible[index].querySelector("img");
  const title = visible[index].querySelector("h4");
  if (lightboxImg) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }
  if (lightboxCaption && title) {
    lightboxCaption.textContent = title.textContent;
  }
  if (lightbox) lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (lightbox) lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

if (galleryItems.length > 0) {
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const visible = getVisibleGalleryItems();
      const idx = visible.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    const visible = getVisibleGalleryItems();
    lightboxIndex = (lightboxIndex - 1 + visible.length) % visible.length;
    openLightbox(lightboxIndex);
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    const visible = getVisibleGalleryItems();
    lightboxIndex = (lightboxIndex + 1) % visible.length;
    openLightbox(lightboxIndex);
  });
}

// Keyboard navigation for lightbox
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft" && lightboxPrev) lightboxPrev.click();
  if (e.key === "ArrowRight" && lightboxNext) lightboxNext.click();
});


// ===== CONTACT PAGE FEATURES =====

// 9. Contact Form Submission
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Simulate form submission
    const submitBtn = contactForm.querySelector(".form-submit");
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML =
        'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';
      submitBtn.disabled = false;
      if (formSuccess) formSuccess.classList.add("visible");

      setTimeout(() => {
        if (formSuccess) formSuccess.classList.remove("visible");
      }, 5000);
    }, 1200);
  });
}
