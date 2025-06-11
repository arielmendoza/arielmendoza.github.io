const fs = require('fs');
const path = require('path');

// Lista de todas las guías que necesitan Google Analytics
const guidesFiles = [
  'guia-sierras-de-calar.html',
  'guia-martillos.html',
  'guia-herramientas-inalambricas-vs-cable.html',
  'guia-herramientas-bano.html',
  'guia-llaves-inglesas.html',
  'guia-destornilladores.html',
  'guia-llaves-fijas.html',
  'guia-niveles-medicion.html',
  'guia-herramientas-cocina.html',
  'guia-alicates-tenazas.html',
  'guia-principiantes-absolutos.html',
  'guia-herramientas-jardin.html',
  'guia-mantenimiento-herramientas.html',
  'guia-seguridad-taller.html'
];

// Código de Google Analytics a insertar
const analyticsCode = `  
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-FGY8WKCEQJ"></script>
  <script src="analytics.js"></script>
  `;

// Función para procesar cada archivo
function addAnalyticsToFile(filename) {
  try {
    const filePath = path.join(__dirname, filename);
    
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo no encontrado: ${filename}`);
      return;
    }

    // Leer el contenido del archivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si ya tiene Google Analytics
    if (content.includes('googletagmanager.com/gtag/js')) {
      console.log(`✅ ${filename} ya tiene Google Analytics`);
      return;
    }

    // Buscar donde insertar el código
    const searchPattern = /(\s*<link rel="stylesheet" href="styles\.css">\s*<\/head>)/;
    
    if (searchPattern.test(content)) {
      // Insertar el código de Analytics antes del CSS y </head>
      content = content.replace(
        searchPattern,
        analyticsCode + '\n  <link rel="stylesheet" href="styles.css">\n</head>'
      );
      
      // Escribir el archivo modificado
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Google Analytics añadido a ${filename}`);
    } else {
      console.log(`⚠️ No se pudo encontrar el patrón en ${filename}`);
    }
    
  } catch (error) {
    console.error(`❌ Error procesando ${filename}:`, error.message);
  }
}

// Procesar todos los archivos
console.log('🚀 Añadiendo Google Analytics a todas las guías...\n');

guidesFiles.forEach(filename => {
  addAnalyticsToFile(filename);
});

console.log('\n✅ Proceso completado!');
console.log('\n📝 RECORDATORIO:');
console.log('- Google Analytics ya configurado con ID: G-FGY8WKCEQJ');
console.log('- Verifica que el archivo analytics.js existe en tu servidor');
console.log('- Configura Google Search Console y sube el sitemap.xml');

// Función adicional para verificar que todos los archivos tienen Analytics
function verifyAnalytics() {
  console.log('\n🔍 Verificando que todos los archivos tienen Google Analytics...\n');
  
  const allFiles = [
    'index.html',
    'sobre-nosotros.html',
    'privacidad.html',
    'guia-taladros-principiantes.html',
    ...guidesFiles
  ];
  
  let filesWithAnalytics = 0;
  
  allFiles.forEach(filename => {
    try {
      const filePath = path.join(__dirname, filename);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('googletagmanager.com/gtag/js')) {
          console.log(`✅ ${filename} - Google Analytics configurado`);
          filesWithAnalytics++;
        } else {
          console.log(`❌ ${filename} - Falta Google Analytics`);
        }
      } else {
        console.log(`⚠️ ${filename} - Archivo no encontrado`);
      }
    } catch (error) {
      console.log(`❌ ${filename} - Error: ${error.message}`);
    }
  });
  
  console.log(`\n📊 Resumen: ${filesWithAnalytics}/${allFiles.length} archivos con Google Analytics`);
}

// Ejecutar verificación
setTimeout(() => {
  verifyAnalytics();
}, 1000); 