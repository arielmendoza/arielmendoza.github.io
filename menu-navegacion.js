// Menu de navegación centralizado
// Este archivo contiene todo el HTML del menú para evitar duplicar código

const menuHTML = `
<nav class="main-nav">
  <div class="container nav-container">
    <a href="index.html" class="nav-logo">🛠️ BricoAmazon</a>
    <button class="mobile-menu-btn" aria-label="Abrir menú">
      <span class="hamburger"></span>
    </button>
    <ul class="nav-links">
      <li><a href="index.html">Herramientas</a></li>
      <li><a href="otros-productos.html">Otros Productos</a></li>
      <li class="nav-item">
        <a href="#" class="dropdown-toggle">Guías <span class="dropdown-arrow">▼</span></a>
        <div class="nav-dropdown">
          <a href="guia-taladros-principiantes.html">🔧 Guía de Taladros</a>
          <a href="guia-sierras-de-calar.html">🪚 Guía Sierras de Calar</a>
          <a href="guia-martillos.html">🔨 Guía Martillos</a>
          <a href="guia-herramientas-inalambricas-vs-cable.html">🔋 Inalámbricas vs Cable</a>
          <a href="guia-herramientas-bano.html">🚿 Herramientas para Baño</a>
          <a href="guia-llaves-inglesas.html">🔧 Llaves Inglesas</a>
          <a href="guia-destornilladores.html">🪛 Destornilladores</a>
          <a href="guia-llaves-fijas.html">🔩 Llaves Fijas</a>
          <a href="guia-niveles-medicion.html">📏 Niveles y Medición</a>
          <a href="guia-herramientas-cocina.html">🍳 Herramientas para Cocina</a>
          <a href="guia-alicates-tenazas.html">🗜️ Alicates y Tenazas</a>
          <a href="guia-principiantes-absolutos.html">👨‍🔧 Para Principiantes</a>
          <a href="guia-herramientas-jardin.html">🌿 Herramientas Jardín</a>
          <a href="guia-mantenimiento-herramientas.html">🛠️ Mantenimiento</a>
          <a href="guia-seguridad-taller.html">⚠️ Seguridad Taller</a>
          <a href="10-herramientas-esenciales-bricolaje.html">⭐ 10 Herramientas Esenciales</a>
          <a href="herramientas-baratas-menos-50-euros.html">💰 Herramientas Baratas</a>
        </div>
      </li>
      <li><a href="sobre-nosotros.html">Sobre Nosotros</a></li>
    </ul>
  </div>
</nav>
`;

// Función para insertar el menú en la página
function insertarMenu() {
  // Buscar si ya existe un nav
  const existingNav = document.querySelector('.main-nav');
  if (existingNav) {
    existingNav.remove();
  }
  
  // Insertar el nuevo menú al inicio del body
  document.body.insertAdjacentHTML('afterbegin', menuHTML);
  
  // Marcar la página actual como activa
  marcarPaginaActiva();
  
  // Inicializar funcionalidad del menú móvil
  inicializarMenuMovil();
}

// Función para marcar la página actual como activa
function marcarPaginaActiva() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// Función para inicializar el menú móvil
function inicializarMenuMovil() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
      
      // Actualizar atributos ARIA para accesibilidad
      const isOpen = navLinks.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      navLinks.setAttribute('aria-expanded', isOpen);
    });
    
    // Cerrar menú al hacer clic en un enlace (móvil)
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href') !== '#') {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Manejar el dropdown en móvil
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.nav-dropdown');
    
    if (dropdownToggle && dropdown) {
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      });
    }
  }
}

// Función para actualizar el menú (útil para cambios dinámicos)
function actualizarMenu() {
  insertarMenu();
}

// Insertar menú cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', insertarMenu);
} else {
  insertarMenu();
}

// Exportar funciones para uso externo
window.BricoAmazonMenu = {
  insertar: insertarMenu,
  actualizar: actualizarMenu,
  marcarActiva: marcarPaginaActiva
}; 