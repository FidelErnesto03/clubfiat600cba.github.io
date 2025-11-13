# 📄 **Especificación Técnica: Portal Web del Club Fiat 600 – Córdoba**

**Versión:** 1.0  
**Fecha:** 21 de octubre de 2025  
**Cliente:** Club Fiat 600 – Córdoba (Argentina)  
**Objetivo:** Sitio web institucional one-page, estático, profesional, dinámico y de fácil mantenimiento, que celebre los **25 años del club** y el **legado del Fiat 600 argentino**.

> **Actualización 2025-10-21:** La sección específica de “Eventos” (tarjetas, contador y galería modal) fue descontinuada. Este documento se mantiene como referencia histórica del alcance original.

---

## 🎯 **1. Objetivos del Proyecto**

- Mostrar la historia del club y del Fiat 600 en Argentina con rigor histórico y emotividad.
- Destacar el **21º Encuentro Nacional (Villa Carlos Paz, 10–12 oct 2025)**.
- Facilitar la afiliación de nuevos socios mediante un formulario funcional.
- Exhibir una **galería dinámica** de eventos pasados y autos restaurados.
- Garantizar una experiencia **responsive, rápida y accesible**.
- Permitir actualizaciones futuras **sin dependencia de CMS ni programación avanzada**.

---

## 🏗️ **2. Arquitectura del Proyecto**

### Estructura de Directorios

```bash
club-fiat600-cordoba/
├── index.html                 # Página principal (one-page)
├── logo_club.jpeg             # Logo del club (80–100px de alto)
├── css/
│   └── style.css              # Estilos principales (opcional: puede ir en <style>)
├── js/
│   └── main.js                # Lógica personalizada (contador, galería dinámica)
├── images/
│   ├── eventos/
│   │   ├── vcp-2025-01.jpg
│   │   ├── vcp-2025-02.jpg
│   │   └── ...
│   ├── autos/
│   │   ├── 600-rojo.jpg
│   │   ├── interior-restaurado.jpg
│   │   └── ...
│   └── placeholder.jpg        # Imagen por defecto (opcional)
├── .htaccess                  # (Opcional) Redirección y compresión
└── README.md                  # Instrucciones de uso y actualización
```

> ✅ **Principio:** Todo el contenido (imágenes, texto) se gestiona **solo con archivos y carpetas**.  
> ✅ **Ninguna base de datos, CMS, PHP ni backend requerido.**

---

## 🖼️ **3. Galería Dinámica de Imágenes**

### Requisitos funcionales

- **Automática**: La galería debe detectar **todas las imágenes en `/images/eventos/` y `/images/autos/`** sin necesidad de editar HTML.
- **Categorías**: Dos secciones: **Eventos** y **Autos**.
- **Lightbox**: Al hacer clic, se abre en tamaño completo con navegación (flechas, teclado).
- **Responsive**: Se adapta a móvil, tablet y escritorio.
- **Carga eficiente**: Usa `loading="lazy"` y `srcset` si es posible.

### Implementación técnica

- **Librería:** [Lightbox2](https://lokeshdhakar.com/projects/lightbox2/) (ligera, sin jQuery).
- **Detección automática:** Usar **JavaScript puro** para leer el contenido de las carpetas **no es posible en navegadores por seguridad** (CORS).
  
> ⚠️ **Solución realista:**  
> Dado que los navegadores **no permiten leer directorios del servidor por JS**, la "galería dinámica" se logrará mediante:
> - Un **script de generación local** (ej: Python, Node.js) que escanea la carpeta `images/` y genera el HTML.
> - **Opción recomendada para no técnicos**: Mantener una **lista fija en HTML**, pero con una estructura tan simple que actualizarla sea como renombrar archivos.

### Alternativa práctica (recomendada)

- El usuario **solo debe colocar imágenes en `/images/eventos/` y `/images/autos/`**.
- El HTML incluirá un **comentario claro**:
  ```html
  <!-- 
    Para agregar fotos: 
    1. Subí tus imágenes a /images/eventos/ o /images/autos/
    2. Copiá y pegá un bloque <a> como los de abajo
    3. Cambiá el src y href al nombre de tu archivo
  -->
  ```
- Esto mantiene la simplicidad y evita dependencias.

---

## 🧩 **4. Secciones del Sitio (One-Page)**

| Sección | ID | Contenido clave | Animación |
|--------|----|------------------|----------|
| **Header / Hero** | `#inicio` | Logo, título, subtítulo, botones, menú | Fade-in |
| **Historia** | `#historia` | Cronología del 600 en Argentina, bloque destacado | Fade-up |
| **Eventos** | `#eventos` | Tarjeta del Encuentro Nacional 2025 + **contador regresivo** | Slide-up |
| **Galería** | `#galeria` | Dos subsecciones: *Eventos* y *Autos* con Lightbox | Fade-up |
| **Testimonios** | `#testimonios` | Citas de socios (carrusel horizontal en móvil) | Fade-up |
| **Afiliación** | `#unite` | Beneficios + formulario funcional | Fade-up |
| **Footer** | — | Copyright, redes, contacto | — |

---

## ⚙️ **5. Funcionalidades Dinámicas (JavaScript)**

### 5.1. Contador Regresivo
- **Evento:** 10 de octubre de 2025, 00:00 AR.
- **Formato:** Días – Horas – Minutos – Segundos.
- **Actualización:** Cada segundo.
- **Estilo:** Tarjetas con fondo azul, texto blanco, sombra suave.

### 5.2. Formulario de Contacto
- **Servicio:** [Formspree](https://formspree.io/) (sin backend).
- **Campos:**
  - Nombre (texto, obligatorio)
  - Email (email, obligatorio)
  - Mensaje: “¿Por qué querés unirte?” (textarea, obligatorio)
- **Redirección:** Mantiene al usuario en la página (AJAX implícito por Formspree).

### 5.3. Animaciones al Hacer Scroll
- **Librería:** [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- **Efectos:** `fade-up`, `fade-left`, `fade-right`.
- **Duración:** 800ms, una sola vez por carga.

---

## 🎨 **6. Diseño y Estética**

### Colores (variables CSS)
```css
:root {
  --rojo: #d7262e;      /* Rojo bandera argentina */
  --azul: #0a3d7a;      /* Azul profundo */
  --gris-fondo: #f8f9fa;
  --gris-claro: #ffffff;
  --texto: #1b1b1b;
}
```

### Tipografía
- **Fuente principal:** `Inter` (Google Fonts) → moderna, legible, usada en WordPress premium.
- **Fallback:** `system-ui, -apple-system, Segoe UI, Roboto`.

### Componentes
- **Botones:** Redondeados (50px), sombra suave, hover con elevación.
- **Tarjetas:** Bordes redondeados (16px), sombra sutil, hover con elevación.
- **Títulos:** Subrayado con barra roja, mayúsculas, peso 700.

### Responsive
- **Móvil (<768px):** Menú y botones en columna, contador en una fila con scroll horizontal si es necesario.
- **Tablet/PC:** Diseño en cuadrícula (CSS Grid).

---

## 📱 **7. Requisitos Técnicos**

| Criterio | Especificación |
|--------|----------------|
| **Tecnología** | HTML5, CSS3, JavaScript (ES6+) |
| **Librerías externas** | Lightbox2, AOS (CDN) |
| **Formulario** | Formspree (sin backend) |
| **Hosting** | Cualquier hosting estático (DonWeb, Hostinger, Netlify, Vercel) |
| **Navegadores soportados** | Chrome, Firefox, Safari, Edge (últimas 2 versiones) |
| **Accesibilidad** | Etiquetas semánticas, `alt` en imágenes, contraste adecuado |
| **SEO básico** | `<title>`, `<meta name="description">`, Open Graph (opcional) |

---

## 🛠️ **8. Instrucciones de Mantenimiento**

### Para actualizar contenido:
1. **Texto:** Editar directamente en `index.html`.
2. **Imágenes:** 
   - Copiar nuevas fotos a `/images/eventos/` o `/images/autos/`.
   - Agregar un nuevo bloque `<a>` en la galería (ver comentario en código).
3. **Evento futuro:** Cambiar la fecha en `js/main.js` (línea del contador).
4. **Formulario:** Actualizar el endpoint de Formspree en el atributo `action`.

### Para personalizar diseño:
- Editar las variables CSS en `<style>`.
- Ajustar breakpoints en `@media`.

---

## ✅ **9. Entregables**

1. Archivo `index.html` (con todo integrado: HTML, CSS, JS).
2. Carpeta `images/` con estructura predefinida.
3. Archivo `README.md` con instrucciones claras de uso.
4. (Opcional) Script `generate-gallery.js` para usuarios técnicos.

---

## 📌 **10. Notas Finales**

- Este sitio **no requiere WordPress**, plugins, actualizaciones de seguridad ni mantenimiento técnico.
- Está diseñado para **durar años** con mínimas actualizaciones.
- La estética emula a un **tema premium de WordPress**, pero con la **simplicidad de un sitio estático**.
- Ideal para clubes, asociaciones y proyectos comunitarios con recursos limitados pero alto valor histórico.

---

> **“Más que un auto, un recuerdo. Más que un club, una familia.”**  
> — Club Fiat 600 Córdoba, 2000–2025

--- 
