document.addEventListener('DOMContentLoaded', () => {
  // Menu móvil
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // Variables principales
  const container = document.getElementById('tool-list');
  const modal = document.getElementById('modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalRating = modal.querySelector('.modal-rating');
  const modalPrice = modal.querySelector('.modal-price');
  const modalMainPhoto = document.getElementById('modal-main-photo');
  const modalThumbnailsContainer = modal.querySelector('.modal-thumbnails');
  const modalDescription = document.getElementById('modal-description');
  const modalFeatures = document.getElementById('modal-features');
  const modalReview = document.getElementById('modal-review');
  const prosList = document.getElementById('pros-list');
  const consList = document.getElementById('cons-list');
  const closeBtn = modal.querySelector('.modal-close');
  const backBtn = document.getElementById('back-to-list');
  const amazonLink = document.getElementById('amazon-link');

  // Zoom modal
  const zoomModal = document.getElementById('zoom-modal');
  const zoomImage = document.getElementById('zoom-image');
  const zoomClose = zoomModal.querySelector('.zoom-close');
  const prevButton = zoomModal.querySelector('.prev-image');
  const nextButton = zoomModal.querySelector('.next-image');
  let currentImageIndex = 0;
  let currentImages = [];

  let toolsData = [];
  let currentFilter = 'all';
  let currentSort = 'default';
  let currentSearch = '';

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const xmlFile = currentPage === 'index.html' ? 'tools.xml' : 'otros-productos.xml';

  // Funciones auxiliares XML
  function getNodeText(parentNode, tagName) {
    const node = parentNode.querySelector(tagName);
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

    // Validar campos requeridos
    const requiredFields = {
      'name': 'nombre',
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

      // Validar cada producto
      const errors = [];
      tools.forEach((tool, index) => {
        const toolErrors = validateTool(tool, index);
        errors.push(...toolErrors);
      });

      if (errors.length > 0) {
        const errorList = errors.map(err => `• ${err}`).join('\n');
        throw new Error('Se encontraron los siguientes errores:\n' + errorList);
      }
      
      // Procesar productos
      toolsData = tools.map(tool => {
        const id = tool.getAttribute('id');
        const name = getNodeText(tool, 'name');
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
    
    return filteredTools;
  }

  // Renderizar lista de herramientas
  function renderList() {
    container.innerHTML = '';
    const filteredTools = filterAndSortTools();
    
    if (filteredTools.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <p>No se encontraron herramientas que coincidan con los filtros seleccionados.</p>
        </div>
      `;
      return;
    }
    
    filteredTools.forEach(tool => {
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
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    const expandedBtn = container.querySelector('button[aria-expanded="true"]');
    if (expandedBtn) {
      expandedBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // Event listeners
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

  closeBtn.addEventListener('click', closeModal);
  backBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => e.target === modal && closeModal());
  document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());

  // Footer toggle
  const footerToggle = document.querySelector('.footer-toggle');
  const footerDisclaimers = document.querySelector('.footer-disclaimers');
  
  if (footerToggle && footerDisclaimers) {
    footerToggle.addEventListener('click', () => {
      const isExpanded = footerDisclaimers.classList.contains('expanded');
      
      if (isExpanded) {
        footerDisclaimers.classList.remove('expanded');
        footerDisclaimers.classList.add('collapsed');
        footerToggle.innerHTML = 'Ver más información <span class="icon">▼</span>';
      } else {
        footerDisclaimers.classList.remove('collapsed');
        footerDisclaimers.classList.add('expanded');
        footerToggle.innerHTML = 'Ver menos información <span class="icon">▼</span>';
      }
      
      footerToggle.classList.toggle('expanded');
    });
  }

  // Event listeners para filtros y ordenación
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');
  const searchInput = document.getElementById('search-input');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderList();
    });
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderList();
  });

  // Añadir event listener para búsqueda con debounce
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentSearch = e.target.value;
      renderList();
    }, 300); // Esperar 300ms después de que el usuario deje de escribir
  });

  // Activar el filtro "Todos" por defecto
  document.querySelector('[data-filter="all"]').classList.add('active');

  // Función para mostrar imagen en zoom
  function showZoomImage(index) {
    currentImageIndex = index;
    const image = currentImages[index];
    zoomImage.src = image;
    zoomImage.alt = `Foto ${index + 1}`;
    
    // Actualizar estado de los botones de navegación
    prevButton.disabled = index === 0;
    nextButton.disabled = index === currentImages.length - 1;
    
    zoomModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Función para cerrar el zoom
  function closeZoom() {
    zoomModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners para el zoom
  modalMainPhoto.addEventListener('click', () => {
    currentImages = Array.from(modalThumbnailsContainer.querySelectorAll('img')).map(img => img.src);
    const mainPhotoIndex = currentImages.indexOf(modalMainPhoto.src);
    showZoomImage(mainPhotoIndex);
  });

  zoomClose.addEventListener('click', closeZoom);
  zoomModal.addEventListener('click', e => {
    if (e.target === zoomModal || e.target === zoomImage) {
      closeZoom();
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentImageIndex > 0) {
      showZoomImage(currentImageIndex - 1);
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentImageIndex < currentImages.length - 1) {
      showZoomImage(currentImageIndex + 1);
    }
  });

  // Navegación con teclado
  document.addEventListener('keydown', e => {
    if (!zoomModal.classList.contains('active')) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        if (!prevButton.disabled) {
          showZoomImage(currentImageIndex - 1);
        }
        break;
      case 'ArrowRight':
        if (!nextButton.disabled) {
          showZoomImage(currentImageIndex + 1);
        }
        break;
      case 'Escape':
        closeZoom();
        break;
    }
  });

  // Manejo de avisos desplegables
  const disclaimers = document.querySelector('.footer-disclaimers');
  const toggleButton = document.querySelector('.toggle-disclaimers');

  if (disclaimers && toggleButton) {
    toggleButton.addEventListener('click', function() {
      disclaimers.classList.toggle('collapsed');
      disclaimers.classList.toggle('expanded');
      
      const icon = toggleButton.querySelector('.icon');
      if (icon) {
        icon.textContent = disclaimers.classList.contains('expanded') ? '▼' : '▲';
      }
      
      toggleButton.setAttribute('aria-expanded', 
        disclaimers.classList.contains('expanded').toString()
      );
    });
  }

  // Iniciar la aplicación
  loadToolsData();
}); 