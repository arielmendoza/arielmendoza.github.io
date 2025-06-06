# 📧 Configuración EmailJS - Formulario de Contacto

## ¿Qué es EmailJS?
EmailJS permite enviar emails directamente desde JavaScript sin necesidad de un servidor backend. Es perfecto para sitios estáticos como el tuyo.

## 🚀 Pasos para Configurar

### 1. Crear Cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en "Sign Up" y crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar Servicio de Email
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email:
   - **Gmail** (más fácil para empezar)
   - **Outlook/Hotmail**
   - **Yahoo**
   - O cualquier otro SMTP
4. Sigue las instrucciones para conectar tu cuenta
5. **Anota el Service ID** (ej: `service_abc123`)

### 3. Crear Template de Email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Configura el template así:

**Subject:** `Nuevo mensaje desde BricoExpertos - {{subject}}`

**Content:**
```
Has recibido un nuevo mensaje desde el formulario de contacto de BricoExpertos:

De: {{from_name}}
Email: {{from_email}}
Asunto: {{subject}}

Mensaje:
{{message}}

---
Responder a: {{reply_to}}
```

4. En la pestaña **"Settings"**:
   - **To email:** Tu email donde quieres recibir los mensajes
   - **From name:** BricoExpertos
   - **Reply to:** `{{reply_to}}`

5. **Guarda y anota el Template ID** (ej: `template_xyz789`)

### 4. Obtener Claves de API
1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key** (ej: `H2RnMYhYI1KiEYdBj`)

### 5. Actualizar el Código
Edita el archivo `contact-form.js` y cambia estas líneas:

```javascript
// Línea 7: Cambia por tu Public Key real
emailjs.init("TU_PUBLIC_KEY_AQUI");

// Líneas 11-14: Cambia por tus IDs reales
const EMAILJS_CONFIG = {
    serviceID: 'TU_SERVICE_ID_AQUI',     // ej: service_abc123
    templateID: 'TU_TEMPLATE_ID_AQUI',   // ej: template_xyz789
    userID: 'TU_PUBLIC_KEY_AQUI'         // mismo que la línea 7
};
```

### 6. Cambiar Email de Destino
En la línea 63 de `contact-form.js`, cambia:
```javascript
to_email: 'tu-email-real@gmail.com', // Cambia por tu email real
```

## 🧪 Probar el Formulario

1. Abre `sobre-nosotros.html` en tu navegador
2. Rellena el formulario con datos de prueba
3. Envía el mensaje
4. Deberías recibir el email en tu bandeja de entrada

## 📋 Límites del Plan Gratuito
- **200 emails/mes** gratis
- Para más volumen, hay planes de pago desde $7/mes

## 🔧 Solución de Problemas

### ❌ Error: "EmailJS user ID is required"
- Verifica que el Public Key esté configurado correctamente

### ❌ Error: "Service not found"
- Verifica que el Service ID sea correcto
- Asegúrate de que el servicio esté activo en EmailJS

### ❌ Error: "Template not found"
- Verifica que el Template ID sea correcto
- Asegúrate de que el template esté guardado

### ❌ Los emails no llegan
- Revisa la carpeta de spam
- Verifica que el email de destino sea correcto en el template
- Comprueba los logs en el dashboard de EmailJS

## 🛡️ Alternativa Sin EmailJS

Si no quieres configurar EmailJS, el formulario tiene un fallback que abre el cliente de email del usuario con todos los datos pre-rellenados.

## 📧 Email de Contacto Sugerido
Considera crear un email específico como:
- `contacto@bricoexpertos.com`
- `info@bricoexpertos.com`
- `soporte@bricoexpertos.com`

¡Una vez configurado, tendrás un formulario de contacto completamente funcional! 🎉 