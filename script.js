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

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }
});

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
