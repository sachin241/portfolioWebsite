const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const revealItems = document.querySelectorAll('.fade-in');
const mobileToggle = document.querySelector('.mobile-toggle');
const navList = document.querySelector('.nav-list');
const navWrap = document.querySelector('.nav-wrap');

function setActiveLink() {
  const offset = window.scrollY + window.innerHeight * 0.35;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (offset >= top && offset < top + height) {
      navLinks.forEach((nav) => nav.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
}

function updateHeaderState() {
  if (!navWrap) return;
  if (window.scrollY > 24) {
    navWrap.classList.add('scrolled');
  } else {
    navWrap.classList.remove('scrolled');
  }
}

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function toggleMobileNav() {
  navList.classList.toggle('open');
}

function closeMobileNav() {
  navList.classList.remove('open');
}

mobileToggle?.addEventListener('click', toggleMobileNav);
navLinks.forEach((link) => link.addEventListener('click', closeMobileNav));

window.addEventListener('scroll', () => {
  setActiveLink();
  updateHeaderState();
});

window.addEventListener('load', () => {
  setActiveLink();
  updateHeaderState();
  initScrollReveal();
});

const typeText = (element, text, speed = 120) => {
  let index = 0;
  const runner = () => {
    if (index <= text.length) {
      element.textContent = text.slice(0, index++);
      setTimeout(runner, speed);
    }
  };
  runner();
};

const typingTarget = document.querySelector('.typed-text');
if (typingTarget) {
  typeText(typingTarget, 'Aspiring Software Engineer', 80);
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Simulate form submission
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';
    
    // Reset form
    contactForm.reset();
    
    // Hide success after 5 seconds
    setTimeout(() => {
      formSuccess.style.display = 'none';
      contactForm.style.display = 'block';
    }, 5000);
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
