// =================================
// FORMULARIO DE CONTACTO - EmailJS
// =================================

// Configuración de EmailJS
(function() {
    // Inicializar EmailJS con tu clave pública
    emailjs.init("8SXLJ1Hx9AbKtgkC_"); // Esta es una clave de ejemplo, debes usar la tuya
})();

// Configuración del servicio
const EMAILJS_CONFIG = {
    serviceID: 'service_hxdpdrw', // Debes configurar esto en EmailJS
    templateID: 'template_nk51j4d', // Debes configurar esto en EmailJS
    userID: '8SXLJ1Hx9AbKtgkC_' // Tu clave pública de EmailJS
};

// Elementos del DOM
let contactForm, formMessage, submitButton, btnText, btnLoading;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

function initContactForm() {
    contactForm = document.getElementById('contact-form');
    formMessage = document.getElementById('form-message');
    submitButton = contactForm?.querySelector('button[type="submit"]');
    btnText = submitButton?.querySelector('.btn-text');
    btnLoading = submitButton?.querySelector('.btn-loading');

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
        
        // Preparar datos para EmailJS
        const templateParams = {
            from_name: formData.get('user_name'),
            from_email: formData.get('user_email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_email: 'contacto@bricoexpertos.com', // Tu email de destino
            reply_to: formData.get('user_email')
        };

        // Enviar email usando EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams,
            EMAILJS_CONFIG.userID
        );

        console.log('Email enviado exitosamente:', response);
        
        // Mostrar mensaje de éxito
        showMessage(
            '✅ ¡Mensaje enviado con éxito! Te responderemos pronto.',
            'success'
        );
        
        // Limpiar formulario
        contactForm.reset();

    } catch (error) {
        console.error('Error enviando email:', error);
        
        // Mostrar mensaje de error
        showMessage(
            '❌ Error enviando el mensaje. Por favor, inténtalo de nuevo o contáctanos directamente.',
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
    if (!submitButton || !btnText || !btnLoading) return;
    
    submitButton.disabled = loading;
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
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
    
    // Auto-ocultar mensajes de éxito después de 5 segundos
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

function hideMessage() {
    if (formMessage) {
        formMessage.style.display = 'none';
    }
}

// Función de fallback si EmailJS falla
function sendEmailFallback(formData) {
    // Crear enlace mailto como backup
    const subject = encodeURIComponent(`[BricoExpertos] ${formData.get('subject')}`);
    const body = encodeURIComponent(
        `Nombre: ${formData.get('user_name')}\n` +
        `Email: ${formData.get('user_email')}\n` +
        `Asunto: ${formData.get('subject')}\n\n` +
        `Mensaje:\n${formData.get('message')}`
    );
    
    const mailtoLink = `mailto:contacto@bricoexpertos.com?subject=${subject}&body=${body}`;
    
    showMessage(
        'Se abrirá tu cliente de email. Si no funciona, copia este email: contacto@bricoexpertos.com',
        'info'
    );
    
    setTimeout(() => {
        window.location.href = mailtoLink;
    }, 2000);
}

// Exportar funciones si es necesario
window.contactForm = {
    init: initContactForm,
    validate: validateForm,
    showMessage: showMessage
}; 