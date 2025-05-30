document.addEventListener('DOMContentLoaded', () => {
  // Variables globales
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

  let toolsData = [];

  // Función para extraer texto de un nodo XML con manejo de errores
  function getNodeText(parentNode, tagName) {
    const node = parentNode.querySelector(tagName);
    return node ? node.textContent.trim() : '';
  }

  // Función para extraer lista de elementos de un nodo XML
  function getNodeList(parentNode, containerTag, itemTag) {
    const container = parentNode.querySelector(containerTag);
    if (!container) return [];
    return Array.from(container.querySelectorAll(itemTag))
      .map(node => node.textContent.trim())
      .filter(text => text.length > 0);
  }

  // Función para parsear la revisión XML
  function parseReview(reviewText) {
    // Extraer el contenido del CDATA si existe
    const cdataMatch = reviewText.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    const cleanText = cdataMatch ? cdataMatch[1].trim() : reviewText.trim();
    
    // Crear un XML válido con el contenido
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?><review>${cleanText}</review>`;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');
    
    if (doc.querySelector('parsererror')) {
      console.error('Error al parsear XML:', cleanText);
      return {
        description: '',
        reviewText: '',
        pros: [],
        cons: []
      };
    }

    // Extraer el texto principal (todo lo que está antes de los pros/cons)
    const description = cleanText
      .split('<pros>')[0]
      .trim()
      .replace(/\s+/g, ' ');

    // Extraer el texto final (todo lo que está después de los cons)
    const reviewContent = cleanText
      .split('</cons>')[1]
      ?.trim()
      .replace(/\s+/g, ' ') || '';

    return {
      description,
      reviewText: reviewContent,
      pros: getNodeList(doc, 'pros', 'pro'),
      cons: getNodeList(doc, 'cons', 'con')
    };
  }

  // Cargar datos del XML
  async function loadToolsData() {
    try {
      const response = await fetch('tools.xml');
      if (!response.ok) throw new Error('No se pudo cargar el XML');
      const xmlText = await response.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('Error al parsear el XML');
      }
      
      // Procesar herramientas
      const tools = Array.from(xmlDoc.querySelectorAll('tool'));
      toolsData = tools.map(tool => {
        // Extraer datos básicos
        const id = tool.getAttribute('id');
        const name = getNodeText(tool, 'name');
        const photos = getNodeList(tool, 'photos', 'photo');
        const rating = parseFloat(getNodeText(tool, 'rating')) || 0;
        
        // Procesar precio
        const priceNode = tool.querySelector('price');
        const price = priceNode ? parseFloat(priceNode.textContent) || 0 : 0;
        const currency = priceNode?.getAttribute('currency') || 'EUR';
        const offer = getNodeText(tool, 'offer') === 'true';
        
        // Procesar enlace de afiliado
        const affiliateLink = getNodeText(tool, 'affiliateLink');
        
        // Procesar review
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
          <p>Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.</p>
        </div>
      `;
    }
  }

  // Renderizar lista de herramientas
  function renderList() {
    container.innerHTML = '';
    
    toolsData.forEach(tool => {
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
          <p class="tool-description">${tool.description || 'Descripción no disponible'}</p>
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
    
    // Actualizar contenido
    modalDescription.textContent = tool.description || 'Descripción no disponible';
    
    modalReview.textContent = tool.reviewText || '';
    
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
  
  footerToggle.addEventListener('click', () => {
    const isExpanded = footerDisclaimers.classList.contains('expanded');
    footerDisclaimers.classList.toggle('collapsed');
    footerDisclaimers.classList.toggle('expanded');
    footerToggle.classList.toggle('expanded');
    footerToggle.innerHTML = isExpanded 
      ? 'Ver más información <span class="icon">▼</span>'
      : 'Ver menos información <span class="icon">▼</span>';
  });

  // Iniciar la aplicación
  loadToolsData();
}); 
