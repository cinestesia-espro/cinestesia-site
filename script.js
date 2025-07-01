// Menu mobile toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Função específica para o botão "Explorar Filmes"
function scrollToReviews() {
    const reviewsSection = document.querySelector('#resenhas');
    const headerHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = reviewsSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Smooth scrolling para navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Formulário de recomendação
const recommendationForm = document.getElementById('recommendationForm');

recommendationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simular envio
    showNotification('Recomendação enviada com sucesso! Obrigado pela contribuição.');
    
    // Limpar formulário
    this.reset();
});

// Função para mostrar notificações
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
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
    
    // Adicionar animação CSS
    const style = document.createElement('style');
    style.textContent = `
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animação de entrada corrigida para elementos
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observar elementos para animação - corrigido
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.review-card, .about-card');
    elementsToAnimate.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
});

// Botão "Ler Mais" funcionalidade
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', function() {
        const reviewCard = this.closest('.review-card');
        const title = reviewCard.querySelector('h3').textContent;
        
        showNotification(`Carregando resenha completa de "${title}"...`);
    });
});

// Melhorar a navegação suave
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(73, 102, 100, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#496664';
        navbar.style.backdropFilter = 'none';
    }
});
