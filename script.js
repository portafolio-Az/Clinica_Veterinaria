// ===== DOM ELEMENTS =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const heroSlider = document.getElementById('heroSlider');
const slides = document.querySelectorAll('.slide');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
const sliderDots = document.querySelectorAll('.dot');
const progressBar = document.getElementById('progressBar');
const teamSlider = document.querySelector('.team-slider');
const teamMembers = document.querySelectorAll('.team-member');
const prevTeamBtn = document.getElementById('prevTeam');
const nextTeamBtn = document.getElementById('nextTeam');
const teamDots = document.querySelectorAll('.team-dot');
const appointmentForm = document.getElementById('appointmentForm');
const newsletterForm = document.querySelector('.newsletter-form');
const backToTopBtn = document.getElementById('backToTop');
const statNumbers = document.querySelectorAll('.stat-number');

// ===== VARIABLES =====
let currentSlide = 0;
let currentTeamMember = 0;
let slideInterval;
let isSliderPaused = false;
const slideDuration = 6000; // 6 seconds

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

// ===== MOBILE MENU TOGGLE =====
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== IMPROVED HERO SLIDER FUNCTIONS =====
function showSlide(index) {
    // Validate index
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    // Reset all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    sliderDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide
    slides[index].classList.add('active');
    sliderDots[index].classList.add('active');
    currentSlide = index;
    
    // Update progress bar
    progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
    
    // Preload next image for smoother transitions
    preloadNextImage();
}

function preloadNextImage() {
    const nextIndex = (currentSlide + 1) % slides.length;
    const nextSlide = slides[nextIndex];
    const nextImage = nextSlide.querySelector('img');
    
    if (nextImage && !nextImage.complete) {
        const img = new Image();
        img.src = nextImage.src;
    }
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, slideDuration);
    isSliderPaused = false;
}

function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
    isSliderPaused = true;
}

function toggleSlider() {
    if (isSliderPaused) {
        startSlideShow();
    } else {
        stopSlideShow();
    }
}

// Initialize slider
showSlide(0);
startSlideShow();

// Preload all slider images on page load
window.addEventListener('load', () => {
    slides.forEach((slide, index) => {
        if (index !== 0) { // Skip first slide as it's already loaded
            const img = slide.querySelector('img');
            if (img) {
                const preloadImg = new Image();
                preloadImg.src = img.src;
            }
        }
    });
});

// ===== SLIDER CONTROLS =====
prevSlideBtn.addEventListener('click', () => {
    prevSlide();
    stopSlideShow();
    startSlideShow();
});

nextSlideBtn.addEventListener('click', () => {
    nextSlide();
    stopSlideShow();
    startSlideShow();
});

// Dot navigation
sliderDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        showSlide(slideIndex);
        stopSlideShow();
        startSlideShow();
    });
});

// Pause slider on hover
heroSlider.addEventListener('mouseenter', stopSlideShow);
heroSlider.addEventListener('mouseleave', startSlideShow);

// Pause slider on touch for mobile devices
if ('ontouchstart' in window) {
    heroSlider.addEventListener('touchstart', stopSlideShow);
    heroSlider.addEventListener('touchend', () => {
        setTimeout(startSlideShow, 5000); // Restart after 5 seconds
    });
}

// ===== TEAM SLIDER FUNCTIONS =====
function showTeamMember(index) {
    // Validate index
    if (index < 0) index = teamMembers.length - 1;
    if (index >= teamMembers.length) index = 0;
    
    // Hide all team members
    teamMembers.forEach(member => {
        member.classList.remove('active');
    });
    teamDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current team member
    teamMembers[index].classList.add('active');
    teamDots[index].classList.add('active'); // CORREGIDO: .classList.add en lugar de .class.add
    currentTeamMember = index;
}

function nextTeamMember() {
    showTeamMember(currentTeamMember + 1);
}

function prevTeamMember() {
    showTeamMember(currentTeamMember - 1);
}

// Initialize team slider
showTeamMember(0);

// Team slider controls
prevTeamBtn.addEventListener('click', prevTeamMember);
nextTeamBtn.addEventListener('click', nextTeamMember);

// Team dot navigation
teamDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const memberIndex = parseInt(dot.getAttribute('data-team'));
        showTeamMember(memberIndex);
    });
});

// ===== ANIMATED COUNTER FOR STATS =====
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

function initCounters() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        // Reset to 0 before animating
        stat.textContent = '0';
        animateCounter(stat, target, 2000);
    });
}

// Initialize counters when section is in view
const aboutSection = document.querySelector('.about-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

observer.observe(aboutSection);

// ===== FORM VALIDATION =====
if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const pet = document.getElementById('pet').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        
        // Basic validation
        if (!name || !phone || !email || !pet || !service || !date) {
            showNotification('Por favor, completa todos los campos obligatorios', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, introduce un email válido', 'error');
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[0-9\-\+\s\(\)]{7,}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Por favor, introduce un teléfono válido', 'error');
            return;
        }
        
        // Date validation (should be today or future)
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('La fecha de la cita no puede ser en el pasado', 'error');
            return;
        }
        
        // Show success message
        showNotification(`¡Cita solicitada con éxito para ${pet}! Te contactaremos pronto para confirmar.`, 'success');
        
        // Reset form
        appointmentForm.reset();
        
        // Reset date to today
        const todayStr = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = todayStr;
    });
}

// Newsletter form
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email) {
            showNotification('Por favor, introduce tu correo electrónico', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, introduce un email válido', 'error');
            return;
        }
        
        showNotification('¡Gracias por suscribirte a nuestro boletín!', 'success');
        emailInput.value = '';
    });
}

// ===== NOTIFICATION FUNCTION =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close notification on button click
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// ===== ADD NOTIFICATION STYLES =====
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--dark);
        color: white;
        padding: 20px 25px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-heavy);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 400px;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background-color: var(--success);
    }
    
    .notification.error {
        background-color: var(--danger);
    }
    
    .notification p {
        margin: 0;
        padding-right: 20px;
        font-weight: 500;
    }
    
    .close-notification {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    @media (max-width: 768px) {
        .notification {
            top: 80px;
            right: 15px;
            left: 15px;
            max-width: none;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Scroll to element
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== BACK TO TOP FUNCTIONALITY =====
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== UPDATE ACTIVE NAV LINK ON SCROLL =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollY = window.pageYOffset + headerHeight + 100;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===== INITIALIZE PAGE =====
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date for appointment form to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }
    
    // Show a welcome notification
    setTimeout(() => {
        showNotification('¡Bienvenido a VetCare Center! Tu mascota en las mejores manos.', 'success');
    }, 1500);
    
    // Initialize active nav link
    updateActiveNavLink();
});

// ===== FIX FOR MOBILE VIEWPORT HEIGHT =====
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial set
setVH();

// Update on resize
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

// ===== PREVENT FORM SUBMISSION ON ENTER KEY =====
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
            e.preventDefault();
        }
    });
});

// ===== IMAGE ERROR HANDLING =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // Replace broken image with a placeholder
        this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231E88E5"/><text x="200" y="150" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">🐾 VetCare Center</text></svg>';
        this.alt = 'Imagen no disponible';
    });
});