// ========== NAVIGATION ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.innerHTML = navLinks.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    if (navToggle) {
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

// ========== BACK TO TOP ==========
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== GESTION DU FORMULAIRE ==========
const contactForm = document.getElementById('contactForm');
const alertMessage = document.getElementById('alertMessage');
const alertText = document.getElementById('alertText');

function showAlert(message, type = 'success') {
  if (alertMessage && alertText) {
    alertText.textContent = message;
    alertMessage.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    alertMessage.style.display = 'flex';
    
    // Scroll to alert
    alertMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide after 5 seconds
    setTimeout(() => {
      alertMessage.style.display = 'none';
    }, 5000);
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  if (!phone) return true;
  const re = /^(\+221)?[67][0-9]{8}$/;
  return re.test(phone);
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupération des données
    const formData = {
      nom: document.getElementById('nom')?.value.trim(),
      prenom: document.getElementById('prenom')?.value.trim(),
      email: document.getElementById('email')?.value.trim(),
      telephone: document.getElementById('telephone')?.value.trim(),
      sujet: document.getElementById('sujet')?.value,
      message: document.getElementById('message')?.value.trim(),
      newsletter: document.getElementById('newsletter')?.checked,
      date: new Date().toLocaleString()
    };
    
    // Validations
    if (!formData.nom) {
      showAlert('Veuillez entrer votre nom', 'error');
      document.getElementById('nom')?.focus();
      return;
    }
    
    if (!formData.prenom) {
      showAlert('Veuillez entrer votre prénom', 'error');
      document.getElementById('prenom')?.focus();
      return;
    }
    
    if (!formData.email) {
      showAlert('Veuillez entrer votre adresse email', 'error');
      document.getElementById('email')?.focus();
      return;
    }
    
    if (!validateEmail(formData.email)) {
      showAlert('Veuillez entrer une adresse email valide', 'error');
      document.getElementById('email')?.focus();
      return;
    }
    
    if (formData.telephone && !validatePhone(formData.telephone)) {
      showAlert('Veuillez entrer un numéro de téléphone valide (ex: 771234567 ou +221771234567)', 'error');
      document.getElementById('telephone')?.focus();
      return;
    }
    
    if (!formData.sujet) {
      showAlert('Veuillez sélectionner un sujet', 'error');
      document.getElementById('sujet')?.focus();
      return;
    }
    
    if (!formData.message) {
      showAlert('Veuillez écrire votre message', 'error');
      document.getElementById('message')?.focus();
      return;
    }
    
    // Simulation d'envoi (remplacer par un appel API réel)
    const submitButton = document.querySelector('.btn-submit');
    const originalText = submitButton.innerHTML;
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    // Simuler un délai d'envoi
    setTimeout(() => {
      // Sauvegarder dans localStorage (optionnel)
      const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      messages.push(formData);
      localStorage.setItem('contactMessages', JSON.stringify(messages));
      
      // Afficher le message de succès
      showAlert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
      
      // Réinitialiser le formulaire
      contactForm.reset();
      
      // Réinitialiser le bouton
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
      
      // Optionnel : envoyer un email via un service comme EmailJS
      // sendEmail(formData);
    }, 1500);
  });
}

// ========== PRÉ-REMPLISSAGE DEPUIS L'URL (optionnel) ==========
function prefillFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const sujet = urlParams.get('sujet');
  
  if (sujet) {
    const sujetSelect = document.getElementById('sujet');
    if (sujetSelect) {
      // Vérifier si la valeur existe dans les options
      for (let i = 0; i < sujetSelect.options.length; i++) {
        if (sujetSelect.options[i].value === sujet) {
          sujetSelect.value = sujet;
          break;
        }
      }
    }
  }
}

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
  prefillFromURL();
  console.log('Page Contact chargée avec succès !');
});