/* ==========================================
   GLOW STOP - JavaScript Principal
   Funcionalidades: Navegación, Filtros, Carrito, Animaciones
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todas las funcionalidades
  initHeader();
  initMobileMenu();
  initNavigation();
  initProductFilters();
  initCart();
  initWishlist();
  initAnimations();
  initFilters();
  initScrollEffects();
});

/* ==========================================
   Header y Navegación
   ========================================== */

function initHeader() {
  const header = document.querySelector('.header');
  
  if (!header) return;
  
  // Efecto de scroll en el header
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (!menuBtn || !mobileNav) return;
  
  menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Prevenir scroll cuando el menú está abierto
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });
  
  // Cerrar menú al hacer click en un enlace
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuBtn.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  // Determinar qué enlace está activo
  let activePage = 'home';
  if (currentPage.includes('products')) {
    activePage = 'products';
  }
  
  // Actualizar clase active en navegación desktop
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if ((activePage === 'home' && (href === 'index.html' || href === './' || href === '#')) ||
        (activePage === 'products' && href.includes('products'))) {
      link.classList.add('active');
    }
  });
  
  // Actualizar clase active en navegación móvil
  mobileNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if ((activePage === 'home' && (href === 'index.html' || href === './' || href === '#')) ||
        (activePage === 'products' && href.includes('products'))) {
      link.classList.add('active');
    }
  });
}

/* ==========================================
   Filtros de Productos
   ========================================== */

function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  
  if (filterBtns.length === 0 || productCards.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      
      // Filtrar productos con animación
      productCards.forEach((card, index) => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

function initFilters() {
  // Verificar si hay filtros activos en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  
  if (filterParam) {
    const filterBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
    if (filterBtn) {
      filterBtn.click();
    }
  }
}

/* ==========================================
   Funcionalidad del Carrito
   ========================================== */

function initCart() {
  const cartBtns = document.querySelectorAll('.product-card-btn, .btn-add-cart');
  const cartCount = document.querySelector('.cart-count');
  let cartItems = 0;
  
  cartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productName = this.closest('.product-card, .news-card')?.querySelector('.product-card-title, .news-card-title')?.textContent || 'Producto';
      
      // Incrementar contador
      cartItems++;
      if (cartCount) {
        cartCount.textContent = cartItems;
        cartCount.classList.add('active');
      }
      
      // Animación del botón
      this.textContent = '¡Añadido!';
      this.style.backgroundColor = '#4CAF50';
      
      setTimeout(() => {
        this.textContent = 'Añadir al Carrito';
        this.style.backgroundColor = '';
      }, 1500);
      
      // Mostrar notificación
      showNotification(`${productName} añadido al carrito`);
      
      // Log para debugging
      console.log(`Carrito: ${productName} - Total items: ${cartItems}`);
    });
  });
}

function showNotification(message) {
  // Crear notificación
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    font-family: 'Nanum Myeongjo', serif;
    font-size: 0.9rem;
    z-index: 10000;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  `;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/* ==========================================
   Wishlist / Favoritos
   ========================================== */

function initWishlist() {
  const wishlistBtns = document.querySelectorAll('.product-wishlist-btn');
  
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      this.classList.toggle('active');
      
      const isActive = this.classList.contains('active');
      const productName = this.closest('.product-card')?.querySelector('.product-card-title')?.textContent || 'Producto';
      
      if (isActive) {
        console.log(`Añadido a wishlist: ${productName}`);
      } else {
        console.log(`Eliminado de wishlist: ${productName}`);
      }
    });
  });
}

/* ==========================================
   Animaciones al Scroll
   ========================================== */

function initAnimations() {
  // Observer para animaciones al hacer scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observar elementos animables
  const animateElements = document.querySelectorAll('.product-card, .news-card, .review-card, .section-title');
  animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.animationDelay = `${index * 0.1}s`;
    observer.observe(el);
  });
  
  // Parallax suave para hero
  initParallax();
}

function initParallax() {
  const hero = document.querySelector('.hero');
  
  if (!hero) return;
  
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = hero.querySelector('.hero-img-placeholder');
    
    if (heroImage && scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  });
}

/* ==========================================
   Efectos de Scroll
   ========================================== */

function initScrollEffects() {
  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================
   Utilidades
   ========================================== */

// Función para formatear precio
function formatPrice(price) {
  return `${price.toFixed(2).replace('.', ',')}€`;
}

// Función para generar estrellas de rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let starsHTML = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHTML += '<svg class="review-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    } else if (i === fullStars && halfStar) {
      starsHTML += '<svg class="review-star" viewBox="0 0 24 24"><defs><linearGradient id="half"><stop offset="50%" stop-color="#F06292"/><stop offset="50%" stop-color="none"/></linearGradient></defs><path fill="url(#half)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    } else {
      starsHTML += '<svg class="review-star empty" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
  }
  
  return starsHTML;
}

// Event listener para búsqueda (simulado)
function initSearch() {
  const searchBtns = document.querySelectorAll('.header-icon-btn[aria-label="Buscar"]');
  
  searchBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const searchQuery = prompt('¿Qué producto buscas?');
      if (searchQuery) {
        console.log(`Búsqueda: ${searchQuery}`);
        showNotification('Búsqueda simulada: ' + searchQuery);
      }
    });
  });
}

// Inicializar búsqueda
document.addEventListener('DOMContentLoaded', initSearch);

/* ==========================================
   Console Logs de Bienvenida
   ========================================== */

console.log('%c🌿 GLOW STOP', 'font-size: 24px; font-weight: bold; color: #4CAF50;');
console.log('%c✨ Cuidado facial anti-acné + Protección solar', 'font-size: 14px; color: #F06292;');
console.log('%c🔒 Navegación segura', 'font-size: 12px; color: #8D6E63;');
