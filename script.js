const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const glow = document.querySelector(".cursor-glow");
const revealItems = document.querySelectorAll(".reveal");
const serviceButtons = document.querySelectorAll("[data-filter]");
const serviceCards = document.querySelectorAll(".service-card");
const bookingForm = document.querySelector(".booking-form");
const formNote = document.querySelector("[data-form-note]");
const whatsappLink = document.querySelector("[data-whatsapp-link]");
const fallbackImages = document.querySelectorAll("img[data-fallback]");
const dateInput = document.querySelector('input[name="date"]');
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll("[data-hero-dot]");
const heroCount = document.querySelector("[data-hero-count]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let heroSlideIndex = 0;
let heroSlideTimer;

function setHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  heroSlideIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === heroSlideIndex);
  });

  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === heroSlideIndex;
    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });

  if (heroCount) {
    const current = String(heroSlideIndex + 1).padStart(2, "0");
    const total = String(heroSlides.length).padStart(2, "0");
    heroCount.textContent = `${current} / ${total}`;
  }
}

function stopHeroSlider() {
  window.clearInterval(heroSlideTimer);
}

function startHeroSlider() {
  stopHeroSlider();

  if (reduceMotion.matches || heroSlides.length < 2) {
    return;
  }

  heroSlideTimer = window.setInterval(() => {
    setHeroSlide(heroSlideIndex + 1);
  }, 4600);
}

setHeroSlide(0);
startHeroSlider();

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setHeroSlide(Number(dot.dataset.heroDot || 0));
    startHeroSlider();
  });
});

heroSlider?.addEventListener("mouseenter", stopHeroSlider);
heroSlider?.addEventListener("mouseleave", startHeroSlider);
heroSlider?.addEventListener("focusin", stopHeroSlider);
heroSlider?.addEventListener("focusout", startHeroSlider);
reduceMotion.addEventListener?.("change", startHeroSlider);

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  document.body.classList.toggle("nav-open", isOpen);
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMenu();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});

function closeMenu() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("nav-open");
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  observer.observe(item);
});

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    serviceButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    serviceCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "mousemove",
    (event) => {
      glow.style.opacity = "1";
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );
}

fallbackImages.forEach((image) => {
  image.addEventListener("error", () => {
    if (image.src.includes(image.dataset.fallback)) {
      return;
    }

    image.src = image.dataset.fallback;
  });
});

if (dateInput) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${year}-${month}-${day}`;
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const message = [
    "Hello Aura Atelier, I would like to book an appointment.",
    `Name: ${formData.get("name")}`,
    `Contact: ${formData.get("contact")}`,
    `Service: ${formData.get("service")}`,
    `Preferred date: ${formData.get("date")}`,
    `Preferred time: ${formData.get("time")}`
  ].join("\n");

  whatsappLink.href = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
  whatsappLink.hidden = false;
  formNote.textContent = "Your booking draft is ready. Open WhatsApp to send it to the salon.";
  bookingForm.classList.add("submitted");
});
