// =================================================================
// LÓGICA DE FILTRADO PARA LA PÁGINA DE INICIO (INDEX.HTML)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn-apple');
    const guideCards = document.querySelectorAll('#guides-container .guide-card');

    if (filterButtons.length > 0 && guideCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. Gestionar el estado activo de los botones
                filterButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');

                const selectedCategory = button.getAttribute('data-category');

                // 2. Filtrar las tarjetas de guía
                guideCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    // El método `closest` no es necesario si los data-category están en las tarjetas
                    if (selectedCategory === 'todos' || selectedCategory === cardCategory) {
                        card.style.display = 'block'; // O 'flex', 'grid', etc., según tu CSS
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- LÓGICA PARA FILTRADO DE PRODUCTOS (se mantiene si aplica) ---
    // Si tienes una sección de productos dinámica en el index, su lógica iría aquí.
    // Por ejemplo:
    const searchInput = document.getElementById('search-input');
    const toolListContainer = document.getElementById('tool-list');
    
    // ... y el resto del código de filtrado de productos que estaba en index.html ...
    // Nota: Esta parte es un placeholder si el filtrado de productos del index
    // se carga de forma dinámica. Si no, se puede eliminar.
}); 