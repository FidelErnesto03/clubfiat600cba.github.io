# Club Fiat 600 Córdoba · Sitio Web Dinámico

Portal oficial del club con contenido administrativo manejado por archivos planos. Todo el texto, la historia institucional, las galerías y la sección “Unite” se actualizan modificando JSON e imágenes, sin tocar HTML ni depender de un CMS.

---

## 📦 Estructura principal

```
clubf600cba/
├── content.json                 # Datos actualizables (historia_club, testimonios, Unite)
├── index.html                   # Página pública (usa carga dinámica)
├── js/
│   ├── main.js                  # Utilidades de interfaz (AOS, lightbox, fallbacks)
│   ├── dynamic-content.js       # Loader que inyecta datos del JSON
│   └── content-fallback.js      # Copia del JSON para uso offline (se genera)
├── images/
│   ├── club/                    # Fotos generales del club (eventos, salidas, autos)
│   └── placeholder.jpg          # Imagen por defecto
└── scripts/
    └── generate-content-fallback.js  # Genera el JS de respaldo
```

> Nota: La antigua variante generada por Python fue retirada. Todo el mantenimiento se realiza con el flujo dinámico descrito aquí.

---

## 🚀 Flujo de contenido en producción

1. `index.html` carga `js/dynamic-content.js`.
2. El script hace `fetch('content.json')` y pinta:
   - La historia del club (datos de `historia_club`).
   - Testimonios.
   - Textos/listas de **Unite al Club**.
3. Si `fetch` falla (por ejemplo al abrir el HTML con `file://`), intenta usar `window.CONTENT_FALLBACK` definido en `js/content-fallback.js`.
4. Si tampoco hay fallback, muestra mensajes explicativos en la página para ayudar a corregir la carga.

---

## 🔁 Cómo actualizar el contenido

### 1. Historia del Club

```json
"historia_club": {
  "etiqueta": "Comunidad Fitito",
  "titulo": "Historia del Club Fiat 600 Córdoba",
  "lead": "El Club Fiat 600 Córdoba nació en octubre de 2000...",
  "fundadores": {
    "titulo": "Fundadores · Octubre 2000",
    "items": [
      "Franco Toñosi",
      "Marcelo Perella",
      "Rodrigo Salas"
    ],
    "nota": "Impulsaron las primeras reuniones..."
  },
  "destacados": [
    {
      "icono": "🌄",
      "titulo": "Encuentros que crecieron",
      "texto": "Las primeras reuniones se hicieron...",
      "detalle": "Antes pasamos..."
    }
  ],
  "cierre": "En 2025 celebramos 25 años..."
}
```

> `destacados` se renderiza como tarjetas; cada entrada acepta `icono` opcional, `titulo`, `texto` y `detalle`. Los campos opcionales que queden vacíos se ocultan automáticamente.

### 2. Testimonios

```json
"testimonios": [
  {
    "autor": "Carolina Ferreyra · Socia Nº 087",
    "texto": "Conocí al club en 2003..."
  }
]
```

### 3. Unite al Club

```json
"unite": {
  "titulo": "Unite al Club",
  "descripcion": "...",
  "beneficios_exclusivos": {
    "titulo": "Beneficios exclusivos",
    "items": [
      "Acceso a catálogo de repuestos...",
      "Descuentos en encuentros..."
    ]
  },
  "comunidad_presente": {
    "titulo": "Comunidad presente",
    "items": [
      "Grupo privado de soporte...",
      "Clínicas de restauración..."
    ]
  },
  "formulario": {
    "action": "https://formspree.io/f/tu-endpoint",
    "method": "POST"
  }
}
```

---

## 🖼️ Galería del club

Las fotos de la sección “Galería del Club” se sirven directamente desde el HTML. Para actualizarla:

1. Agregá o reemplazá imágenes en `images/club/` manteniendo nombres descriptivos.
2. Ajustá los `<a>` dentro de la sección `#galeria` en `index.html` para enlazar las nuevas fotos. Cada entrada usa Lightbox (`data-lightbox="club"`).

> Sugerencia: organizá los eventos dentro de subcarpetas de `images/club/` (por ejemplo `images/club/eventos/2025-enero/`) y enlazá las fotos destacadas a mano según quieras mostrarlas.

---

## 🌐 Cómo ver el sitio localmente

| Escenario | Qué hacer |
|-----------|-----------|
| **Desarrollo recomendado** | Servir la carpeta con cualquier servidor estático (`python3 -m http.server 8080`, `npx serve`, etc.) y abrir `http://localhost:8080/`. |
| **Abrir con doble click (file://)** | Ejecutar `node scripts/generate-content-fallback.js` para actualizar `js/content-fallback.js`. El loader usará ese contenido embebido si no puede leer `content.json`. |

Siempre que cambies `content.json`, ejecutá:

```bash
node scripts/generate-content-fallback.js  # Solo si usás el fallback
```

---

## 🛠️ Scripts disponibles

- `node scripts/generate-content-fallback.js`  
  Copia `content.json` a `js/content-fallback.js`. Útil cuando el sitio se abre sin servidor.

---

## 🧪 Verificaciones y recomendaciones

- Validar `content.json` antes de subir cambios:

  ```bash
  python3 -m json.tool content.json
  ```

- Probar la galería después de agregar fotos nuevas (abrir las imágenes con Lightbox y verificar el comportamiento en mobile).

---

## ❓ Preguntas frecuentes

- **¿Por qué no veo los cambios del JSON?**  
  Serví la carpeta por HTTP o generá el fallback (`node scripts/generate-content-fallback.js`) antes de abrir `index.html`.

- **Las imágenes muestran el placeholder. ¿Qué hago?**  
  Revisá que las rutas en `index.html` sean correctas y que los archivos existan en `images/club/`. El script de fallbacks sustituye cualquier imagen rota por `images/placeholder.jpg`.

- **¿Puedo agregar más campos al JSON?**  
  Sí, pero actualizá `js/dynamic-content.js` para renderizar la información adicional.

---

**Club Fiat 600 Córdoba** · 2000–2025 · Más que un auto, una familia.  
Para más detalles técnicos consultar `README-DYNAMIC.md` y `especificacion.md`.
