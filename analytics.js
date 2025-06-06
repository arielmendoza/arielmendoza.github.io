// Google Analytics 4 Configuration
// Reemplaza 'G-XXXXXXXXXX' con tu ID de medición real de GA4

// Configuración básica de GA4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Inicializar GA4 - CAMBIA por tu ID real
gtag('config', 'G-XXXXXXXXXX', {
  page_title: document.title,
  page_location: window.location.href,
  send_page_view: true
});

// Eventos personalizados para herramientas
function trackToolClick(toolName, category = 'tool_click') {
  gtag('event', category, {
    'tool_name': toolName,
    'page_title': document.title,
    'page_location': window.location.href
  });
}

// Tracking de clics en enlaces de Amazon
function trackAmazonClick(productName, price = null) {
  gtag('event', 'amazon_click', {
    'product_name': productName,
    'price': price,
    'currency': 'EUR',
    'page_title': document.title
  });
}

// Tracking de tiempo en página (scroll depth)
let scrollDepth = 0;
let timeOnPage = 0;
let startTime = Date.now();

window.addEventListener('scroll', function() {
  const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
  
  if (scrollPercent > scrollDepth) {
    scrollDepth = scrollPercent;
    
    // Enviar eventos cada 25% de scroll
    if (scrollDepth >= 25 && scrollDepth < 50 && !window.scroll25Sent) {
      gtag('event', 'scroll_depth', {
        'depth_percent': 25,
        'page_title': document.title
      });
      window.scroll25Sent = true;
    } else if (scrollDepth >= 50 && scrollDepth < 75 && !window.scroll50Sent) {
      gtag('event', 'scroll_depth', {
        'depth_percent': 50,
        'page_title': document.title
      });
      window.scroll50Sent = true;
    } else if (scrollDepth >= 75 && scrollDepth < 100 && !window.scroll75Sent) {
      gtag('event', 'scroll_depth', {
        'depth_percent': 75,
        'page_title': document.title
      });
      window.scroll75Sent = true;
    } else if (scrollDepth >= 100 && !window.scroll100Sent) {
      gtag('event', 'scroll_depth', {
        'depth_percent': 100,
        'page_title': document.title
      });
      window.scroll100Sent = true;
    }
  }
});

// Tracking de tiempo en página
setInterval(function() {
  timeOnPage = Math.round((Date.now() - startTime) / 1000);
  
  // Enviar eventos de tiempo cada 30 segundos
  if (timeOnPage === 30 && !window.time30Sent) {
    gtag('event', 'time_on_page', {
      'time_seconds': 30,
      'page_title': document.title
    });
    window.time30Sent = true;
  } else if (timeOnPage === 60 && !window.time60Sent) {
    gtag('event', 'time_on_page', {
      'time_seconds': 60,
      'page_title': document.title
    });
    window.time60Sent = true;
  } else if (timeOnPage === 120 && !window.time120Sent) {
    gtag('event', 'time_on_page', {
      'time_seconds': 120,
      'page_title': document.title
    });
    window.time120Sent = true;
  }
}, 1000);

// Tracking de búsquedas internas
function trackInternalSearch(searchTerm) {
  gtag('event', 'search', {
    'search_term': searchTerm,
    'page_title': document.title
  });
}

// Tracking de navegación entre guías
function trackGuideNavigation(fromGuide, toGuide) {
  gtag('event', 'guide_navigation', {
    'from_guide': fromGuide,
    'to_guide': toGuide,
    'page_title': document.title
  });
}

// Tracking de descargas (si añades PDFs o archivos)
function trackDownload(fileName, fileType) {
  gtag('event', 'file_download', {
    'file_name': fileName,
    'file_type': fileType,
    'page_title': document.title
  });
}

// Auto-tracking para enlaces externos
document.addEventListener('DOMContentLoaded', function() {
  // Tracking automático de enlaces de Amazon
  const amazonLinks = document.querySelectorAll('a[href*="amazon"]');
  amazonLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      const productName = this.textContent || this.href;
      trackAmazonClick(productName);
    });
  });

  // Tracking automático de navegación entre guías
  const guideLinks = document.querySelectorAll('a[href*="guia-"]');
  guideLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      const currentGuide = document.title;
      const targetGuide = this.textContent;
      trackGuideNavigation(currentGuide, targetGuide);
    });
  });

  // Tracking de búsqueda interna
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        trackInternalSearch(this.value.trim());
      }
    });
  }

  // Tracking de filtros
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      gtag('event', 'filter_used', {
        'filter_type': this.textContent,
        'page_title': document.title
      });
    });
  });
});

// Función para configurar Enhanced Ecommerce (para productos de Amazon)
function trackPurchase(transactionId, items) {
  gtag('event', 'purchase', {
    'transaction_id': transactionId,
    'value': items.reduce((total, item) => total + item.price, 0),
    'currency': 'EUR',
    'items': items
  });
}

// Tracking de errores JavaScript
window.addEventListener('error', function(e) {
  gtag('event', 'javascript_error', {
    'error_message': e.message,
    'error_file': e.filename,
    'error_line': e.lineno,
    'page_title': document.title
  });
});

// Tracking de performance (Core Web Vitals)
function trackWebVitals() {
  // Si tienes la librería web-vitals
  if (typeof getCLS !== 'undefined') {
    getCLS(function(metric) {
      gtag('event', 'web_vitals', {
        'metric_name': 'CLS',
        'metric_value': Math.round(metric.value * 1000),
        'page_title': document.title
      });
    });
  }
}

// Inicializar tracking de web vitals
trackWebVitals();

console.log('🔍 Google Analytics 4 configurado correctamente');
console.log('📊 Eventos personalizados activados para bricoAmazon'); 