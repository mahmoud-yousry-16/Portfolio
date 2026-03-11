const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
if (window.scrollY > 60) {
navbar.classList.add('scrolled');
} else {
navbar.classList.remove('scrolled');
}
updateActiveLink();
handleBackToTop();
});

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
const scrollY = window.scrollY + 100;
sections.forEach(section => {
const top = section.offsetTop;
const height = section.offsetHeight;
const id = section.getAttribute('id');
if (scrollY >= top && scrollY < top + height) {
    navLinks.forEach(l => l.classList.remove('active'));
    const active = document.querySelector(`.nav-link[href="#${id}"]`);
    if (active) active.classList.add('active');
}
});
}

/* ---------- Mobile hamburger ---------- */
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
hamburger.classList.toggle('open');
navLinksMenu.classList.toggle('open');
});

// Close menu on link click
navLinksMenu.querySelectorAll('a').forEach(link => {
link.addEventListener('click', () => {
hamburger.classList.remove('open');
navLinksMenu.classList.remove('open');
});
});

/* ---------- Counter animation (hero stats) ---------- */
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

function animateCounters() {
if (countersStarted) return;
countersStarted = true;
statNums.forEach(num => {
const target = +num.getAttribute('data-target');
const duration = 1600;
const step = target / (duration / 16);
let current = 0;
const timer = setInterval(() => {
    current += step;
    if (current >= target) {
    current = target;
    clearInterval(timer);
    }
    num.textContent = Math.floor(current);
}, 16);
});
}

/* ---------- Intersection Observer for reveal animations ---------- */
const observerOptions = { threshold: 0, rootMargin: '0px 0px -40px 0px' };

// Helper: mark cards as will-animate via JS (graceful degradation if JS disabled)
function initAnimatable(selector) {
document.querySelectorAll(selector).forEach(el => el.classList.add('will-animate'));
}
initAnimatable('.service-card');
initAnimatable('.portfolio-card');

// Fallback: if anything is still invisible after 2 s, force-show it
function forceShowAll() {
document.querySelectorAll('.will-animate:not(.visible)').forEach(el => {
el.classList.add('visible');
});
}
setTimeout(forceShowAll, 2000);

// Service cards
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
    const delay = entry.target.getAttribute('data-delay') || 0;
    setTimeout(() => {
    entry.target.classList.add('visible');
    }, +delay);
    serviceObserver.unobserve(entry.target);
}
});
}, observerOptions);
serviceCards.forEach(card => serviceObserver.observe(card));

// Portfolio cards
const portfolioCards = document.querySelectorAll('.portfolio-card');
const portfolioObserver = new IntersectionObserver((entries) => {
entries.forEach((entry, i) => {
if (entry.isIntersecting) {
    setTimeout(() => {
    entry.target.classList.add('visible');
    }, i * 120);
    portfolioObserver.unobserve(entry.target);
}
});
}, observerOptions);
portfolioCards.forEach(card => portfolioObserver.observe(card));

// Skill circles
const skillCircles = document.querySelectorAll('.circle-svg .progress');
let skillsAnimated = false;
const skillObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting && !skillsAnimated) {
    skillsAnimated = true;
    skillCircles.forEach(circle => {
    const pct = +circle.getAttribute('data-pct');
    const circumference = 2 * Math.PI * 50; // r=50
    const offset = circumference - (pct / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
    });
}
});
}, { threshold: 0.3 });
const skillsSection = document.querySelector('.skills-grid');
if (skillsSection) skillObserver.observe(skillsSection);

// Start counters when hero stats are in view
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
const heroObserver = new IntersectionObserver((entries) => {
if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
}
}, { threshold: 0.5 });
heroObserver.observe(heroStats);
}

/* ---------- Contact form ---------- */
const sendBtn = document.getElementById('sendBtn');
const formMsg = document.getElementById('form-msg');

if (sendBtn) {
sendBtn.addEventListener('click', () => {
const name    = document.getElementById('c-name').value.trim();
const email   = document.getElementById('c-email').value.trim();
const phone   = document.getElementById('c-phone').value.trim();
const service = document.getElementById('c-service').value;
const details = document.getElementById('c-details').value.trim();

if (!name || !email) {
    showMsg('Please fill in at least your name and email.', 'error');
    return;
}
if (!isValidEmail(email)) {
    showMsg('Please enter a valid email address.', 'error');
    return;
}

// Simulate send
sendBtn.disabled = true;
sendBtn.innerHTML = 'Sending… <i class="fa-solid fa-spinner fa-spin"></i>';

setTimeout(() => {
    showMsg('✅ Message sent! I\'ll get back to you soon.', 'success');
    sendBtn.disabled = false;
    sendBtn.innerHTML = 'Send <i class="fa-solid fa-paper-plane"></i>';
    clearForm();
}, 1800);
});
}

function showMsg(text, type) {
formMsg.textContent = text;
formMsg.style.color = type === 'error' ? '#ff5c5c' : 'var(--cyan)';
setTimeout(() => { formMsg.textContent = ''; }, 5000);
}

function isValidEmail(email) {
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearForm() {
['c-name','c-email','c-phone','c-timeline','c-details'].forEach(id => {
document.getElementById(id).value = '';
});
document.getElementById('c-service').selectedIndex = 0;
}

/* ---------- Back to top ---------- */
const backToTop = document.getElementById('backToTop');

function handleBackToTop() {
if (window.scrollY > 400) {
backToTop.classList.add('show');
} else {
backToTop.classList.remove('show');
}
}

if (backToTop) {
backToTop.addEventListener('click', () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
}

/* ---------- Smooth scroll for all anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
const target = document.querySelector(this.getAttribute('href'));
if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
});
});