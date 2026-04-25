const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const revealItems = document.querySelectorAll(".fade-in");
const mobileToggle = document.querySelector(".mobile-toggle");
const navList = document.querySelector(".nav-list");
const navWrap = document.querySelector(".nav-wrap");
const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");
const formError = document.getElementById("form-error");
const submitButton = document.getElementById("submit-button");
const typingTarget = document.querySelector(".typed-text");
const loader = document.getElementById("site-loader");
const filterButtons = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.add("loading");

function setActiveLink() {
  const offset = window.scrollY + window.innerHeight * 0.38;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (offset >= top && offset < top + height) {
      navLinks.forEach((nav) => nav.classList.remove("active"));
      link?.classList.add("active");
    }
  });
}

function updateHeaderState() {
  if (!navWrap) return;
  navWrap.classList.toggle("scrolled", window.scrollY > 24);
}

function initScrollReveal() {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function toggleMobileNav() {
  const isOpen = navList?.classList.toggle("open");
  mobileToggle?.classList.toggle("open", Boolean(isOpen));
  mobileToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
}

function closeMobileNav() {
  navList?.classList.remove("open");
  mobileToggle?.classList.remove("open");
  mobileToggle?.setAttribute("aria-expanded", "false");
}

function typeText(element, text, speed = 75) {
  if (!element) return;

  if (prefersReducedMotion) {
    element.textContent = text;
    return;
  }

  let index = 0;
  const runner = () => {
    if (index <= text.length) {
      element.textContent = text.slice(0, index);
      index += 1;
      window.setTimeout(runner, speed);
    }
  };

  runner();
}

function hideLoader() {
  if (!loader) return;

  loader.classList.add("hidden");
  document.body.classList.remove("loading");

  window.setTimeout(() => {
    loader.setAttribute("hidden", "");
  }, 450);
}

function applyProjectFilter(filter) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  projectCards.forEach((card) => {
    const category = card.dataset.category;
    const shouldShow = filter === "all" || category === filter;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

function clearFieldState(fieldName) {
  const input = document.getElementById(fieldName);
  const error = document.getElementById(`${fieldName}-error`);

  input?.classList.remove("invalid");
  if (error) error.textContent = "";
}

function setFieldError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const error = document.getElementById(`${fieldName}-error`);

  input?.classList.add("invalid");
  if (error) error.textContent = message;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateContactForm() {
  const name = document.getElementById("name")?.value.trim() || "";
  const email = document.getElementById("email")?.value.trim() || "";
  const message = document.getElementById("message")?.value.trim() || "";
  let isValid = true;

  ["name", "email", "message"].forEach(clearFieldState);
  formSuccess?.setAttribute("hidden", "");
  formError?.setAttribute("hidden", "");

  if (name.length < 2) {
    setFieldError("name", "Please enter at least 2 characters.");
    isValid = false;
  }

  if (!isValidEmail(email)) {
    setFieldError("email", "Please enter a valid email address.");
    isValid = false;
  }

  if (message.length < 15) {
    setFieldError("message", "Please add a message with at least 15 characters.");
    isValid = false;
  }

  return isValid;
}

async function handleContactSubmit(event) {
  event.preventDefault();

  if (!validateContactForm()) {
    return;
  }

  const endpoint = contactForm?.dataset.formEndpoint?.trim() || "";

  if (!endpoint || endpoint.includes("your-form-id")) {
    formError?.removeAttribute("hidden");
    const errorMessage = formError?.querySelector("p");
    if (errorMessage) {
      errorMessage.textContent = "Add your live Formspree endpoint to enable submissions before deployment.";
    }
    return;
  }

  const formData = {
    name: document.getElementById("name")?.value.trim(),
    email: document.getElementById("email")?.value.trim(),
    message: document.getElementById("message")?.value.trim()
  };

  submitButton?.setAttribute("disabled", "");
  submitButton.textContent = "Sending...";
  formSuccess?.setAttribute("hidden", "");
  formError?.setAttribute("hidden", "");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    contactForm?.reset();
    formSuccess?.removeAttribute("hidden");
  } catch (error) {
    formError?.removeAttribute("hidden");
  } finally {
    submitButton?.removeAttribute("disabled");
    submitButton.textContent = "Send Message";
  }
}

mobileToggle?.addEventListener("click", toggleMobileNav);
navLinks.forEach((link) => link.addEventListener("click", closeMobileNav));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyProjectFilter(button.dataset.filter || "all");
  });
});

["name", "email", "message"].forEach((fieldName) => {
  const field = document.getElementById(fieldName);
  field?.addEventListener("input", () => clearFieldState(fieldName));
});

contactForm?.addEventListener("submit", handleContactSubmit);

window.addEventListener("scroll", () => {
  setActiveLink();
  updateHeaderState();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMobileNav();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileNav();
  }
});

window.addEventListener("load", () => {
  setActiveLink();
  updateHeaderState();
  initScrollReveal();
  applyProjectFilter("all");
  typeText(typingTarget, "Building Web, AI, and Data Experiences");

  if (prefersReducedMotion) {
    hideLoader();
  } else {
    window.setTimeout(hideLoader, 450);
  }
});
