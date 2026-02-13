// Animazioni ottimizzate per mobile
document.addEventListener('DOMContentLoaded', function() {
    // 1. FAQ toggle
    initFaqToggle();
    
    // 2. Animazione on scroll (ottimizzata per performance mobile)
    initScrollAnimations();
    
    // 3. Scroll smooth
    initSmoothScroll();
    
    // 4. Effetti hover (disabilitati su mobile)
    if (!isMobile()) {
        initHoverEffects();
    }
    
    // 5. Effetto parallax (ridotto su mobile)
    initParallax();
    
    // 6. Effetti click sui bottoni
    initButtonEffects();
    
    // 7. Animazione processi
    initProcessAnimations();
    
    // 8. Effetto digitazione
    initTypeWriter();
    
    // 9. Aggiungi bottone WhatsApp fisso per mobile
    if (isMobile()) {
        addMobileWhatsAppButton();
    }
    
    // 10. Lazy loading per immagini future
    initLazyLoading();
});

// FAQ toggle
function initFaqToggle() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const icon = question.querySelector('i');
            
            // Chiudi tutti gli altri FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherIcon = item.querySelector('.faq-question i');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                }
            });
            
            // Toggle quello corrente
            faqItem.classList.toggle('active');
            const answer = faqItem.querySelector('.faq-answer');
            
            if (faqItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                answer.style.maxHeight = null;
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

// Controlla se è mobile
function isMobile() {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
}

// 1. Animazione on scroll ottimizzata
function initScrollAnimations() {
    // Usa IntersectionObserver con polyfill se necessario
    if (!('IntersectionObserver' in window)) {
        // Fallback per browser vecchi
        document.querySelectorAll('.animate-up').forEach(el => {
            el.classList.add('visible');
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Delay progressivo solo su desktop
                if (!isMobile() && (entry.target.classList.contains('process-step') || 
                    entry.target.classList.contains('service-card') ||
                    entry.target.classList.contains('why-card'))) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-up').forEach(el => {
        observer.observe(el);
    });
}

// 2. Scroll smooth
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Offset per header fisso
                const headerOffset = isMobile() ? 60 : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 3. Effetti hover (solo desktop)
function initHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .why-card, .platform, .contact-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 255, 136, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

// 4. Effetto parallax ridotto per mobile
function initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollPosition = window.scrollY;
                const header = document.querySelector('header');
                
                if(header && scrollPosition < window.innerHeight) {
                    // Effetto parallax ridotto su mobile
                    const parallaxIntensity = isMobile() ? 0.3 : 0.5;
                    header.style.backgroundPositionY = `${scrollPosition * parallaxIntensity}px`;
                    
                    // Effetto fade sul logo
                    const logo = document.querySelector('.logo');
                    if(logo) {
                        const opacity = 1 - (scrollPosition / 500);
                        logo.style.opacity = Math.max(opacity, 0.3);
                    }
                }
                
                // Effetto sui LED (ridotto su mobile)
                const ledBorders = document.querySelectorAll('.led-border');
                ledBorders.forEach(border => {
                    const intensity = isMobile() ? 
                        0.5 + (Math.sin(scrollPosition / 300) * 0.2) :
                        0.5 + (Math.sin(scrollPosition / 200) * 0.3);
                    border.style.opacity = intensity;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// 5. Effetti click sui bottoni
function initButtonEffects() {
    const buttons = document.querySelectorAll('.cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Solo se non è mobile o se è un tap
            if (isMobile() && e.type === 'touchstart') return;
            
            // Effetto ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Aggiungi stile per ripple (se non esiste già)
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 6. Animazione processi
function initProcessAnimations() {
    const processNumbers = document.querySelectorAll('.step-number');
    
    processNumbers.forEach(number => {
        number.addEventListener('mouseenter', function() {
            if (!isMobile()) {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
            }
        });
        
        number.addEventListener('mouseleave', function() {
            if (!isMobile()) {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            }
        });
    });
}

// 7. Effetto digitazione
function initTypeWriter() {
    const tagline = document.querySelector('.tagline');
    if (!tagline) return;
    
    // Salva testo originale
    const originalText = tagline.textContent;
    tagline.textContent = '';
    tagline.style.opacity = '1';
    
    let i = 0;
    const speed = isMobile() ? 40 : 32; // Più lento su mobile
    
    function typeWriter() {
        if (i < originalText.length) {
            tagline.textContent += originalText.charAt(i);
            
            // Cursore (solo su desktop)
            if (!isMobile()) {
                if (i === originalText.length - 1) {
                    tagline.style.borderRight = 'none';
                } else {
                    tagline.style.borderRight = '2px solid var(--primary-color)';
                    tagline.style.paddingRight = '2px';
                }
            }
            
            i++;
            setTimeout(typeWriter, speed);
        } else {
            tagline.style.borderRight = 'none';
        }
    }
    
    // Inizia dopo un breve ritardo
    setTimeout(typeWriter, 1000);
}

// 8. Aggiungi bottone WhatsApp fisso per mobile
function addMobileWhatsAppButton() {
    if (document.querySelector('.mobile-whatsapp-fixed')) return;
    
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/393517554147';
    whatsappBtn.className = 'mobile-whatsapp-fixed';
    whatsappBtn.setAttribute('aria-label', 'Scrivimi su WhatsApp');
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    
    document.body.appendChild(whatsappBtn);
}

// 9. Lazy loading per immagini future
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supporta nativamente lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
}

// Performance: Debounce per eventi resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Ricalcola elementi se necessario
    }, 250);
});

// Service Worker per futura PWA
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(function(error) {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}