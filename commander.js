// ========== CONFIGURATION WHATSAPP ==========
// 📞 Votre numéro WhatsApp (sans le +, sans espaces)
const WHATSAPP_NUMBER = '221770557689';  // ✅ Votre numéro

// 💬 Message personnalisé d'accueil pour le client
const WELCOME_MESSAGE = "🎉 *BIENVENUE CHEZ SAMAKF* 🎉\n\nMerci pour votre confiance ! 🛍️\n\n✅ Votre commande a bien été reçue.\n📞 Notre équipe vous contactera sous 24h pour confirmer la disponibilité et organiser la livraison.\n\n💬 N'hésitez pas à nous poser vos questions ici même.\n\n🇸🇳 *SAMAKF* - Tout ce qu'il faut, au prix qu'il faut.";

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

// ========== GESTION DU PRODUIT DEPUIS LE CATALOGUE ==========
function loadProductFromStorage() {
  const produitNom = localStorage.getItem('produitCommande');
  const produitPrix = localStorage.getItem('produitPrix');
  
  if (produitNom) {
    const produitInput = document.getElementById('produit');
    const prixInput = document.getElementById('prix');
    const produitSelection = document.getElementById('produitSelection');
    const produitNomSpan = document.getElementById('produitNom');
    const produitPrixSpan = document.getElementById('produitPrix');
    
    if (produitInput) {
      produitInput.value = produitNom;
    }
    if (prixInput) {
      prixInput.value = produitPrix || '';
    }
    if (produitSelection) {
      produitSelection.style.display = 'block';
    }
    if (produitNomSpan) {
      produitNomSpan.textContent = produitNom;
    }
    if (produitPrixSpan && produitPrix) {
      produitPrixSpan.textContent = produitPrix;
    }
    
    updateTotal();
  }
}

// ========== CALCUL DU TOTAL ==========
function updateTotal() {
  const quantite = document.getElementById('quantite');
  const prixInput = document.getElementById('prix');
  const totalInput = document.getElementById('total');
  
  if (quantite && prixInput && totalInput) {
    let quantiteValue = parseInt(quantite.value) || 1;
    let prixText = prixInput.value || '';
    
    let prixValue = 0;
    const match = prixText.match(/\d+/);
    if (match) {
      prixValue = parseInt(match[0]);
    }
    
    const total = quantiteValue * prixValue;
    if (total > 0) {
      totalInput.value = total + ' FCFA';
    } else {
      totalInput.value = '';
    }
  }
}

// ========== GESTION LOCALITÉ ==========
const localiteSelect = document.getElementById('localite');
const autreLocaliteGroup = document.getElementById('autreLocaliteGroup');

if (localiteSelect) {
  localiteSelect.addEventListener('change', () => {
    if (localiteSelect.value === 'Autre') {
      autreLocaliteGroup.style.display = 'block';
    } else {
      autreLocaliteGroup.style.display = 'none';
    }
  });
}

// ========== Écouteurs pour le calcul du total ==========
const quantiteInput = document.getElementById('quantite');
if (quantiteInput) {
  quantiteInput.addEventListener('input', updateTotal);
}

// ========== EFFACER LE PRODUIT SÉLECTIONNÉ ==========
const clearProductBtn = document.getElementById('clearProduct');
if (clearProductBtn) {
  clearProductBtn.addEventListener('click', () => {
    localStorage.removeItem('produitCommande');
    localStorage.removeItem('produitPrix');
    
    const produitInput = document.getElementById('produit');
    const prixInput = document.getElementById('prix');
    const produitSelection = document.getElementById('produitSelection');
    
    if (produitInput) produitInput.value = '';
    if (prixInput) prixInput.value = '';
    if (produitSelection) produitSelection.style.display = 'none';
    
    updateTotal();
  });
}

// ========== ENVOI VIA WHATSAPP ==========
function sendToWhatsApp(formData) {
  // Construction du message de commande (ce que vous recevez)
  const commandeMessage = `🛒 *NOUVELLE COMMANDE SAMAKF* 🛒
  
📅 *Date:* ${formData.date}
━━━━━━━━━━━━━━━━━━━━

👤 *INFORMATIONS CLIENT*
• Nom: ${formData.nom} ${formData.prenom || ''}
• Email: ${formData.email}
• Téléphone: ${formData.telephone}

📦 *DÉTAILS DE LA COMMANDE*
• Produit: ${formData.produit}
• Quantité: ${formData.quantite}
• Prix unitaire: ${formData.prix}
• Total: *${formData.total}*

🚚 *LIVRAISON*
• Localité: ${formData.localite === 'Autre' ? formData.autreLocalite : formData.localite}
• Adresse: ${formData.instructions || 'Aucune'}

💰 *PAIEMENT*
• Mode: ${formData.paiement}

━━━━━━━━━━━━━━━━━━━━
📞 Répondez à ce message pour confirmer la commande.

${WELCOME_MESSAGE}`;

  // Encoder le message pour l'URL WhatsApp
  const encodedMessage = encodeURIComponent(commandeMessage);
  
  // Ouvrir WhatsApp Web ou l'application mobile
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  
  // Ouvrir dans un nouvel onglet
  window.open(whatsappUrl, '_blank');
  
  return true;
}

// ========== SAUVEGARDE LOCALE (BACKUP) ==========
function saveOrderLocally(formData) {
  const commandes = JSON.parse(localStorage.getItem('commandes') || '[]');
  commandes.push({ ...formData, id: Date.now(), status: 'envoyee' });
  localStorage.setItem('commandes', JSON.stringify(commandes));
  
  // Afficher dans la console pour déboguer
  console.log('📦 Commande sauvegardée localement:', formData);
  console.table(formData);
}

// ========== AFFICHER LES ALERTES ==========
function showAlert(message, type = 'success') {
  const alertMessage = document.getElementById('alertMessage');
  const alertText = document.getElementById('alertText');
  
  if (alertMessage && alertText) {
    alertText.textContent = message;
    alertMessage.style.backgroundColor = type === 'success' ? '#25D366' : '#dc3545';
    alertMessage.style.display = 'flex';
    
    alertMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      alertMessage.style.display = 'none';
    }, 6000);
  }
}

// ========== VALIDATION ET ENVOI ==========
const commandeForm = document.getElementById('commandeForm');

if (commandeForm) {
  commandeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupération des données
    const formData = {
      produit: document.getElementById('produit')?.value,
      quantite: document.getElementById('quantite')?.value,
      prix: document.getElementById('prix')?.value,
      total: document.getElementById('total')?.value,
      nom: document.getElementById('nom')?.value,
      prenom: document.getElementById('prenom')?.value,
      email: document.getElementById('email')?.value,
      telephone: document.getElementById('telephone')?.value,
      localite: document.getElementById('localite')?.value,
      autreLocalite: document.getElementById('autreLocalite')?.value,
      instructions: document.getElementById('instructions')?.value,
      livraison: document.querySelector('input[name="livraison"]:checked')?.value,
      paiement: document.querySelector('input[name="paiement"]:checked')?.value,
      date: new Date().toLocaleString('fr-FR', { 
        dateStyle: 'full', 
        timeStyle: 'medium' 
      })
    };
    
    // Validation des champs obligatoires
    if (!formData.nom) {
      showAlert('❌ Veuillez entrer votre nom', 'error');
      document.getElementById('nom')?.focus();
      return;
    }
    
    if (!formData.email) {
      showAlert('❌ Veuillez entrer votre email', 'error');
      document.getElementById('email')?.focus();
      return;
    }
    
    if (!formData.telephone) {
      showAlert('❌ Veuillez entrer votre numéro de téléphone', 'error');
      document.getElementById('telephone')?.focus();
      return;
    }
    
    if (!formData.localite) {
      showAlert('❌ Veuillez sélectionner votre Adresse', 'error');
      document.getElementById('localite')?.focus();
      return;
    }
    
    if (!formData.produit) {
      showAlert('❌ Veuillez sélectionner un produit dans le catalogue', 'error');
      return;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert('❌ Veuillez entrer une adresse email valide (ex: nom@domaine.com)', 'error');
      document.getElementById('email')?.focus();
      return;
    }
    
    // Validation téléphone (formats acceptés: 766546175, 776546175, 221766546175, +221766546175)
    const phoneClean = formData.telephone.replace(/[\s\+]/g, '');
    const phoneRegex = /^(221)?[67][0-9]{8}$/;
    if (!phoneRegex.test(phoneClean)) {
      showAlert('❌ Numéro invalide. Utilisez un format comme 76 654 61 75 ou +221 76 654 61 75', 'error');
      document.getElementById('telephone')?.focus();
      return;
    }
    
    // Sauvegarder le numéro formaté
    formData.telephone = phoneClean;
    
    const submitButton = document.querySelector('.btn-submit');
    const originalText = submitButton.innerHTML;
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fab fa-whatsapp"></i> Redirection vers WhatsApp...';
    
    // Sauvegarder dans localStorage pour historique
    saveOrderLocally(formData);
    
    // Petit délai pour que l'utilisateur voie le message
    setTimeout(() => {
      // Envoyer via WhatsApp
      sendToWhatsApp(formData);
      
      // Afficher le message de succès
      showAlert('✅ Commande préparée ! WhatsApp va s\'ouvrir. Envoyez le message pour finaliser votre commande.', 'success');
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        commandeForm.reset();
        localStorage.removeItem('produitCommande');
        localStorage.removeItem('produitPrix');
        const produitSelection = document.getElementById('produitSelection');
        if (produitSelection) produitSelection.style.display = 'none';
        const autreGroup = document.getElementById('autreLocaliteGroup');
        if (autreGroup) autreGroup.style.display = 'none';
      }, 2000);
      
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }, 500);
  });
}

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
  loadProductFromStorage();
  updateTotal();
  
  // Vérifier si on vient du catalogue avec un produit
  const urlParams = new URLSearchParams(window.location.search);
  const produit = urlParams.get('produit');
  const prix = urlParams.get('prix');
  
  if (produit) {
    document.getElementById('produit').value = decodeURIComponent(produit);
    document.getElementById('prix').value = decodeURIComponent(prix || '');
    document.getElementById('produitSelection').style.display = 'block';
    document.getElementById('produitNom').textContent = decodeURIComponent(produit);
    document.getElementById('produitPrix').textContent = decodeURIComponent(prix || '');
    updateTotal();
  }
  
  console.log('📦 Page Commander chargée - WhatsApp configuré pour: +221 77 055 76 89');
});