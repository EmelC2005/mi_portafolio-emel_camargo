document.addEventListener('DOMContentLoaded', () => {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const playPauseButton = document.querySelector('.play-pause-button');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentIndex = 0;
    let isAnimating = false;
    let autoplayInterval;
    let isPaused = false;
    
    function showTestimonial(index, direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;

        // Asegurar que el índice esté dentro de los límites
        if (index < 0) index = testimonialCards.length - 1;
        if (index >= testimonialCards.length) index = 0;

        // Ocultar el testimonio actual
        const currentCard = testimonialCards[currentIndex];
        currentCard.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        currentCard.style.opacity = '0';
        setTimeout(() => {
            currentCard.classList.remove('visible');
        }, 500);

        // Mostrar el nuevo testimonio
        const nextCard = testimonialCards[index];
        nextCard.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
        nextCard.classList.add('visible');
        
        // Forzar un reflow
        nextCard.offsetHeight;
        
        // Animar a la posición
        nextCard.style.transform = 'translateX(0)';
        nextCard.style.opacity = '1';

        // Actualizar el estado
        currentIndex = index;
        
        // Actualizar navegación
        updateNavigation();

        // Permitir nueva animación después de la transición
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function updateNavigation() {
        // Actualizar estado de los botones
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === testimonialCards.length - 1;
        
        // Actualizar dots
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Evento para el botón anterior
    prevButton.addEventListener('click', () => {
        showTestimonial(currentIndex - 1, 'prev');
        resetAutoplay();
    });
    
    // Evento para el botón siguiente
    nextButton.addEventListener('click', () => {
        showTestimonial(currentIndex + 1, 'next');
        resetAutoplay();
    });

    // Evento para el botón de pausa/reproducción
    playPauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        playPauseButton.classList.toggle('paused', isPaused);
        
        if (isPaused) {
            clearInterval(autoplayInterval);
        } else {
            startAutoplay();
        }
    });
    
    // Eventos para los dots de navegación
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const direction = index > currentIndex ? 'next' : 'prev';
            showTestimonial(index, direction);
            resetAutoplay();
        });
    });

    function resetAutoplay() {
        if (!isPaused) {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
    }

    function startAutoplay() {
        clearInterval(autoplayInterval);
        if (!isPaused) {
            autoplayInterval = setInterval(() => {
                if (!isAnimating) {
                    showTestimonial(currentIndex + 1, 'next');
                }
            }, 5000);
        }
    }
    
    // Inicialización
    testimonialCards.forEach((card, index) => {
        if (index === 0) {
            card.classList.add('visible');
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
        } else {
            card.style.transform = 'translateX(100%)';
        }
    });
    
    updateNavigation();
    startAutoplay();

    // Pausar el autoplay en hover
    const container = document.querySelector('.testimonials-container');
    container.addEventListener('mouseenter', () => {
        if (!isPaused) {
            clearInterval(autoplayInterval);
        }
    });

    container.addEventListener('mouseleave', () => {
        if (!isPaused) {
            startAutoplay();
        }
    });
}); 