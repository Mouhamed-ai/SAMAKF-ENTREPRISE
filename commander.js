// ========== CONFIGURATION ==========
const WHATSAPP_NUMBER = '221770557689'; // Remplacez par votre numéro WhatsApp (sans +)
let panier = [];

// ========== CHARGEMENT / SAUVEGARDE ==========
function chargerPanier() {
  const saved = localStorage.getItem('panier_samakf');
  if (saved) {
    panier = JSON.parse(saved);
  }
  afficherPanier();
}

function sauvegarderPanier() {
  localStorage.setItem('panier_samakf', JSON.stringify(panier));
  afficherPanier();
}

// ========== AJOUTER UN PRODUIT ==========
function ajouterProduit(nom, prix, quantite = 1) {
  const prixValue = parseInt(prix.match(/\d+/)?.[0] || 0);
  const existing = panier.find(item => item.nom === nom);
  
  if (existing) {
    existing.quantite += quantite;
    afficherMessage(`✅ ${quantite} x ${nom} ajouté (Total: ${existing.quantite})`);
  } else {
    panier.push({
      id: Date.now(),
      nom: nom,
      prix: prix,
      prixValue: prixValue,
      quantite: quantite
    });
    afficherMessage(`✅ ${quantite} x ${nom} ajouté au panier !`);
  }
  sauvegarderPanier();
}

// ========== MODIFIER / SUPPRIMER ==========
function modifierQuantite(id, delta) {
  const index = panier.findIndex(item => item.id === id);
  if (index !== -1) {
    const nouvelleQte = panier[index].quantite + delta;
    if (nouvelleQte > 0) {
      panier[index].quantite = nouvelleQte;
    } else {
      panier.splice(index, 1);
    }
    sauvegarderPanier();
  }
}

function supprimerProduit(id) {
  panier = panier.filter(item => item.id !== id);
  sauvegarderPanier();
  afficherMessage('🗑️ Produit retiré du panier');
}

// ========== CALCUL TOTAUX ==========
function calculerTotaux() {
  const sousTotal = panier.reduce((sum, item) => sum + (item.prixValue * item.quantite), 0);
  const livraisonRadio = document.querySelector('input[name="livraison"]:checked');
  const fraisLivraison = (livraisonRadio && livraisonRadio.value === 'Livraison à domicile') ? 500 : 0;
  return { sousTotal, fraisLivraison, total: sousTotal + fraisLivraison };
}

// ========== AFFICHAGE ==========
function afficherPanier() {
  const panierVide = document.getElementById('panierVide');
  const panierRempli = document.getElementById('panierRempli');
  const listeProduits = document.getElementById('listeProduits');
  const btnCommander = document.getElementById('btnValiderCommande');

  if (panier.length === 0) {
    if (panierVide) panierVide.style.display = 'block';
    if (panierRempli) panierRempli.style.display = 'none';
    if (btnCommander) btnCommander.disabled = true;
    return;
  }

  if (panierVide) panierVide.style.display = 'none';
  if (panierRempli) panierRempli.style.display = 'block';
  if (btnCommander) btnCommander.disabled = false;

  if (listeProduits) {
    listeProduits.innerHTML = panier.map(item => `
      <div class="panier-item">
        <div class="panier-item-info">
          <div class="panier-item-nom">${item.nom}</div>
          <div class="panier-item-prix">${item.prix} l'unité</div>
        </div>
        <div class="panier-item-quantite">
          <button onclick="modifierQuantite(${item.id}, -1)">-</button>
          <span>${item.quantite}</span>
          <button onclick="modifierQuantite(${item.id}, 1)">+</button>
        </div>
        <div class="panier-item-total">${item.prixValue * item.quantite} FCFA</div>
        <button class="panier-item-supprimer" onclick="supprimerProduit(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');
  }

  const { sousTotal, fraisLivraison, total } = calculerTotaux();
  document.getElementById('sousTotal').textContent = sousTotal + ' FCFA';
  document.getElementById('fraisLivraison').textContent = fraisLivraison + ' FCFA';
  document.getElementById('totalGeneral').textContent = total + ' FCFA';
}

// ========== REDIRECTION ==========
function redirectToCatalogue() {
  sauvegarderPanier();
  window.location.href = 'catalogue.html';
}

// ========== ENVOI WHATSAPP ==========
function envoyerCommande() {
  if (panier.length === 0) {
    afficherMessage('❌ Votre panier est vide', 'error');
    return false;
  }

  const nom = document.getElementById('nom').value.trim();
  const prenom = document.getElementById('prenom').value.trim();
  const email = document.getElementById('email').value.trim();
  let telephone = document.getElementById('telephone').value.trim();
  const localite = document.getElementById('localite').value;
  const autreLocalite = document.getElementById('autreLocalite').value;
  const instructions = document.getElementById('instructions').value;
  const paiement = document.querySelector('input[name="paiement"]:checked')?.value;

  if (!nom) { afficherMessage('❌ Entrez votre nom', 'error'); return false; }
  if (!email) { afficherMessage('❌ Entrez votre email', 'error'); return false; }
  if (!telephone) { afficherMessage('❌ Entrez votre téléphone', 'error'); return false; }
  if (!localite) { afficherMessage('❌ Sélectionnez votre localité', 'error'); return false; }

  telephone = telephone.replace(/[\s\+]/g, '');
  
  let produitsListe = '';
  panier.forEach((item, i) => {
    produitsListe += `${i+1}. ${item.nom}\n   - ${item.quantite} x ${item.prix} = ${item.prixValue * item.quantite} FCFA\n`;
  });

  const { sousTotal, fraisLivraison, total } = calculerTotaux();
  const localiteFinale = localite === 'Autre' ? autreLocalite : localite;

  const message = `🛒 *NOUVELLE COMMANDE SAMAKF* 🛒
  
📅 Date: ${new Date().toLocaleString('fr-FR')}
━━━━━━━━━━━━━━━━━━━━

👤 CLIENT
• Nom: ${nom} ${prenom}
• Email: ${email}
• Téléphone: ${telephone}

📦 PRODUITS
${produitsListe}
━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: ${total} FCFA
• Sous-total: ${sousTotal} FCFA


📍 Localité: ${localiteFinale}
📝 Instructions: ${instructions || 'Aucune'}

💳 PAIEMENT: ${paiement}
━━━━━━━━━━━━━━━━━━━━
🎉 SAMAKF - Tout ce qu'il faut, au prix qu'il faut.`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  
  // Vider le panier après commande
  panier = [];
  sauvegarderPanier();
  afficherMessage('✅ Commande envoyée ! WhatsApp va s\'ouvrir.');
  return true;
}

// ========== MESSAGE ==========
function afficherMessage(msg, type = 'success') {
  const alertDiv = document.getElementById('alertMessage');
  const alertText = document.getElementById('alertText');
  if (alertDiv && alertText) {
    alertText.textContent = msg;
    alertDiv.style.backgroundColor = type === 'success' ? '#25D366' : '#dc3545';
    alertDiv.style.display = 'flex';
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      alertDiv.style.display = 'none';
    }, 4000);
  }
}

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
    if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

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

// ========== GESTION LOCALITÉ ==========
const localiteSelect = document.getElementById('localite');
const autreLocaliteGroup = document.getElementById('autreLocaliteGroup');
if (localiteSelect) {
  localiteSelect.addEventListener('change', () => {
    autreLocaliteGroup.style.display = localiteSelect.value === 'Autre' ? 'block' : 'none';
  });
}

// ========== MISE À JOUR DES FRAIS ==========
document.querySelectorAll('input[name="livraison"]').forEach(radio => {
  radio.addEventListener('change', () => afficherPanier());
});

// ========== BOUTONS ==========
const btnAjout = document.getElementById('btnAjoutProduit');
if (btnAjout) {
  btnAjout.addEventListener('click', redirectToCatalogue);
}

const btnCommander = document.getElementById('btnValiderCommande');
if (btnCommander) {
  btnCommander.addEventListener('click', envoyerCommande);
}

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
  chargerPanier();
  
  // Vérifier si on vient du catalogue
  const produitAAjouter = localStorage.getItem('produitAAjouter');
  if (produitAAjouter) {
    const produit = JSON.parse(produitAAjouter);
    ajouterProduit(produit.nom, produit.prix, 1);
    localStorage.removeItem('produitAAjouter');
  }
  
  console.log('📦 Page Commander chargée');
});

// Rendre les fonctions globales
window.modifierQuantite = modifierQuantite;
window.supprimerProduit = supprimerProduit;
window.ajouterProduit = ajouterProduit;