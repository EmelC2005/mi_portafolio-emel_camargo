// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    initNavigation();
    initScrollAnimations();
    initCTAButton();
    initContactForm();
    initSkillBars();
    initTestimonialSlider();
    initProjectsCarousel();
    
    // Mostrar mensaje de bienvenida en la consola
    console.log('Portafolio de Emel Salomón Camargo cargado correctamente');
});

/**
 * Inicializa la navegación del sitio
 */
function initNavigation() {
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Marcar el enlace activo según la página actual
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Hace scroll suave a una sección específica
 * @param {HTMLElement} section - La sección a la que hacer scroll
 */
function scrollToSection(section) {
    window.scrollTo({
        top: section.offsetTop - 90, // Ajustar por la altura del navbar
        behavior: 'smooth'
    });
}

/**
 * Resalta el enlace de navegación activo según la sección visible
 * @param {NodeList} navLinks - Lista de enlaces de navegación
 */
function highlightActiveSection(navLinks) {
    // Obtener la posición actual del scroll
    const scrollPosition = window.scrollY + 100;
    
    // Verificar qué sección está actualmente visible
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const sectionTop = targetSection.offsetTop;
                const sectionBottom = sectionTop + targetSection.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        }
    });
}

/**
 * Inicializa animaciones al hacer scroll
 */
function initScrollAnimations() {
    // Obtener todos los elementos que queremos animar
    const animatedElements = document.querySelectorAll('.software-item, .hero-content h1, .hero-content p, .cta-button');
    
    // Configurar el observador de intersección
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento es visible
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Dejar de observar después de animar
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // El elemento se anima cuando el 10% es visible
    });
    
    // Observar cada elemento
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Inicializa la funcionalidad del botón CTA
 */
function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll a la sección de portafolio o contacto
            const targetSection = document.querySelector('.skills-section') || document.querySelector('#contacto');
            if (targetSection) {
                scrollToSection(targetSection);
            }
        });
    }
}

/**
 * Añade un efecto hover a los elementos de software
 */
document.querySelectorAll('.software-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

/**
 * Añade funcionalidad para cambiar entre modo claro y oscuro
 * (Preparado para implementación futura)
 */
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    // Guardar preferencia en localStorage
    const isDarkMode = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('preferredTheme', isDarkMode);
}

// Verificar tema preferido al cargar
const savedTheme = localStorage.getItem('preferredTheme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

/**
 * Inicializa la funcionalidad del formulario de contacto
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Validar el formulario
            if (validateForm(name, email, message)) {
                // Simular envío del formulario
                const submitButton = contactForm.querySelector('.submit-button');
                const originalText = submitButton.textContent;
                
                // Cambiar texto del botón y deshabilitarlo
                submitButton.textContent = 'Enviando...';
                submitButton.disabled = true;
                
                // Simular un tiempo de espera para el envío
                setTimeout(() => {
                    // Mostrar mensaje de éxito
                    showFormMessage('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
                    
                    // Resetear el formulario
                    contactForm.reset();
                    
                    // Restaurar el botón
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    }
}

/**
 * Valida los campos del formulario
 * @param {string} name - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} message - Mensaje del usuario
 * @returns {boolean} - Indica si el formulario es válido
 */
function validateForm(name, email, message) {
    // Validar que los campos no estén vacíos
    if (!name.trim() || !email.trim() || !message.trim()) {
        showFormMessage('Por favor, completa todos los campos.', 'error');
        return false;
    }
    
    // Validar formato de email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('Por favor, ingresa un email válido.', 'error');
        return false;
    }
    
    return true;
}

/**
 * Muestra un mensaje de éxito o error en el formulario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('success' o 'error')
 */
function showFormMessage(message, type) {
    // Buscar si ya existe un mensaje y eliminarlo
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear elemento para el mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Insertar el mensaje después del formulario
    const contactForm = document.getElementById('contact-form');
    contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
    
    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Manejar el formulario de contacto
function handleContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Aquí puedes agregar la lógica para enviar el formulario
        console.log('Datos del formulario:', data);
        
        // Simular envío exitoso
        alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
        form.reset();
    });
}

// Manejar la navegación
function handleNavigation() {
    const header = document.querySelector('.header');

    // Actualizar enlace activo en el menú
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const menuLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

            if (menuLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
                menuLink.classList.add('active');
            }
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    handleContactForm();
    handleNavigation();
});

// Animaciones al hacer scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
}

// Agregar animaciones
document.addEventListener('DOMContentLoaded', handleScrollAnimations);

/**
 * Inicializa las animaciones de las barras de habilidades
 */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

/**
 * Inicializa la sección de testimonios
 */
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    // Añadir efecto de hover a las tarjetas
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Inicializa el carrusel de proyectos
 */
function initProjectsCarousel() {
    const projectsGrid = document.querySelector('.projects-grid');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const cards = document.querySelectorAll('.project-card');
    let currentIndex = 0;
    
    if (!projectsGrid || cards.length === 0) return;

    // Función para actualizar la posición del carrusel
    function updateCarousel(direction = 'next') {
        const cardWidth = cards[0].offsetWidth + 24; // Añadimos el gap
        
        if (direction === 'next') {
            currentIndex--;
        } else {
            currentIndex++;
        }

        // Manejar el ciclo infinito
        if (currentIndex < -cards.length + 1) {
            currentIndex = 0;
        } else if (currentIndex > 0) {
            currentIndex = -(cards.length - 1);
        }

        // Calcular y aplicar la transformación
        const offset = currentIndex * cardWidth;
        projectsGrid.style.transform = `translateX(${offset}px)`;

        // Actualizar las clases de las tarjetas
        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (Math.abs(index + currentIndex) % cards.length === 0) {
                card.classList.add('active');
            }
        });
    }

    // Inicializar el estado inicial
    cards[0].classList.add('active');

    // Event listeners para los botones
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            updateCarousel('prev');
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            updateCarousel('next');
        });
    }

    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
        const cardWidth = cards[0].offsetWidth + 24;
        const offset = currentIndex * cardWidth;
        projectsGrid.style.transform = `translateX(${offset}px)`;
    });
}

// Elementos del menú móvil
const menuToggle = document.querySelector('.menu-toggle');
const navContainer = document.querySelector('.nav-container');
const dropdowns = document.querySelectorAll('.dropdown');

// Crear y agregar el overlay al body
const menuOverlay = document.createElement('div');
menuOverlay.classList.add('menu-overlay');
document.body.appendChild(menuOverlay);

// Toggle del menú
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navContainer.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
});

// Cerrar menú al hacer click en el overlay
menuOverlay.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navContainer.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Manejar dropdowns en móvil
dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    
    if (window.innerWidth <= 768) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    }
});

// Cerrar menú al hacer click en un enlace
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            navContainer.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Ajustar comportamiento de dropdowns según el tamaño de la ventana
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        menuToggle.classList.remove('active');
        navContainer.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});