// Funcionalidades específicas da página de resenha

document.addEventListener('DOMContentLoaded', function() {
    // Compartilhamento social
    setupSocialSharing();
    
    // Scroll suave para âncoras
    setupSmoothScrolling();
    
    // Animações de entrada
    setupScrollAnimations();
    
    // Menu mobile (herda do script principal)
    if (typeof setupMobileMenu === 'function') {
        setupMobileMenu();
    }
});

// Configurar compartilhamento social
function setupSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = window.location.href;
    const pageTitle = document.querySelector('.review-title').textContent;
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.className.split(' ')[1]; // facebook, twitter, etc.
            
            switch(platform) {
                case 'facebook':
                    shareOnFacebook(pageUrl, pageTitle);
                    break;
                case 'twitter':
                    shareOnTwitter(pageUrl, pageTitle);
                    break;
                case 'whatsapp':
                    shareOnWhatsApp(pageUrl, pageTitle);
                    break;
                case 'copy-link':
                    copyToClipboard(pageUrl);
                    break;
            }
        });
    });
}

function shareOnFacebook(url, title) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    openShareWindow(shareUrl);
}

function shareOnTwitter(url, title) {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    openShareWindow(shareUrl);
}

function shareOnWhatsApp(url, title) {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    openShareWindow(shareUrl);
}

function copyToClipboard(url) {
    navigator.clipboard.writeText(url).then(function() {
        showNotification('Link copiado para a área de transferência!');
    }).catch(function() {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Link copiado para a área de transferência!');
    });
}

function openShareWindow(url) {
    window.open(url, 'shareWindow', 'width=600,height=400,scrollbars=yes,resizable=yes');
}

// Configurar scroll suave
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Configurar animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observar elementos que devem animar
    const elementsToAnimate = document.querySelectorAll('.sidebar-card, .related-card, .review-text');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Função para mostrar notificações (reutilizada do script principal)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: linear-gradient(45deg, #8b0000, #355c7d);
        color: #f7e2bb;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 1001;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animação para elementos que entram em view
const style = document.createElement('style');
style.textContent = `
    .animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
