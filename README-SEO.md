# 🛠️ BricoAmazon - Configuración SEO y Google Analytics

## 📋 Resumen de Optimizaciones Implementadas

### ✅ SEO Básico
- **Sitemap XML** (`sitemap.xml`) - Lista todas las páginas para Google
- **Robots.txt** optimizado para guiar a los buscadores
- **Meta tags** mejorados en páginas principales
- **Schema.org** structured data implementado
- **Open Graph** tags para redes sociales
- **Canonical URLs** para evitar contenido duplicado

### ✅ Google Analytics 4
- **Archivo JavaScript** (`analytics.js`) con eventos personalizados
- **Integración** en páginas principales
- **Eventos automáticos**: clics Amazon, scroll depth, tiempo en página
- **Tracking personalizado** para herramientas y navegación

### ✅ Performance y Accesibilidad
- **CSS optimizado** para Core Web Vitals
- **Lazy loading** en imágenes
- **Skip links** para navegación por teclado
- **Focus visible** mejorado

## 🚀 Configuración Paso a Paso

### 1. Google Analytics 4

1. **Crear cuenta en Google Analytics**:
   - Ve a [analytics.google.com](https://analytics.google.com)
   - Crea una nueva propiedad para tu sitio web
   - Configura una secuencia de datos web

2. **Obtener tu ID de medición**:
   - Busca el ID que empieza con "G-" (ej: G-ABC123DEF4)
   - **CONFIGURADO**: Google Analytics ID ya establecido: `G-FGY8WKCEQJ`

3. **Archivos que necesitas actualizar**:
   ```bash
   index.html
   otros-productos.html
   sobre-nosotros.html
   privacidad.html
   guia-taladros-principiantes.html
   guia-martillos.html
   guia-herramientas-inalambricas-vs-cable.html
   # ... y todas las demás guías
   ```

### 2. Google Search Console

1. **Añadir propiedad**:
   - Ve a [search.google.com/search-console](https://search.google.com/search-console)
   - Añade tu dominio
   - Verifica usando Google Analytics

2. **Subir sitemap**:
   - En Search Console > Sitemaps
   - Añade: `https://tu-dominio.com/sitemap.xml`

### 3. Reemplazar URLs y dominios

**Busca y reemplaza en TODOS los archivos**:
- `tu-dominio.com` → tu dominio real
- `G-FGY8WKCEQJ` (Google Analytics ya configurado)

### 4. Crear imágenes para redes sociales

**Tamaños necesarios**:
- Open Graph (Facebook): 1200x630px
- Twitter Cards: 800x418px  
- Favicons: 32x32px, 16x16px
- Apple Touch Icon: 180x180px

**Nombres recomendados**:
```
bricoamazon-og.jpg
bricoamazon-twitter.jpg
favicon.ico
favicon-32x32.png
favicon-16x16.png
apple-touch-icon.png
```

## 📊 Eventos de Google Analytics Configurados

### Eventos Automáticos
- **amazon_click**: Clics en enlaces de Amazon
- **scroll_depth**: 25%, 50%, 75%, 100% de scroll
- **time_on_page**: 30s, 60s, 120s
- **guide_navigation**: Navegación entre guías
- **search**: Búsquedas internas
- **javascript_error**: Errores de JS

### Eventos Personalizados Disponibles
```javascript
// Tracking manual de clics en herramientas
trackToolClick('Taladro BLACK+DECKER', 'tool_click');

// Tracking de clics en productos Amazon
trackAmazonClick('Taladro Percutor', 89.99);

// Tracking de búsquedas internas  
trackInternalSearch('mejores taladros');
```

## 🔍 Palabras Clave por Página

### Página Principal (index.html)
- Herramientas bricolaje 2025
- Mejores herramientas Amazon
- Análisis herramientas
- Comparativas herramientas
- Herramientas profesionales

### Guías Específicas
- **Taladros**: "guía taladros principiantes", "mejores taladros 2025"
- **Martillos**: "tipos martillos", "mejores martillos bricolaje"
- **Sierras**: "sierras de calar", "mejores sierras caladora"
- **Destornilladores**: "destornilladores eléctricos", "kit destornilladores"

## 📈 Métricas Importantes a Monitorear

### En Google Analytics
- **Usuarios activos** y sesiones
- **Páginas más visitadas**
- **Tiempo en página** por guía
- **Eventos de conversión** (clics Amazon)
- **Búsquedas internas** más populares

### En Google Search Console
- **Clics e impresiones** en búsqueda
- **CTR promedio** por página
- **Posición promedio** de palabras clave
- **Core Web Vitals** (LCP, FID, CLS)
- **Errores de indexación**

## 🎯 Optimizaciones Adicionales Recomendadas

### Contenido
- [ ] Actualizar guías mensualmente
- [ ] Añadir sección FAQ en cada guía
- [ ] Crear más enlaces internos entre guías relacionadas
- [ ] Añadir testimonios/reseñas de usuarios

### Técnico
- [ ] Implementar HTTPS/SSL
- [ ] Configurar CDN (Cloudflare)
- [ ] Optimizar imágenes a WebP
- [ ] Comprimir CSS/JS
- [ ] Habilitar compresión Gzip/Brotli

### Link Building
- [ ] Contactar blogs de bricolaje para backlinks
- [ ] Crear contenido compartible en redes sociales
- [ ] Participar en foros de bricolaje
- [ ] Colaborar con influencers del sector

## 🛠️ Herramientas de Análisis SEO

### Gratuitas
- **Google PageSpeed Insights**: [pagespeed.web.dev](https://pagespeed.web.dev)
- **Google Search Console**: Para monitoreo de posicionamiento
- **Schema Markup Validator**: [validator.schema.org](https://validator.schema.org)
- **Rich Results Test**: Para verificar datos estructurados

### Recomendadas de Pago
- **SEMrush**: Análisis de palabras clave y competencia
- **Ahrefs**: Análisis de backlinks
- **Screaming Frog**: Auditoría técnica SEO

## 🚨 Checklist Final Antes de Publicar

### Configuración
- [ ] ID de Google Analytics actualizado en todos los archivos
- [ ] Dominio real reemplazado en todos los meta tags
- [ ] Sitemap.xml subido a Google Search Console
- [ ] Robots.txt verificado
- [ ] SSL/HTTPS configurado

### Contenido  
- [ ] Todas las imágenes tienen alt text descriptivo
- [ ] Enlaces internos funcionan correctamente
- [ ] Meta descriptions únicas por página (150-160 caracteres)
- [ ] Títulos únicos y descriptivos (50-60 caracteres)

### Performance
- [ ] Velocidad de carga < 3 segundos
- [ ] Core Web Vitals en verde
- [ ] Sitio responsive en todos los dispositivos
- [ ] Todas las páginas indexables por Google

## 📞 Soporte

Si necesitas ayuda con la configuración:

1. **Google Analytics**: [support.google.com/analytics](https://support.google.com/analytics)
2. **Search Console**: [support.google.com/webmasters](https://support.google.com/webmasters)
3. **Documentación Schema.org**: [schema.org](https://schema.org)

---

**Archivo generado automáticamente para BricoAmazon**  
*Última actualización: Enero 2025* 