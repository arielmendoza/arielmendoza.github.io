// =================================
// FORMULARIO DE CONTACTO - SIMPLE
// =================================

// Elementos del DOM
let contactForm, formMessage, submitButton;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

function initContactForm() {
    contactForm = document.getElementById('contact-form');
    formMessage = document.getElementById('form-message');
    submitButton = contactForm?.querySelector('button[type="submit"]');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // Mostrar estado de carga
    setLoadingState(true);
    hideMessage();

    try {
        // Obtener datos del formulario
        const formData = new FormData(contactForm);
        
        // Simular envío (3 segundos de "procesamiento")
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Guardar datos localmente (simulación de envío)
        const contactData = {
            timestamp: new Date().toISOString(),
            name: formData.get('user_name'),
            email: formData.get('user_email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Guardar en localStorage como simulación
        let contacts = JSON.parse(localStorage.getItem('bricoexpertos_contacts') || '[]');
        contacts.push(contactData);
        localStorage.setItem('bricoexpertos_contacts', JSON.stringify(contacts));
        
        console.log('Mensaje guardado:', contactData);
        
        // Mostrar mensaje de éxito
        showMessage(
            '✅ ¡Mensaje enviado con éxito! Hemos recibido tu consulta y te responderemos en las próximas 24 horas a tu email.',
            'success'
        );
        
        // Limpiar formulario
        contactForm.reset();

    } catch (error) {
        console.error('Error procesando formulario:', error);
        
        // Mostrar mensaje de error
        showMessage(
            '❌ Error enviando el mensaje. Por favor, inténtalo de nuevo o contáctanos directamente a contacto@bricoexpertos.com',
            'error'
        );
    } finally {
        setLoadingState(false);
    }
}

function validateForm() {
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Limpiar errores previos
    clearFieldError(e);
    
    // Validar campo requerido
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    // Validaciones específicas
    switch (fieldName) {
        case 'user_email':
            if (value && !isValidEmail(value)) {
                showFieldError(field, 'Por favor, introduce un email válido');
                return false;
            }
            break;
        case 'user_name':
            if (value && value.length < 2) {
                showFieldError(field, 'El nombre debe tener al menos 2 caracteres');
                return false;
            }
            break;
        case 'message':
            if (value && value.length < 10) {
                showFieldError(field, 'El mensaje debe tener al menos 10 caracteres');
                return false;
            }
            break;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    field.style.borderColor = '#dc3545';
    field.style.background = '#fff5f5';
    
    // Crear o actualizar mensaje de error
    let errorMsg = field.parentNode.querySelector('.field-error');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'field-error';
        errorMsg.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
        field.parentNode.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '';
    field.style.background = '';
    
    const errorMsg = field.parentNode.querySelector('.field-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function setLoadingState(loading) {
    if (!submitButton) return;
    
    submitButton.disabled = loading;
    
    if (loading) {
        submitButton.innerHTML = `
            <span class="btn-loading" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                <div style="width: 1rem; height: 1rem; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                Enviando...
            </span>
        `;
        submitButton.classList.add('btn-loading');
    } else {
        submitButton.innerHTML = '<span class="btn-text">Enviar mensaje</span>';
        submitButton.classList.remove('btn-loading');
    }
}

function showMessage(message, type = 'info') {
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `form-message-apple ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll suave hacia el mensaje
    formMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
    
    // Auto-ocultar mensajes de éxito después de 8 segundos
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 8000);
    }
}

function hideMessage() {
    if (formMessage) {
        formMessage.style.display = 'none';
    }
}

// Función para ver los mensajes guardados (para testing)
function viewStoredMessages() {
    const contacts = JSON.parse(localStorage.getItem('bricoexpertos_contacts') || '[]');
    console.table(contacts);
    return contacts;
}

// Agregar CSS para la animación de carga
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Exportar funciones para testing
window.contactFormSimple = {
    init: initContactForm,
    validate: validateForm,
    showMessage: showMessage,
    viewMessages: viewStoredMessages
}; 