document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initFish();
    initParallax();
});

function initCarousel() {
    const cards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (!cards.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach(card => {
            card.classList.remove('active', 'prev', 'next');
        });

        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        const nextIndex = (currentIndex + 1) % cards.length;

        cards[currentIndex].classList.add('active');
        cards[prevIndex].classList.add('prev');
        cards[nextIndex].classList.add('next');
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    });

    // Initialiser les classes
    updateCarousel();
}

function initFish() {
    const container = document.getElementById('fish-container');
    if (!container) return;

    const colors = ['#FFD700', '#FF6347', '#00CED1', '#FF69B4', '#32CD32', '#FFA500'];
    
    function createFish() {
        const fish = document.createElement('div');
        fish.classList.add('fish');
        
        // Propriétés aléatoires
        const top = 5 + Math.random() * 90; // entre 5% et 95% de la hauteur du fond marin
        const size = 30 + Math.random() * 40; // entre 30px et 70px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 15 + Math.random() * 25; // entre 15s et 40s pour traverser
        const direction = Math.random() > 0.5 ? 1 : -1; // 1 = vers la droite, -1 = vers la gauche
        
        // SVG du poisson
        fish.innerHTML = `
            <svg viewBox="0 0 100 50" width="${size}" height="${size/2}" style="transform: scaleX(${direction})">
                <!-- Queue -->
                <path d="M 25 25 L 0 5 L 0 45 Z" fill="${color}" />
                <!-- Corps -->
                <path d="M 85 25 C 85 5, 45 -5, 15 25 C 45 55, 85 45, 85 25 Z" fill="${color}" />
                <!-- Oeil -->
                <circle cx="70" cy="20" r="3" fill="black" />
                <circle cx="71" cy="19" r="1" fill="white" />
                <!-- Nageoire -->
                <path d="M 45 25 Q 55 15, 60 30 Q 50 35, 45 25 Z" fill="rgba(255,255,255,0.3)" />
            </svg>
        `;
        
        // Position initiale
        fish.style.top = `${top}%`;
        fish.style.left = direction === 1 ? '-100px' : '110%';
        fish.style.transition = `left ${duration}s linear, top 0.4s ease-out, transform 0.4s ease`;
        
        container.appendChild(fish);
        
        // Lancement de l'animation après un court délai pour que la transition CSS s'applique
        setTimeout(() => {
            fish.style.left = direction === 1 ? '110%' : '-100px';
        }, 100);
        
        // Interaction : le poisson s'enfuit si on le survole
        fish.addEventListener('mouseenter', () => {
            const currentTop = parseFloat(fish.style.top);
            // Il monte ou descend brusquement
            fish.style.top = `${currentTop + (Math.random() > 0.5 ? 8 : -8)}%`;
            // Il accélère vers sa destination
            const endLeft = direction === 1 ? window.innerWidth + 200 : -200;
            fish.style.left = `${endLeft}px`;
            // On réduit drastiquement la durée de transition
            fish.style.transitionDuration = `${duration / 4}s`;
            // Petit mouvement de rotation de panique
            fish.querySelector('svg').style.transform = `scaleX(${direction}) rotate(${direction * 20}deg)`;
        });
        
        // Destruction de l'élément une fois qu'il a traversé l'écran
        setTimeout(() => {
            if (fish.parentNode) {
                fish.remove();
            }
        }, duration * 1000);
    }
    
    // Créer un banc initial de poissons
    for(let i = 0; i < 15; i++) {
        setTimeout(createFish, Math.random() * 8000);
    }
    
    // Continuer à générer des poissons régulièrement
    setInterval(createFish, 4000);
}

function initParallax() {
    const island = document.querySelector('.island-container');
    
    window.addEventListener('scroll', () => {
        // L'effet parallax de l'île a été retiré pour qu'elle reste bien en place
        // sur la ligne d'horizon lors du scroll.
    });
}

