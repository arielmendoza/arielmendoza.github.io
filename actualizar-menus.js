// Script para actualizar automáticamente todos los menús de navegación
// Reemplaza los menús existentes por el sistema centralizado

const fs = require('fs');
const path = require('path');

// Lista de archivos HTML a actualizar
const archivosHTML = [
  'otros-productos.html',
  'sobre-nosotros.html',
  'privacidad.html',
  'guia-taladros-principiantes.html',
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
  'guia-seguridad-taller.html',
  '10-herramientas-esenciales-bricolaje.html',
  'herramientas-baratas-menos-50-euros.html',
  'guia-taladros-backup.html'
];

// Patrón regex para encontrar y reemplazar el menú de navegación
const patronMenu = /<nav[^>]*class[^>]*main-nav[^>]*>[\s\S]*?<\/nav>/gi;

// Reemplazo por el script del menú centralizado
const reemplazoMenu = `<!-- Menú de navegación cargado dinámicamente -->
  <script src="menu-navegacion.js"></script>`;

console.log('🔄 Iniciando actualización de menús de navegación...\n');

let archivosActualizados = 0;
let errores = 0;

archivosHTML.forEach(archivo => {
  try {
    if (fs.existsSync(archivo)) {
      console.log(`📝 Procesando: ${archivo}`);
      
      // Leer contenido del archivo
      let contenido = fs.readFileSync(archivo, 'utf8');
      
      // Verificar si ya tiene el menú centralizado
      if (contenido.includes('menu-navegacion.js')) {
        console.log(`  ✅ Ya tiene menú centralizado - saltando`);
        return;
      }
      
      // Verificar si tiene menú para reemplazar
      if (!patronMenu.test(contenido)) {
        console.log(`  ⚠️  No se encontró menú de navegación`);
        return;
      }
      
      // Hacer backup del archivo original
      const backupPath = `${archivo}.backup.${Date.now()}`;
      fs.writeFileSync(backupPath, contenido);
      console.log(`  💾 Backup creado: ${backupPath}`);
      
      // Reemplazar el menú
      contenido = contenido.replace(patronMenu, reemplazoMenu);
      
      // Escribir archivo actualizado
      fs.writeFileSync(archivo, contenido);
      console.log(`  ✅ Menú actualizado correctamente`);
      
      archivosActualizados++;
    } else {
      console.log(`  ❌ Archivo no encontrado: ${archivo}`);
      errores++;
    }
  } catch (error) {
    console.log(`  ❌ Error procesando ${archivo}: ${error.message}`);
    errores++;
  }
  
  console.log(''); // Línea en blanco
});

console.log('📊 RESUMEN DE LA ACTUALIZACIÓN:');
console.log(`✅ Archivos actualizados: ${archivosActualizados}`);
console.log(`❌ Errores: ${errores}`);
console.log(`📁 Total archivos procesados: ${archivosHTML.length}`);

if (archivosActualizados > 0) {
  console.log('\n🎉 ¡Actualización completada!');
  console.log('📌 IMPORTANTE:');
  console.log('   • Todos los archivos ahora usan el menú centralizado');
  console.log('   • Para modificar el menú, edita solo "menu-navegacion.js"');
  console.log('   • Los backups están disponibles por seguridad');
  console.log('   • Verifica que el dropdown funcione correctamente');
}

if (errores > 0) {
  console.log('\n⚠️  Algunos archivos tuvieron errores. Revisa la salida anterior.');
}

// Instrucciones para el usuario
console.log('\n📝 PRÓXIMOS PASOS:');
console.log('1. Abre cualquier página en el navegador');
console.log('2. Verifica que el menú "Guías" aparezca correctamente');
console.log('3. Comprueba que el dropdown muestre todas las guías');
console.log('4. Prueba la navegación en móvil');
console.log('5. Si hay problemas, usa los archivos .backup para restaurar');

console.log('\n💡 VENTAJAS DEL NUEVO SISTEMA:');
console.log('• Solo necesitas editar menu-navegacion.js para cambiar el menú');
console.log('• Añadir nuevas guías es automático');
console.log('• Mejor mantenimiento y consistencia');
console.log('• Carga más rápida al estar centralizado'); 