# Script para arreglar el footer en todas las guías
# Elimina las líneas que intentan llamar a window.initFooterToggle

$archivos = @(
    "guia-taladros-principiantes.html",
    "guia-sierras-de-calar.html", 
    "guia-martillos.html",
    "guia-destornilladores.html",
    "guia-llaves-inglesas.html",
    "guia-llaves-fijas.html",
    "guia-herramientas-inalambricas-vs-cable.html",
    "guia-herramientas-bano.html",
    "guia-herramientas-cocina.html",
    "guia-niveles-medicion.html",
    "guia-alicates-tenazas.html",
    "guia-herramientas-jardin.html",
    "guia-principiantes-absolutos.html",
    "guia-mantenimiento-herramientas.html",
    "guia-seguridad-taller.html",
    "10-herramientas-esenciales-bricolaje.html",
    "herramientas-baratas-menos-50-euros.html",
    "sobre-nosotros.html",
    "seo-optimization.html",
    "privacidad.html",
    "google-verification.html"
)

$lineasEliminar = @(
    "        // Inicializar el toggle del footer",
    "        if (typeof window.initFooterToggle === 'function') {",
    "          window.initFooterToggle();",
    "        }"
)

$archivosArreglados = 0

foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        Write-Host "Procesando: $archivo"
        
        $contenido = Get-Content $archivo -Encoding UTF8
        $contenidoOriginal = $contenido.Count
        
        # Eliminar las líneas problemáticas
        $contenidoNuevo = $contenido | Where-Object { 
            $linea = $_.Trim()
            $linea -notlike "*initFooterToggle*" -and 
            $linea -ne "// Inicializar el toggle del footer"
        }
        
        if ($contenidoNuevo.Count -lt $contenidoOriginal) {
            $contenidoNuevo | Set-Content $archivo -Encoding UTF8
            Write-Host "  ✅ Arreglado: eliminadas $($contenidoOriginal - $contenidoNuevo.Count) líneas"
            $archivosArreglados++
        } else {
            Write-Host "  ℹ️  Ya estaba correcto"
        }
    } else {
        Write-Host "  ⚠️  No encontrado: $archivo"
    }
}

Write-Host ""
Write-Host "🎉 Proceso completado!"
Write-Host "📊 Archivos arreglados: $archivosArreglados"
Write-Host ""
Write-Host "ℹ️  Ahora todas las guías usan la función global setupFooterToggle() de script.js"
Write-Host "ℹ️  El botón del footer debería funcionar en todas las páginas" 