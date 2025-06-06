// =================================
// FORMULARIO DE CONTACTO SIMPLE
// =================================

document.addEventListener('DOMContentLoaded', function() {
    initSimpleContactForm();
});

function initSimpleContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    const btnText = submitButton?.querySelector('.btn-text');
    const btnLoading = submitButton?.querySelector('.btn-loading');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateSimpleForm(contactForm)) {
            return;
        }

        // Mostrar estado de carga
        setSimpleLoadingState(true, submitButton, btnText, btnLoading);
        hideSimpleMessage(formMessage);

        // Obtener datos del formulario
        const formData = new FormData(contactForm);
        
        // Crear email usando mailto
        const subject = encodeURIComponent(`[BricoExpertos] ${formData.get('subject')}`);
        const body = encodeURIComponent(
            `Hola,\n\n` +
            `Te escribo desde el formulario de contacto de BricoExpertos:\n\n` +
            `Nombre: ${formData.get('user_name')}\n` +
            `Email: ${formData.get('user_email')}\n` +
            `Asunto: ${formData.get('subject')}\n\n` +
            `Mensaje:\n${formData.get('message')}\n\n` +
            `Saludos,\n${formData.get('user_name')}`
        );
        
        const mailtoLink = `mailto:contacto@bricoexpertos.com?subject=${subject}&body=${body}`;
        
        // Mostrar mensaje de información
        showSimpleMessage(
            formMessage,
            '📧 Se abrirá tu cliente de email con el mensaje preparado. Si no se abre automáticamente, puedes enviar un email a: contacto@bricoexpertos.com',
            'info'
        );
        
        // Abrir cliente de email después de un breve delay
        setTimeout(() => {
            window.location.href = mailtoLink;
            
            // Limpiar formulario después del envío
            setTimeout(() => {
                contactForm.reset();
                showSimpleMessage(
                    formMessage,
                    '✅ ¡Perfecto! Tu email debería haberse abierto. Si hay algún problema, puedes escribir directamente a contacto@bricoexpertos.com',
                    'success'
                );
            }, 1000);
            
        }, 1500);
        
        setSimpleLoadingState(false, submitButton, btnText, btnLoading);
    });
    
    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateSimpleField);
        input.addEventListener('input', clearSimpleFieldError);
    });
}

function validateSimpleForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateSimpleField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateSimpleField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Limpiar errores previos
    clearSimpleFieldError(e);
    
    // Validar campo requerido
    if (field.hasAttribute('required') && !value) {
        showSimpleFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    // Validaciones específicas
    switch (fieldName) {
        case 'user_email':
            if (value && !isValidEmail(value)) {
                showSimpleFieldError(field, 'Por favor, introduce un email válido');
                return false;
            }
            break;
        case 'user_name':
            if (value && value.length < 2) {
                showSimpleFieldError(field, 'El nombre debe tener al menos 2 caracteres');
                return false;
            }
            break;
        case 'message':
            if (value && value.length < 10) {
                showSimpleFieldError(field, 'El mensaje debe tener al menos 10 caracteres');
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

function showSimpleFieldError(field, message) {
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

function clearSimpleFieldError(e) {
    const field = e.target;
    field.style.borderColor = '';
    field.style.background = '';
    
    const errorMsg = field.parentNode.querySelector('.field-error');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function setSimpleLoadingState(loading, submitButton, btnText, btnLoading) {
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

function showSimpleMessage(formMessage, message, type = 'info') {
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
            hideSimpleMessage(formMessage);
        }, 8000);
    }
}

function hideSimpleMessage(formMessage) {
    if (formMessage) {
        formMessage.style.display = 'none';
    }
} 