$archivos = @(
    "10-herramientas-esenciales-bricolaje.html",
    "google-verification.html",
    "guia-alicates-tenazas.html", 
    "guia-destornilladores.html",
    "guia-herramientas-inalambricas-vs-cable.html",
    "guia-herramientas-jardin.html",
    "guia-llaves-fijas.html",
    "guia-llaves-inglesas.html",
    "guia-mantenimiento-herramientas.html",
    "guia-niveles-medicion.html",
    "guia-principiantes-absolutos.html",
    "guia-seguridad-taller.html",
    "guia-taladros-backup.html",
    "herramientas-baratas-menos-50-euros.html",
    "privacidad.html",
    "seo-optimization.html",
    "sobre-nosotros.html"
)

foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        Write-Host "Arreglando: $archivo"
        
        $contenido = Get-Content $archivo -Raw
        
        # Reemplazar el bloque problemático con solo la carga del footer
        $patron = '// Inicializar el toggle del footer[\s\S]*?window\.initFooterToggle\(\);\s*}\s*}, 200\);'
        $contenidoNuevo = $contenido -replace $patron, ''
        
        # También eliminar líneas sueltas
        $contenidoNuevo = $contenidoNuevo -replace '\s*// Inicializar el toggle del footer\s*', ''
        $contenidoNuevo = $contenidoNuevo -replace '\s*setTimeout\(\(\)\s*=>\s*\{\s*if\s*\(typeof window\.initFooterToggle.*?\s*\), 200\);\s*', ''
        
        if ($contenidoNuevo -ne $contenido) {
            $contenidoNuevo | Set-Content $archivo -Encoding UTF8
            Write-Host "  ✅ Arreglado"
        } else {
            Write-Host "  ℹ️  No necesitaba cambios"
        }
    }
}

Write-Host ""
Write-Host "🎉 ¡Todos los archivos arreglados!"
 