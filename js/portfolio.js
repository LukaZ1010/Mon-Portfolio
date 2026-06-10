/* ==========================================================================
   PORTFOLIO DE LUKA ZDRAVKOVIC - LOGIQUE JAVASCRIPT UNIFIÉE (ANTIGRAVITY)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialiser le menu hamburger et la navigation
    initNavigation();
    
    // 2. Initialiser les bulles de chargement si l'élément existe
    initBubbles();
    
    // 3. Initialiser les poissons interactifs
    initFish();
    
    // 4. Initialiser le carrousel sur l'index
    initCarousel();
    
    // 5. Initialiser les filtres du tableau de synthèse SIO
    initTableFilters();
    
    // 6. Initialiser la lightbox de la galerie d'images
    initLightbox();
});

/* --------------------------------------------------------------------------
   1. MENU HAMBURGER & COMPORTEMENT DU HEADER
   -------------------------------------------------------------------------- */
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && nav) {
        // Clic pour toggle hamburger + classe open
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('open');
        });

        // Fermeture automatique au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('open');
            });
        });
    }

    // Gestion du header transparent/flouté sur la page d'accueil
    const isIndex = document.body.classList.contains('page-index');
    if (isIndex) {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                document.body.classList.remove('page-index-top');
            } else {
                document.body.classList.add('page-index-top');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Appel initial
    }
}

/* --------------------------------------------------------------------------
   2. BULLES DE CHARGEMENT (BUBBLE OVERLAY)
   -------------------------------------------------------------------------- */
function initBubbles() {
    const overlay = document.getElementById('bubble-overlay');
    if (!overlay) return;

    // Ne pas afficher les bulles sur la page d'accueil (index)
    if (document.body.classList.contains('page-index')) {
        overlay.remove();
        return;
    }

    const bubbleCount = 38;
    for (let i = 0; i < bubbleCount; i++) {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            
            // Propriétés de taille et de vitesse aléatoires
            const size = 15 + Math.random() * 75;
            const duration = 1.6 + Math.random() * 2.4;
            const delay = Math.random() * 1.5;
            const leftPosition = Math.random() * 100;

            bubble.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${leftPosition}%;
                bottom: -${size}px;
                --dur: ${duration}s;
                animation-delay: ${delay}s;
            `;

            overlay.appendChild(bubble);

            // Nettoyage après fin d'animation
            setTimeout(() => {
                bubble.remove();
            }, (duration + delay + 0.5) * 1000);

        }, i * 70);
    }

    // Estomper et détruire l'overlay global après 4.5 secondes
    setTimeout(() => {
        overlay.style.transition = 'opacity 0.6s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 600);
    }, 4000);
}

/* --------------------------------------------------------------------------
   3. POISSONS INTERACTIFS (FISH FLOW)
   -------------------------------------------------------------------------- */
function initFish() {
    const container = document.getElementById('fish-container');
    if (!container) return;

    // Palette de couleurs éclatantes des poissons d'Antigravity
    const colors = ['#FFD700', '#FF6347', '#00CED1', '#FF69B4', '#32CD32', '#FFA500', '#FF4500', '#93C5FD'];
    
    function createFish() {
        const fish = document.createElement('div');
        fish.classList.add('fish');
        
        // Paramètres aléatoires
        const top = 5 + Math.random() * 90; // Répartition verticale
        const size = 28 + Math.random() * 42; // Taille du poisson
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 16 + Math.random() * 24; // Temps de traversée
        const direction = Math.random() > 0.5 ? 1 : -1; // Sens 1=droite, -1=gauche
        
        // Code HTML de l'arbre SVG du poisson (Modèle Antigravity)
        fish.innerHTML = `
            <svg viewBox="0 0 100 50" width="${size}" height="${size/2}" style="transform: scaleX(${direction})">
                <!-- Queue arrière -->
                <path d="M 25 25 L 0 5 L 0 45 Z" fill="${color}" />
                <!-- Corps principal -->
                <path d="M 85 25 C 85 5, 45 -5, 15 25 C 45 55, 85 45, 85 25 Z" fill="${color}" />
                <!-- Oeil -->
                <circle cx="70" cy="20" r="3.5" fill="black" />
                <circle cx="72" cy="18.5" r="1.2" fill="white" />
                <!-- Nageoire transparente -->
                <path d="M 45 25 Q 55 15, 60 30 Q 50 35, 45 25 Z" fill="rgba(255,255,255,0.35)" />
            </svg>
        `;
        
        // Positionnement et transition initiales
        fish.style.top = `${top}%`;
        fish.style.left = direction === 1 ? '-100px' : '110%';
        fish.style.transition = `left ${duration}s linear, top 0.4s ease-out, transform 0.4s ease`;
        
        container.appendChild(fish);
        
        // Lance le déplacement horizontal après l'ajout au DOM
        setTimeout(() => {
            fish.style.left = direction === 1 ? '110%' : '-100px';
        }, 80);
        
        // Evénement interaction : le poisson panique et s'enfuit au survol !
        fish.addEventListener('mouseenter', () => {
            const currentTop = parseFloat(fish.style.top);
            // Décalage vertical brusque
            fish.style.top = `${currentTop + (Math.random() > 0.5 ? 12 : -12)}%`;
            // Accélération vers le bord de l'écran
            const endLeft = direction === 1 ? window.innerWidth + 250 : -250;
            fish.style.left = `${endLeft}px`;
            // Raccourcir le temps de trajet
            fish.style.transitionDuration = `${duration / 5}s`;
            // Rotation de panique du SVG
            const rotationDegree = direction * 25;
            fish.querySelector('svg').style.transform = `scaleX(${direction}) rotate(${rotationDegree}deg)`;
        });
        
        // Auto-destruction une fois sorti de l'écran
        setTimeout(() => {
            if (fish.parentNode) {
                fish.remove();
            }
        }, duration * 1000);
    }
    
    // Générer un groupe de poissons au chargement initial
    const initialFishCount = 12;
    for (let i = 0; i < initialFishCount; i++) {
        setTimeout(createFish, Math.random() * 7000);
    }
    
    // Boucle de spawn continu
    setInterval(createFish, 4000);
}



/* --------------------------------------------------------------------------
   5. FILTRE DU TABLEAU DE SYNTHÈSE COMPÉTENCES SIO SLAM
   -------------------------------------------------------------------------- */
function initTableFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tableRows = document.querySelectorAll('.synthesis-table tbody tr');

    if (filterButtons.length > 0 && tableRows.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Changer le bouton actif
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // Afficher ou masquer les lignes
                tableRows.forEach(row => {
                    const category = row.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        row.style.display = 'table-row';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }
}

/* --------------------------------------------------------------------------
   6. CARROUSEL DE PROJETS 3D (PAGE D'ACCUEIL)
   -------------------------------------------------------------------------- */
function initCarousel() {
    const cards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (!cards.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function updateCarousel() {
        // Retirer les classes actives et de décalage
        cards.forEach(card => {
            card.classList.remove('active', 'prev', 'next');
        });

        // Calculer les index précédent et suivant
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        const nextIndex = (currentIndex + 1) % cards.length;

        // Assigner les nouvelles classes
        cards[currentIndex].classList.add('active');
        cards[prevIndex].classList.add('prev');
        cards[nextIndex].classList.add('next');
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    });

    // Initialiser les classes de départ
    updateCarousel();
}

/* --------------------------------------------------------------------------
   7. LIGHTBOX MODAL DE GALERIE D'IMAGES
   -------------------------------------------------------------------------- */
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    // Créer la lightbox si elle n'existe pas déjà
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox-modal';
        lightbox.className = 'lightbox-modal';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Fermer la galerie">&times;</button>
            <button class="lightbox-arrow lightbox-prev" aria-label="Image précédente">&#10094;</button>
            <div class="lightbox-content">
                <img id="lightbox-image" src="" alt="">
            </div>
            <button class="lightbox-arrow lightbox-next" aria-label="Image suivante">&#10095;</button>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('#lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Récupérer la liste des sources et alt de toutes les images
    const images = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        return {
            src: img.src,
            alt: img.alt || ''
        };
    });

    let currentImgIndex = 0;

    function openLightbox(index) {
        currentImgIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Bloquer le scroll
        document.body.classList.add('lightbox-open'); // Pause les poissons
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Rétablir le scroll
        document.body.classList.remove('lightbox-open');
    }

    function updateLightboxImage() {
        if (images[currentImgIndex]) {
            lightboxImg.src = images[currentImgIndex].src;
            lightboxImg.alt = images[currentImgIndex].alt;
        }
    }

    function showPrevImage() {
        currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImgIndex = (currentImgIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Associer les clics sur la galerie
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Clics sur les boutons de contrôle
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    // Fermer en cliquant sur le fond sombre
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Navigation au clavier (Échap, Flèches)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
}
