// Función para cargar contenido HTML dinámicamente
async function loadHTML(url, containerId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al cargar ${url}: ${response.statusText}`);
    }
    const text = await response.text();
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = text;
    }
  } catch (error) {
    console.error(error);
  }
}

// Función para el toggle del disclaimer del footer
window.toggleDisclaimer = function() {
  const disclaimers = document.getElementById('disclaimers');
  const toggleBtn = document.getElementById('toggleBtn');
  if (disclaimers && toggleBtn) {
    const isExpanded = disclaimers.classList.toggle('expanded');
    disclaimers.classList.toggle('collapsed', !isExpanded);
    toggleBtn.setAttribute('aria-expanded', isExpanded);
    
    // Cambiar texto del botón
    const btnText = toggleBtn.querySelector('span:not(.icon)');
    const icon = toggleBtn.querySelector('.icon');
    if (isExpanded) {
      toggleBtn.innerHTML = 'Ver menos información <span class="icon">▲</span>';
    } else {
      toggleBtn.innerHTML = 'Ver más información <span class="icon">▼</span>';
    }
  }
};

// Cargar componentes comunes y ejecutar scripts cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Cargar footer
  loadHTML('footer.html', 'footer-container').then(() => {
    // Una vez cargado el footer, la función toggleDisclaimer ya está disponible globalmente
  });

  // Lógica para el menú de navegación móvil
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el clic se propague al documento
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Lógica para los submenús en móvil
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  if (dropdownItems.length > 0 && mobileMenuBtn) {
    dropdownItems.forEach(item => {
      const dropdownToggle = item.querySelector('a');
      
      dropdownToggle.addEventListener('click', (e) => {
        if (window.getComputedStyle(mobileMenuBtn).display !== 'none') {
          // Si el menú tiene un enlace real, navega en el segundo toque
          const isLink = dropdownToggle.getAttribute('href') && dropdownToggle.getAttribute('href') !== '#';
          if (isLink && item.classList.contains('dropdown-open')) {
            return; 
          }

          e.preventDefault();
          e.stopPropagation();
          
          // Cerrar otros dropdowns
          dropdownItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('dropdown-open');
            }
          });

          item.classList.toggle('dropdown-open');
        }
      });
    });
  }

  // Cierra el menú móvil si se hace clic fuera de él
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
      if (!navLinks.contains(e.target) && e.target !== mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        dropdownItems.forEach(item => item.classList.remove('dropdown-open'));
      }
    }
  });

  // Lógica para filtrar guías en la página principal
  const filterTabs = document.querySelectorAll('.filter-tab');
  const guideCards = document.querySelectorAll('.guide-card');

  if (filterTabs.length > 0 && guideCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.dataset.category;

        // Manejar la clase activa
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filtrar las tarjetas
        guideCards.forEach(card => {
          if (category === 'todos' || card.dataset.category === category) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Lógica del formulario de contacto en sobre-nosotros.html
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formMessage = document.getElementById('form-message');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    const setLoadingState = (isLoading) => {
      const btnText = submitButton.querySelector('.btn-text');
      const btnLoading = submitButton.querySelector('.btn-loading');
      if (isLoading) {
        submitButton.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'inline-block';
      } else {
        submitButton.disabled = false;
        if (btnText) btnText.style.display = 'inline-block';
        if (btnLoading) btnLoading.style.display = 'none';
      }
    };

    const showMessage = (message, type) => {
      formMessage.textContent = message;
      formMessage.className = `form-message-apple ${type}`;
      formMessage.style.display = 'block';
    };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      setLoadingState(true);

      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulamos un resultado exitoso
      showMessage('¡Mensaje enviado con éxito!', 'success');
      contactForm.reset();
      
      setLoadingState(false);
    });
  }

  // Variables principales
  const container = document.getElementById('tool-list');
  const modal = document.getElementById('modal');
  
  // Variables del modal (solo si el modal existe)
  let modalTitle, modalRating, modalPrice, modalMainPhoto, modalThumbnailsContainer;
  let modalDescription, modalFeatures, modalReview, prosList, consList;
  let closeBtn, backBtn, amazonLink;
  
  // Variables del zoom modal (solo si existe)
  let zoomModal, zoomImage, zoomClose, prevButton, nextButton;
  
  // Inicializar variables del modal si existen
  if (modal) {
    modalTitle = modal.querySelector('.modal-title');
    modalRating = modal.querySelector('.modal-rating');
    modalPrice = modal.querySelector('.modal-price');
    modalMainPhoto = document.getElementById('modal-main-photo');
    modalThumbnailsContainer = modal.querySelector('.modal-thumbnails');
    modalDescription = document.getElementById('modal-description');
    modalFeatures = document.getElementById('modal-features');
    modalReview = document.getElementById('modal-review');
    prosList = document.getElementById('pros-list');
    consList = document.getElementById('cons-list');
    closeBtn = modal.querySelector('.modal-close');
    backBtn = document.getElementById('back-to-list');
    amazonLink = document.getElementById('amazon-link');
  }

  // Inicializar variables del zoom modal si existe
  zoomModal = document.getElementById('zoom-modal');
  if (zoomModal) {
    zoomImage = document.getElementById('zoom-image');
    zoomClose = zoomModal.querySelector('.zoom-close');
    prevButton = zoomModal.querySelector('.prev-image');
    nextButton = zoomModal.querySelector('.next-image');
  }
  let currentImageIndex = 0;
  let currentImages = [];

  let toolsData = [];
  let currentFilter = 'all';
  let currentSort = 'default';
  let currentSearch = '';
  
  // Variables de paginación
  let currentPageNum = 1;
  let itemsPerPage = 8; // Productos por página en acceso rápido
  let filteredToolsCache = [];

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const xmlFile = currentPage === 'index.html' ? 'tools.xml' : 'otros-productos.xml';
  const paginationContainer = document.getElementById('pagination-container');

  // Funciones auxiliares XML
  function getNodeText(parentNode, tagName) {
    let node = parentNode.querySelector(tagName);
    if (!node) {
      // Método alternativo para elementos de una sola letra
      node = parentNode.getElementsByTagName(tagName)[0];
    }
    return node ? node.textContent.trim() : '';
  }

  function getNodeList(parentNode, containerTag, itemTag) {
    const container = parentNode.querySelector(containerTag);
    if (!container) return [];
    return Array.from(container.querySelectorAll(itemTag))
      .map(node => node.textContent.trim())
      .filter(text => text.length > 0);
  }

  function parseReview(reviewText) {
    const cdataMatch = reviewText.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    const cleanText = cdataMatch ? cdataMatch[1].trim() : reviewText.trim();
    
    const prosMatch = cleanText.match(/<pros>([\s\S]*?)<\/pros>/);
    const consMatch = cleanText.match(/<cons>([\s\S]*?)<\/cons>/);
    
    // Extraer pros y cons
    const pros = [];
    const cons = [];
    
    if (prosMatch) {
      const prosContent = prosMatch[1];
      const prosMatches = prosContent.match(/<pro>([\s\S]*?)<\/pro>/g);
      if (prosMatches) {
        prosMatches.forEach(match => {
          const content = match.replace(/<\/?pro>/g, '').trim();
          if (content) pros.push(content);
        });
      }
    }
    
    if (consMatch) {
      const consContent = consMatch[1];
      const consMatches = consContent.match(/<con>([\s\S]*?)<\/con>/g);
      if (consMatches) {
        consMatches.forEach(match => {
          const content = match.replace(/<\/?con>/g, '').trim();
          if (content) cons.push(content);
        });
      }
    }
    
    let mainContent = cleanText
      .replace(/<pros>[\s\S]*?<\/pros>/g, '')
      .replace(/<cons>[\s\S]*?<\/cons>/g, '')
      .trim();
    
    const summary = generateSummary(mainContent);
    mainContent = processHtmlContent(mainContent);
    
    return {
      description: mainContent,
      summary: summary,
      reviewText: '',
      pros: pros,
      cons: cons
    };
  }

  // Generar resumen
  function generateSummary(content) {
    let cleanContent = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/[✅❌💡⚠️📊🔧🏆🔬📏🔩⚡🏋️💪🌡️🎯⚙️📋🔍🏠🛠️🎨🏗️🚿🍽️🚽🏢🧰📱🧽💾]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    let summary = '';
    
    const keyPhrases = ['es una', 'representa', 'se ha convertido', 'ha demostrado', 'combina', 'ofrece'];
    const keyInfo = sentences.find(sentence => 
      keyPhrases.some(phrase => sentence.toLowerCase().includes(phrase))
    );
    
    if (keyInfo) {
      summary = keyInfo.trim() + '.';
    } else if (sentences.length > 0) {
      summary = sentences.slice(0, 2).join('. ').trim();
      if (!summary.endsWith('.')) summary += '.';
    }
    
    if (summary.length > 200) {
      summary = summary.substring(0, 197) + '...';
    }
    
    return summary || 'Producto de alta calidad con excelentes prestaciones.';
  }

  // Procesar contenido HTML
  function processHtmlContent(content) {
    content = content.trim();
    
    content = content.replace(/<strong>([^<]+):<\/strong>/g, '<h3>$1</h3>');
    content = content.replace(/<strong>([^<]+)<\/strong>/g, '<strong>$1</strong>');
    
    content = content.replace(/"([^"]+)"\s*-\s*([^.,\n]+(?:,\s*[^.\n]+)?)\./g, 
      '<blockquote>"$1" <cite>- $2</cite></blockquote>');
    
    content = content.replace(/(?:^|\n)\s*([✅❌💡⚠️📊🔧🏆🔬📏🔩⚡🏋️💪🌡️🎯⚙️📋🔍🎯🏠🛠️🔧⚡🎨🏗️🚿🍽️🚽🏢🧰📱🧽💾])\s*\*\*([^*]+)\*\*:\s*([^\n]+)/g,
      '<div class="spec-highlight"><span class="spec-icon">$1</span><strong>$2:</strong> $3</div>');
    
    content = content.replace(/(?:^|\n)\s*(\d+)\.\s*\*\*([^*]+)\*\*:\s*([^\n]+)/g,
      '<div class="numbered-item"><span class="number">$1.</span><strong>$2:</strong> $3</div>');
    
    content = content.replace(/(?:^|\n)\s*-\s*([^\n]+)/g, '<li>$1</li>');
    
    content = content.replace(/(<li>.*<\/li>)/gs, (match) => {
      return '<ul>' + match + '</ul>';
    });
    
    content = content.replace(/<\/ul>\s*<ul>/g, '');
    const lines = content.split('\n');
    const processedLines = [];
    let inList = false;
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      // Si ya es una etiqueta HTML, mantenerla
      if (line.startsWith('<')) {
        processedLines.push(line);
        inList = false;
      } 
      // Si es texto normal, envolver en párrafo
      else if (!line.match(/^\s*[-*]\s/) && !line.match(/^\s*\d+\./)) {
        processedLines.push('<p>' + line + '</p>');
        inList = false;
      } else {
        processedLines.push(line);
      }
    }
    
    content = processedLines.join('\n');
    
    // Procesar comparativas (vs. texto)
    content = content.replace(/\*\*(vs\.[^*]+)\*\*:/g, '<h4 class="comparison">$1</h4>');
    
    // Procesar subsecciones (**Texto**:)
    content = content.replace(/\*\*([^*]+)\*\*:/g, '<h4>$1</h4>');
    
    // Procesar texto en negrita simple
    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Procesar iconos standalone
    content = content.replace(/✅\s*/g, '<span class="check-icon">✅</span> ');
    content = content.replace(/❌\s*/g, '<span class="cross-icon">❌</span> ');
    content = content.replace(/💡\s*/g, '<span class="tip-icon">💡</span> ');
    content = content.replace(/⚠️\s*/g, '<span class="warning-icon">⚠️</span> ');
    content = content.replace(/📊\s*/g, '<span class="chart-icon">📊</span> ');
    content = content.replace(/🔧\s*/g, '<span class="tool-icon">🔧</span> ');
    content = content.replace(/🏆\s*/g, '<span class="trophy-icon">🏆</span> ');
    
    // Limpiar párrafos vacíos y espacios extra
    content = content.replace(/<p>\s*<\/p>/g, '');
    content = content.replace(/\n\s*\n/g, '\n');
    
    return content;
  }

  // Función para generar las URLs de las imágenes
  function getImageUrls(tool) {
    const photoNodes = tool.querySelectorAll('photos photo');
    const baseUrl = 'https://arielmendoza.github.io/';
    const imagesFolder = currentPage === 'index.html' ? 'images' : 'images_otros';
    
    return Array.from(photoNodes).map((photo, index) => {
      const photoNumber = photo.textContent.trim();
      const toolId = tool.getAttribute('id');
      return `${baseUrl}${imagesFolder}/id${toolId}_${photoNumber}.jpg`;
    });
  }

  // Función para validar un nodo de herramienta
  function validateTool(tool, index) {
    const errors = [];
    
    // Validar ID
    if (!tool.hasAttribute('id')) {
      errors.push(`Herramienta #${index + 1}: Falta el atributo 'id'`);
    }

    // Validar nombre específicamente usando diferentes métodos
    const nameNode = tool.querySelector('n');
    const nameNodeDirect = tool.getElementsByTagName('n')[0];
    
    console.log(`Debug Herramienta #${index + 1}: querySelector('n')`, nameNode);
    console.log(`Debug Herramienta #${index + 1}: getElementsByTagName('n')[0]`, nameNodeDirect);
    console.log(`Debug Herramienta #${index + 1}: tool.childNodes`, tool.childNodes);
    
    // Usar el método que funcione
    const finalNameNode = nameNode || nameNodeDirect;
    
    if (!finalNameNode) {
      errors.push(`Herramienta #${index + 1}: Falta el campo 'nombre' (elemento <n>)`);
    } else {
      console.log(`Debug Herramienta #${index + 1}: Nombre encontrado: "${finalNameNode.textContent}"`);
    }

    // Validar otros campos requeridos
    const requiredFields = {
      'photos': 'fotos',
      'rating': 'valoración',
      'price': 'precio'
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      const node = tool.querySelector(field);
      if (!node) {
        errors.push(`Herramienta #${index + 1}: Falta el campo '${label}'`);
      }
    });

    // Validar fotos
    const photos = tool.querySelector('photos');
    if (photos) {
      const photoNodes = photos.querySelectorAll('photo');
      if (photoNodes.length === 0) {
        errors.push(`Herramienta #${index + 1}: Debe tener al menos una foto`);
      }
      
      // Validar que los números de foto sean válidos
      const id = tool.getAttribute('id');
      if (id) {
        photoNodes.forEach((photo, index) => {
          const photoNumber = photo.textContent.trim();
          if (!photoNumber || isNaN(photoNumber)) {
            errors.push(`Herramienta #${id}: La foto #${index + 1} debe tener un número válido`);
          }
        });
      }
    }

    // Validar rating
    const rating = tool.querySelector('rating');
    if (rating) {
      const ratingValue = parseFloat(rating.textContent);
      if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
        errors.push(`Herramienta #${index + 1}: La valoración debe ser un número entre 0 y 5`);
      }
    }

    // Validar precio
    const price = tool.querySelector('price');
    if (price) {
      const priceValue = parseFloat(price.textContent);
      if (isNaN(priceValue) || priceValue < 0) {
        errors.push(`Herramienta #${index + 1}: El precio debe ser un número positivo`);
      }
      if (!price.hasAttribute('currency')) {
        errors.push(`Herramienta #${index + 1}: Falta el atributo 'currency' en el precio`);
      }
    }

    // Validar enlace de afiliado
    const affiliateLink = getNodeText(tool, 'affiliateLink').replace(/^@/, '');
    if (affiliateLink && affiliateLink.length > 0) {
      if (!affiliateLink.startsWith('http')) {
        errors.push(`Herramienta #${index + 1}: El enlace de afiliado debe ser una URL válida que comience con http:// o https://`);
      }
    }

    return errors;
  }

  // Cargar datos del XML
  async function loadToolsData() {
    try {
      const response = await fetch(xmlFile);
      if (!response.ok) throw new Error(`No se pudo cargar el archivo ${xmlFile}`);
      const xmlText = await response.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Verificar si hay errores de parsing
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Error al parsear el XML: ' + parserError.textContent);
      }

      // Validar estructura básica
      const tools = Array.from(xmlDoc.querySelectorAll('tool'));
      if (tools.length === 0) {
        throw new Error(`El archivo ${xmlFile} no contiene productos`);
      }

      // Debug: Verificar estructura del primer producto
      console.log('Primer producto XML:', tools[0]);
      console.log('Elemento <n> encontrado:', tools[0].querySelector('n'));
      console.log('Contenido de <n>:', tools[0].querySelector('n')?.textContent);
      
      // Validar cada producto (temporalmente deshabilitado para debug)
      console.log('Omitiendo validación para debug - procesando productos directamente');
      /* 
      const errors = [];
      tools.forEach((tool, index) => {
        const toolErrors = validateTool(tool, index);
        errors.push(...toolErrors);
      });

      if (errors.length > 0) {
        console.error('Errores de validación:', errors);
        const errorList = errors.map(err => `• ${err}`).join('\n');
        throw new Error('Se encontraron los siguientes errores:\n' + errorList);
      }
      */
      
      // Procesar productos
      toolsData = tools.map(tool => {
        const id = tool.getAttribute('id');
        const name = getNodeText(tool, 'n');
        const photos = getImageUrls(tool);
        const rating = parseFloat(getNodeText(tool, 'rating')) || 0;
        const priceNode = tool.querySelector('price');
        const price = priceNode ? parseFloat(priceNode.textContent) || 0 : 0;
        const currency = priceNode?.getAttribute('currency') || 'EUR';
        const offer = getNodeText(tool, 'offer') === 'true';
        const affiliateLink = getNodeText(tool, 'affiliateLink').replace(/^@/, '');
        
        const reviewNode = tool.querySelector('review');
        const reviewData = reviewNode 
          ? parseReview(reviewNode.innerHTML)
          : { description: '', reviewText: '', pros: [], cons: [] };

        return {
          id,
          name,
          photos,
          rating,
          price,
          currency,
          offer,
          affiliateLink,
          ...reviewData
        };
      });
      
      renderList();
    } catch (err) {
      console.error('Error al cargar los datos:', err);
      container.innerHTML = `
        <div class="error-message">
          <h2>Error al cargar los datos</h2>
          <p>Se encontraron los siguientes errores al cargar el archivo XML:</p>
          <pre>${err.message}</pre>
          <p>Por favor, corrige los errores y vuelve a intentarlo.</p>
        </div>
      `;
    }
  }

  // Función para filtrar y ordenar productos
  function filterAndSortTools() {
    let filteredTools = [...toolsData];
    
    // Aplicar búsqueda
    if (currentSearch.trim()) {
      const searchTerm = currentSearch.toLowerCase().trim();
      filteredTools = filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.summary.toLowerCase().includes(searchTerm)
      );
    }
    
    // Aplicar filtro
    if (currentFilter === 'offer') {
      filteredTools = filteredTools.filter(tool => tool.offer);
    }
    
    // Aplicar ordenación
    switch (currentSort) {
      case 'price-asc':
        filteredTools.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredTools.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filteredTools.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        filteredTools.sort((a, b) => a.rating - b.rating);
        break;
      default:
        // Mantener el orden original
        break;
    }
    
    // Guardar en cache para paginación
    filteredToolsCache = filteredTools;
    return filteredTools;
  }

  // Función para paginar productos
  function getPaginatedTools(tools, page = 1) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tools.slice(startIndex, endIndex);
  }

  // Función para renderizar paginación
  function renderPagination(totalItems) {
    if (!paginationContainer || totalItems <= itemsPerPage) {
      if (paginationContainer) paginationContainer.style.display = 'none';
      return;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';

    // Botón anterior
    paginationHTML += `
      <button class="pagination-btn ${currentPageNum === 1 ? 'disabled' : ''}" 
              data-page="${currentPageNum - 1}" ${currentPageNum === 1 ? 'disabled' : ''}>
        ← Anterior
      </button>
    `;

    // Números de página
    let startPage = Math.max(1, currentPageNum - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-btn ${i === currentPageNum ? 'active' : ''}" 
                data-page="${i}">
          ${i}
        </button>
      `;
    }

    // Botón siguiente
    paginationHTML += `
      <button class="pagination-btn ${currentPageNum === totalPages ? 'disabled' : ''}" 
              data-page="${currentPageNum + 1}" ${currentPageNum === totalPages ? 'disabled' : ''}>
        Siguiente →
      </button>
    `;

    // Información de página
    const startItem = (currentPageNum - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPageNum * itemsPerPage, totalItems);
    paginationHTML += `
      <div class="pagination-info">
        ${startItem}-${endItem} de ${totalItems}
      </div>
    `;

    paginationContainer.innerHTML = paginationHTML;

    // Event listeners para paginación
    paginationContainer.querySelectorAll('.pagination-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (page && page !== currentPageNum && page >= 1 && page <= totalPages) {
          currentPageNum = page;
          renderList();
        }
      });
    });
  }

  // Renderizar lista de herramientas
  function renderList() {
    if (!container) return;
    
    container.innerHTML = '';
    const filteredTools = filterAndSortTools();
    
    if (filteredTools.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <p>No se encontraron herramientas que coincidan con los filtros seleccionados.</p>
        </div>
      `;
      if (paginationContainer) paginationContainer.style.display = 'none';
      return;
    }

    // Usar paginación tanto en index.html como en otros-productos.html
    const shouldPaginate = currentPage === 'index.html' || currentPage === 'otros-productos.html';
    const toolsToRender = shouldPaginate ? 
                         getPaginatedTools(filteredTools, currentPageNum) : 
                         filteredTools;
    
    // Renderizar paginación para ambas páginas
    if (shouldPaginate) {
      renderPagination(filteredTools.length);
    }
    
    toolsToRender.forEach(tool => {
      const priceFormatted = new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: tool.currency 
      }).format(tool.price);
      
      const card = document.createElement('article');
      card.className = 'tool-card fade-in';
      card.setAttribute('data-id', tool.id);
      
      card.innerHTML = `
        <div class="tool-photo-container">
          ${tool.offer ? '<span class="tool-badge">OFERTA</span>' : ''}
          <img src="${tool.photos[0] || ''}" alt="${tool.name}" class="tool-photo" loading="lazy" />
        </div>
        <div class="tool-content">
          <h3 class="tool-name">${tool.name}</h3>
          <div class="tool-meta">
            <div class="tool-rating" aria-label="Valoración: ${tool.rating} de 5 estrellas">
              ${'★'.repeat(Math.round(tool.rating))}${'☆'.repeat(5 - Math.round(tool.rating))}
              <span>${tool.rating.toFixed(1)}</span>
            </div>
            <div class="tool-price ${tool.offer ? 'offer' : ''}">
              ${priceFormatted}
            </div>
          </div>
          <p class="tool-description">${tool.summary || 'Descripción no disponible'}</p>
          <div class="tool-actions">
            <button class="btn btn-secondary details-btn" aria-expanded="false" aria-controls="modal" data-id="${tool.id}">
              Detalles
            </button>
            ${tool.affiliateLink ? `
              <a href="${tool.affiliateLink}" target="_blank" rel="noopener noreferrer" class="btn-amazon">
                <span class="icon">🛒</span>
                Ver en Amazon
              </a>
            ` : ''}
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  }

  // Mostrar modal con detalles de la herramienta
  function showModal(tool) {
    if (!modal || !modalTitle) {
      console.log('Modal no disponible en esta página');
      return;
    }
    
    modalTitle.textContent = tool.name;
    
    modalRating.innerHTML = `
      ${'★'.repeat(Math.round(tool.rating))}${'☆'.repeat(5 - Math.round(tool.rating))}
      <span>${tool.rating.toFixed(1)} de 5</span>
    `;
    
    const priceFormatted = new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: tool.currency 
    }).format(tool.price);
    
    modalPrice.innerHTML = `
      ${priceFormatted}
      ${tool.offer ? '<span class="offer-badge">¡Oferta!</span>' : ''}
    `;
    
    // Actualizar galería
    modalThumbnailsContainer.innerHTML = '';
    modalMainPhoto.src = tool.photos[0] || '';
    modalMainPhoto.alt = tool.name;
    
    tool.photos.forEach((photo, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = `modal-thumbnail ${index === 0 ? 'selected' : ''}`;
      thumbnail.innerHTML = `<img src="${photo}" alt="${tool.name} - Foto ${index + 1}" />`;
      
      thumbnail.addEventListener('click', () => {
        modalMainPhoto.src = photo;
        modalMainPhoto.alt = `${tool.name} - Foto ${index + 1}`;
        modalThumbnailsContainer.querySelectorAll('.modal-thumbnail').forEach(t => 
          t.classList.toggle('selected', t === thumbnail)
        );
      });
      
      modalThumbnailsContainer.appendChild(thumbnail);
    });
    
    // Actualizar contenido - USAR innerHTML en lugar de textContent
    modalDescription.innerHTML = tool.description || '<p>Descripción no disponible</p>';
    
    modalReview.innerHTML = tool.reviewText || '';
    
    // Actualizar pros y cons
    prosList.innerHTML = tool.pros && tool.pros.length > 0
      ? tool.pros.map(pro => `<li>${pro}</li>`).join('')
      : '<li>No se especificaron ventajas</li>';
    
    consList.innerHTML = tool.cons && tool.cons.length > 0
      ? tool.cons.map(con => `<li>${con}</li>`).join('')
      : '<li>No se especificaron desventajas</li>';
    
    // Actualizar enlace
    if (tool.affiliateLink) {
      amazonLink.href = tool.affiliateLink;
      amazonLink.className = 'btn-amazon compact';
      amazonLink.innerHTML = '<span class="icon">🛒</span>Ver en Amazon';
      amazonLink.style.display = 'flex';
    } else {
      amazonLink.style.display = 'none';
    }
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Hacer scroll hacia arriba del modal
    setTimeout(() => {
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }, 100);
    
    closeBtn.focus();
  }

  // Cerrar modal
  function closeModal() {
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    if (container) {
      const expandedBtn = container.querySelector('button[aria-expanded="true"]');
      if (expandedBtn) {
        expandedBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  // Event listeners (solo si container existe)
  if (container) {
    container.addEventListener('click', e => {
      const detailsBtn = e.target.closest('.details-btn');
      if (detailsBtn) {
        const id = detailsBtn.getAttribute('data-id');
        const tool = toolsData.find(t => t.id === id);
        if (tool) {
          showModal(tool);
          detailsBtn.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }

  // Event listeners del modal (solo si existen)
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backBtn) backBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', e => e.target === modal && closeModal());
    document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());
  }

  // Footer toggle usando event delegation para que funcione siempre
  document.addEventListener('click', function(e) {
    if (e.target.closest('.toggle-disclaimers')) {
      e.preventDefault();
      window.toggleDisclaimer();
    }
  });

  // Event listeners para filtros y ordenación (solo si existen)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('search-input');

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        currentPageNum = 1; // Reiniciar a la primera página
        renderList();
      });
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPageNum = 1; // Reiniciar a la primera página
      renderList();
    });
  }

  // Añadir event listener para búsqueda con debounce
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearch = e.target.value;
        currentPageNum = 1; // Reiniciar a la primera página
        renderList();
      }, 300); // Esperar 300ms después de que el usuario deje de escribir
    });
  }

  // Activar el filtro "Todos" por defecto (solo si existe)
  const allFilterBtn = document.querySelector('[data-filter="all"]');
  if (allFilterBtn) {
    allFilterBtn.classList.add('active');
  }

  // Función para mostrar imagen en zoom
  function showZoomImage(index) {
    if (!zoomModal || !zoomImage) return;
    
    currentImageIndex = index;
    const image = currentImages[index];
    zoomImage.src = image;
    zoomImage.alt = `Foto ${index + 1}`;
    
    // Actualizar estado de los botones de navegación
    if (prevButton) prevButton.disabled = index === 0;
    if (nextButton) nextButton.disabled = index === currentImages.length - 1;
    
    zoomModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Función para cerrar el zoom
  function closeZoom() {
    if (!zoomModal) return;
    
    zoomModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners para el zoom (solo si existen)
  if (modalMainPhoto && modalThumbnailsContainer) {
    modalMainPhoto.addEventListener('click', () => {
      currentImages = Array.from(modalThumbnailsContainer.querySelectorAll('img')).map(img => img.src);
      const mainPhotoIndex = currentImages.indexOf(modalMainPhoto.src);
      showZoomImage(mainPhotoIndex);
    });
  }

  if (zoomClose) {
    zoomClose.addEventListener('click', closeZoom);
  }
  
  if (zoomModal) {
    zoomModal.addEventListener('click', e => {
      if (e.target === zoomModal || e.target === zoomImage) {
        closeZoom();
      }
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      if (currentImageIndex > 0) {
        showZoomImage(currentImageIndex - 1);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      if (currentImageIndex < currentImages.length - 1) {
        showZoomImage(currentImageIndex + 1);
      }
    });
  }

  // Navegación con teclado (solo si zoom modal existe)
  if (zoomModal) {
    document.addEventListener('keydown', e => {
      if (!zoomModal.classList.contains('active')) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (prevButton && !prevButton.disabled) {
            showZoomImage(currentImageIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (nextButton && !nextButton.disabled) {
            showZoomImage(currentImageIndex + 1);
          }
          break;
        case 'Escape':
          closeZoom();
          break;
      }
    });
  }

  // Iniciar la aplicación (solo si hay container para productos)
  if (container) {
    loadToolsData();
  }

  // ===============================================
  // GESTIÓN DE COOKIES GDPR
  // ===============================================

  // Configuración de cookies
  const COOKIE_CONFIG = {
    consentName: 'cookie_consent',
    analyticsName: 'analytics_consent',
    marketingName: 'marketing_consent',
    expiryDays: 365
  };

  // Utilidades para cookies
  const CookieUtils = {
    // Crear una cookie
    setCookie(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    },

    // Leer una cookie
    getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    // Eliminar una cookie
    deleteCookie(name) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    },

    // Verificar si ya se dio consentimiento
    hasConsent() {
      return this.getCookie(COOKIE_CONFIG.consentName) !== null;
    },

    // Obtener configuración de cookies
    getConsentSettings() {
      return {
        necessary: true, // Siempre true
        analytics: this.getCookie(COOKIE_CONFIG.analyticsName) === 'true',
        marketing: this.getCookie(COOKIE_CONFIG.marketingName) === 'true'
      };
    }
  };

  // Gestión de Google Analytics
  const Analytics = {
    // Inicializar Google Analytics si está permitido
    init() {
      const settings = CookieUtils.getConsentSettings();
      if (settings.analytics && window.gtag) {
        // Habilitar Google Analytics
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
        console.log('Google Analytics habilitado');
      }
    },

    // Deshabilitar Google Analytics
    disable() {
      if (window.gtag) {
        gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
        console.log('Google Analytics deshabilitado');
      }
    }
  };

  // Gestión del banner de cookies
  const CookieBanner = {
    banner: document.getElementById('cookie-banner'),
    modal: document.getElementById('cookie-settings-modal'),
    
    // Inicializar el banner
    init() {
      if (!this.banner) return;

      // Mostrar banner si no hay consentimiento
      if (!CookieUtils.hasConsent()) {
        this.show();
      } else {
        // Si ya hay consentimiento, inicializar servicios
        Analytics.init();
      }

      this.bindEvents();
    },

    // Mostrar el banner
    show() {
      if (this.banner) {
        setTimeout(() => {
          this.banner.classList.add('show');
        }, 1000); // Mostrar después de 1 segundo
      }
    },

    // Ocultar el banner
    hide() {
      if (this.banner) {
        this.banner.classList.remove('show');
      }
    },

    // Mostrar modal de configuración
    showModal() {
      if (this.modal) {
        // Cargar configuración actual
        const settings = CookieUtils.getConsentSettings();
        document.getElementById('analytics-cookies').checked = settings.analytics;
        document.getElementById('marketing-cookies').checked = settings.marketing;
        
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    },

    // Ocultar modal de configuración
    hideModal() {
      if (this.modal) {
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    },

    // Aceptar todas las cookies
    acceptAll() {
      CookieUtils.setCookie(COOKIE_CONFIG.consentName, 'accepted', COOKIE_CONFIG.expiryDays);
      CookieUtils.setCookie(COOKIE_CONFIG.analyticsName, 'true', COOKIE_CONFIG.expiryDays);
      CookieUtils.setCookie(COOKIE_CONFIG.marketingName, 'true', COOKIE_CONFIG.expiryDays);
      
      Analytics.init();
      this.hide();
      
      console.log('Todas las cookies aceptadas');
    },

    // Rechazar cookies opcionales
    declineAll() {
      CookieUtils.setCookie(COOKIE_CONFIG.consentName, 'declined', COOKIE_CONFIG.expiryDays);
      CookieUtils.setCookie(COOKIE_CONFIG.analyticsName, 'false', COOKIE_CONFIG.expiryDays);
      CookieUtils.setCookie(COOKIE_CONFIG.marketingName, 'false', COOKIE_CONFIG.expiryDays);
      
      Analytics.disable();
      this.hide();
      this.hideModal();
      
      console.log('Cookies opcionales rechazadas');
    },

    // Guardar configuración personalizada
    saveSettings() {
      const analytics = document.getElementById('analytics-cookies').checked;
      const marketing = document.getElementById('marketing-cookies').checked;

      CookieUtils.setCookie(COOKIE_CONFIG.consentName, 'configured', COOKIE_CONFIG.expiryDays);
      CookieUtils.setCookie(COOKIE_CONFIG.analyticsName, analytics.toString(), COOKIE_CONFIG.expiryDays);
      CookieUtils.setCookie(COOKIE_CONFIG.marketingName, marketing.toString(), COOKIE_CONFIG.expiryDays);

      if (analytics) {
        Analytics.init();
      } else {
        Analytics.disable();
      }

      this.hide();
      this.hideModal();
      
      console.log('Configuración de cookies guardada:', { analytics, marketing });
    },

    // Vincular eventos
    bindEvents() {
      // Botones del banner
      const acceptBtn = document.getElementById('cookie-accept');
      const declineBtn = document.getElementById('cookie-decline');
      const settingsBtn = document.getElementById('cookie-settings');

      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => this.acceptAll());
      }

      if (declineBtn) {
        declineBtn.addEventListener('click', () => this.declineAll());
      }

      if (settingsBtn) {
        settingsBtn.addEventListener('click', () => this.showModal());
      }

      // Botones del modal
      const saveBtn = document.getElementById('cookie-settings-save');
      const declineModalBtn = document.getElementById('cookie-settings-decline');

      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.saveSettings());
      }

      if (declineModalBtn) {
        declineModalBtn.addEventListener('click', () => this.declineAll());
      }

      // Cerrar modal al hacer clic fuera
      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) {
            this.hideModal();
          }
        });
      }

      // Cerrar modal con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
          this.hideModal();
        }
      });
    }
  };

  // Función global para mostrar configuración de cookies (desde footer u otras páginas)
  window.showCookieSettings = function() {
    CookieBanner.showModal();
  };

  // Función para revisar consentimiento (útil para otros scripts)
  window.checkCookieConsent = function(type) {
    const settings = CookieUtils.getConsentSettings();
    return settings[type] || false;
  };

  // Inicializar gestión de cookies
  CookieBanner.init();

  // Funciones globales para compatibilidad con onclick events
  window.acceptAllCookies = function() {
    CookieBanner.acceptAll();
  };

  window.declineOptionalCookies = function() {
    CookieBanner.declineAll();
  };

  window.saveCustomCookieSettings = function() {
    CookieBanner.saveSettings();
  };

}); 