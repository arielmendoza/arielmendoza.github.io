// Menu de navegación centralizado
// Este archivo contiene todo el HTML del menú para evitar duplicar código

const menuHTML = `
<nav class="main-nav">
  <div class="container nav-container">
    <a href="index.html" class="nav-logo">🛠️ BricoExpertos</a>
    <button class="mobile-menu-btn" aria-label="Abrir menú">
      <span class="hamburger"></span>
    </button>
    <ul class="nav-links">
      <li><a href="index.html">Inicio</a></li>
      <li class="nav-item">
        <a href="#" class="dropdown-toggle">Guías <span class="dropdown-arrow">▼</span></a>
        <div class="nav-dropdown">
          <p class="dropdown-header">PROYECTOS Y TEMAS</p>
          <a href="guia-comparativa-robot-aspirador.html">🤖 Comparativa Robots Aspirador</a>
          <a href="guia-instalar-ventilador-techo.html">💡 Instalar Ventilador de Techo</a>
          <a href="guia-pegar-cesped-artificial.html">🌿 Pegar Césped Artificial</a>
          <a href="guia-mantenimiento-piscina.html">💧 Mantenimiento de Piscinas</a>
          <a href="guia-herramientas-jardin.html">🌳 Herramientas de Jardín</a>
          <a href="guia-herramientas-bano.html">🚿 Herramientas para Baño</a>
          <a href="guia-herramientas-cocina.html">🍳 Herramientas para Cocina</a>

          <p class="dropdown-header">HERRAMIENTAS</p>
          <a href="guia-taladros-principiantes.html">🔧 Guía de Taladros</a>
          <a href="guia-sierras-de-calar.html">🪚 Guía Sierras de Calar</a>
          <a href="guia-martillos.html">🔨 Guía Martillos</a>
          <a href="guia-destornilladores.html">🪛 Destornilladores</a>
          <a href="guia-alicates-tenazas.html">🗜️ Alicates y Tenazas</a>
          <a href="guia-niveles-medicion.html">📏 Niveles y Medición</a>
          <a href="guia-llaves-inglesas.html">🔧 Llaves Inglesas</a>
          <a href="guia-llaves-fijas.html">🔩 Llaves Fijas</a>
          
          <p class="dropdown-header">RECURSOS Y CONSEJOS</p>
          <a href="guia-principiantes-absolutos.html">👨‍🔧 Guía para Principiantes</a>
          <a href="10-herramientas-esenciales-bricolaje.html">⭐ 10 Herramientas Esenciales</a>
          <a href="herramientas-baratas-menos-50-euros.html">💰 Herramientas por menos de 50€</a>
          <a href="guia-herramientas-inalambricas-vs-cable.html">🔋 Inalámbricas vs Cable</a>
          <a href="guia-mantenimiento-herramientas.html">🛠️ Mantenimiento de Herramientas</a>
          <a href="guia-seguridad-taller.html">⚠️ Seguridad en el Taller</a>
        </div>
      </li>
      <li><a href="sobre-nosotros.html">Sobre Nosotros</a></li>
    </ul>
  </div>
</nav>
`;

// Función para inyectar el menú y gestionar la lógica
function setupNavigation() {
  if (document.body.classList.contains('nav-loaded')) {
    return;
  }
  document.body.classList.add('nav-loaded');

  // Insertar el nuevo menú al inicio del body
  document.body.insertAdjacentHTML('afterbegin', menuHTML);

  // Marcar la página actual como activa
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-links a, .nav-dropdown a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // Lógica para el menú móvil
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Lógica MEJORADA para el dropdown en móvil
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault(); // Prevenir la navegación en el enlace '#'
        const navItem = toggle.closest('.nav-item');
        if (navItem) {
          navItem.classList.toggle('dropdown-open');
        }
      }
    });
  });
}

// Ejecutar la configuración cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupNavigation);
} else {
  setupNavigation();
}

// Exportar funciones para uso externo
window.BricoExpertosMenu = {
  insertar: setupNavigation,
  actualizar: setupNavigation,
  marcarActiva: (page) => {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === page) {
        link.classList.add('active');
      }
    });
  }
}; 