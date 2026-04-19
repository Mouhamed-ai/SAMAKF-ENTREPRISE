// ========== NAVIGATION ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Scroll effect for navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.innerHTML = navLinks.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    if (navToggle) {
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

// ========== ANIMATED TITLE ==========
const animatedTitle = document.getElementById("animated-title");
if (animatedTitle) {
  const originalText = animatedTitle.textContent;
  animatedTitle.textContent = "";
  let index = 0;
  
  function typeWriter() {
    if (index < originalText.length) {
      animatedTitle.textContent += originalText.charAt(index);
      index++;
      setTimeout(typeWriter, 100);
    }
  }
  typeWriter();
}

// ========== COUNTER ANIMATION ==========
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  let current = 0;
  const increment = target / 50;
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  updateCounter();
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        if (counter.textContent === '0') {
          animateCounter(counter);
        }
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.avantages, .apropos').forEach(section => {
  counterObserver.observe(section);
});

// ========== SCROLL REVEAL ANIMATION ==========
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ========== BACK TO TOP BUTTON ==========
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========== NEWSLETTER FORM ==========
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    if (email) {
      // Simulate subscription
      const button = newsletterForm.querySelector('button');
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Abonnement...';
      button.disabled = true;
      
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Abonné !';
        newsletterForm.reset();
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
        }, 2000);
      }, 1500);
    }
  });
}

// ========== SMOOTH SCROLL FOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========== SCROLL INDICATOR CLICK ==========
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const nextSection = document.querySelector('.avantages');
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
}

// ========== VIDEO BACKGROUND OPTIMIZATION ==========
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  // Pause video when not in view to save resources
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroVideo.play();
      } else {
        heroVideo.pause();
      }
    });
  }, { threshold: 0.1 });
  
  videoObserver.observe(heroVideo);
}

// ========== PARALLAX EFFECT ON HERO ==========
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
  }
});

console.log('SAMAKF - Site moderne et dynamique chargé !');