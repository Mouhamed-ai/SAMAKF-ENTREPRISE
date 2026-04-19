// ========== DONNÉES PRODUITS ==========
const produitsData = {
  "Cahiers": [
    { 
      nom: "Cahier 400 pages 8 matières", 
      description: "Cahier ligné format A4, couverture rigide", 
      prix: "2500 FCFA", 
      stock: 15, 
      image: "image/cahiers.jpeg" 
    },
    { 
      nom: "Cahier 500 pages 8 matières", 
      description: "Cahier quadrillé format A4, papier de qualité", 
      prix: "3700 FCFA", 
      stock: 10, 
      image: "image/cahiers.jpeg" 
    },
    { 
      nom: "Cahier 200 pages", 
      description: "Cahier simple format A4, idéal pour les prises de notes", 
      prix: "1500 FCFA", 
      stock: 25, 
      image: "image/cahiers.jpeg" 
    }
  ],
  "Stylos": [
    { 
      nom: "Stylo  Bleu", 
      description: "Stylo à bille encre bleue, écriture fluide", 
      prix: "100 FCFA", 
      stock: 50, 
      image: "image/stylo bleu.jpeg" 
    },
    { 
      nom: "Stylo  Rouge", 
      description: "Stylo à bille encre rouge, correction facile", 
      prix: "100 FCFA", 
      stock: 45, 
      image: "image/stylo rouge.jpeg" 
    },
    { 
      nom: "Stylo Noir", 
      description: "Stylo plume avec cartouches d'encre", 
      prix: "100 FCFA", 
      stock: 8, 
      image: "image/stylo noir.jpeg" 
    }
  ],

  "Miel": [
    { 
      nom: "Miel Naturel ", 
      description: "Miel pur 100% naturel, récolté localement", 
      prix: "2500 FCFA", 
      stock: 12, 
      image: "image/miel.jpeg" 
    },
    { 
      nom: "Miel Naturel 1kg", 
      description: "Miel pur 100% naturel, format familial", 
      prix: "4500 FCFA", 
      stock: 8, 
      image: "image/miel.jpeg" 
    }
  ],
  "Ram de Papier": [
    { 
      nom: "Ramette A4 500 feuilles", 
      description: "Papier blanc 80g, qualité bureau", 
      prix: "3000 FCFA", 
      stock: 20, 
      image: "image/RAM de papier.jpeg" 
    },
    { 
      nom: "Ramette A4 500 feuilles (lot de 5)", 
      description: "Lot économique de 5 ramettes", 
      prix: "14000 FCFA", 
      stock: 5, 
      image: "image/RAM de papier.jpeg" 
    }
  ],
  "Blanco": [
    { 
      nom: "Blanco correcteur", 
      description: "Flacon de 20ml, séchage rapide", 
      prix: "300 FCFA", 
      stock: 25, 
      image: "image/blanco.jpeg" 
    },
    { 
      nom: "Ruban correcteur", 
      description: "Ruban correcteur 5mm x 6m", 
      prix: "500 FCFA", 
      stock: 18, 
      image: "image/blanco.jpeg" 
    }
  ],
  "Cahier Personnalise": [
    { 
      nom: "Parfum Ambiance", 
      description: "Parfum d'intérieur, senteur naturelle", 
      prix: "1500 FCFA", 
      stock: 10, 
      image: "image/Cahier personnalise .jpg" 
    }
  ],
  "Savons": [
    { 
      nom: "Savon collagen ", 
      description: "Le Savon Galong au collagène est formulé pour nettoyer la peau en profondeur tout en améliorant sa fermeté et son éclat. Il est adapté pour le visage et le corps et aide à réduire les taches et les imperfections.", 
      prix: "500 FCFA", 
      stock: 30, 
      image: "image/collagen.jpeg" 
    },
    { 
      nom: "Savon jam", 
      description: "Santé et Beauté : Savon jam au lait de riz Le savon au lait de riz Jasmin est un savon fait a la main, 100% naturel, fabriqué a partir d’ingrédients sélectionnés pour leur qualité.", 
      prix: "500 FCFA", 
      stock: 40, 
      image: "image/savon.jpeg" 
    }
  ]
};

// Images par catégorie
const categoryImages = {
  "Cahiers": "image/cahiers.jpeg",
  "Stylos": "image/stylos.jpeg",
  "Miel": "image/miel.jpeg",
  "Ram de Papier": "image/RAM de papier.jpeg",
  "Blanco": "image/blanco.jpeg",
  "Cahier Personnalise": "image/Cahier personnalise .jpg",
  "Savons": "image/collagen.jpeg"
};

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

// ========== AFFICHAGE DES CATÉGORIES ==========
function displayCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  Object.keys(produitsData).forEach(categorie => {
    const count = produitsData[categorie].length;
    const card = document.createElement('div');
    card.className = 'categorie-card';
    card.onclick = () => showProducts(categorie);
    
    card.innerHTML = `
      <div class="categorie-image">
        <img src="${categoryImages[categorie]}" alt="${categorie}">
        <div class="categorie-overlay">
          <i class="fas fa-eye"></i>
        </div>
      </div>
      <h3>${categorie} <span class="categorie-count">(${count} produits)</span></h3>
    `;
    
    container.appendChild(card);
  });
}

// ========== AFFICHAGE DES PRODUITS ==========
function showProducts(categorie) {
  const produits = produitsData[categorie];
  const produitsSection = document.getElementById('produitsSection');
  const categoriesSection = document.querySelector('.categories-section');
  const categorieTitle = document.getElementById('categorieTitle');
  const produitsContainer = document.getElementById('produitsContainer');
  
  if (!produitsSection || !produitsContainer) return;
  
  // Masquer les catégories, afficher les produits
  if (categoriesSection) {
    categoriesSection.style.display = 'none';
  }
  produitsSection.style.display = 'block';
  categorieTitle.textContent = categorie;
  
  produitsContainer.innerHTML = '';
  
  produits.forEach(produit => {
    const isInStock = produit.stock > 0;
    const stockText = isInStock ? `${produit.stock} disponibles` : 'Rupture de stock';
    
    const card = document.createElement('div');
    card.className = 'produit-card';
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${produit.image}" alt="${produit.nom}">
        <span class="badge ${isInStock ? 'en-stock' : 'rupture'}">
          ${isInStock ? 'En stock' : 'Rupture'}
        </span>
      </div>
      <div class="produit-info">
        <h3>${produit.nom}</h3>
        <p class="produit-desc">${produit.description}</p>
        <p class="produit-prix">${produit.prix}</p>
        <p class="produit-stock ${isInStock ? 'en-stock' : 'rupture'}">
          <i class="fas ${isInStock ? 'fa-check-circle' : 'fa-times-circle'}"></i> ${stockText}
        </p>
        <button class="btn-commander" ${!isInStock ? 'disabled' : `onclick="commanderProduit('${produit.nom.replace(/'/g, "\\'")}', '${produit.prix}')"`}>
          ${isInStock ? '<i class="fas fa-shopping-cart"></i> Commander' : 'Indisponible'}
        </button>
      </div>
    `;
    
    produitsContainer.appendChild(card);
  });
  
  // Scroll vers le haut
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== RETOUR AUX CATÉGORIES ==========
function backToCategories() {
  const produitsSection = document.getElementById('produitsSection');
  const categoriesSection = document.querySelector('.categories-section');
  
  if (produitsSection) {
    produitsSection.style.display = 'none';
  }
  if (categoriesSection) {
    categoriesSection.style.display = 'block';
  }
}

// ========== COMMANDE ==========
function commanderProduit(nomProduit, prix) {
  // Sauvegarder dans localStorage
  localStorage.setItem('produitCommande', nomProduit);
  localStorage.setItem('produitPrix', prix);
  
  // Rediriger vers la page de commande
  window.location.href = 'commander.html';
}

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

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', () => {
  displayCategories();
  
  // Bouton retour
  const backBtn = document.getElementById('backToCategories');
  if (backBtn) {
    backBtn.addEventListener('click', backToCategories);
  }
});

console.log('Page Catalogue chargée avec succès !');