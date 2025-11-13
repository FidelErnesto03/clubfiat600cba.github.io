# Sistema Dinámico del Sitio Web

Guía rápida para mantener el contenido actualizado sin editar HTML.

---

## 📋 Descripción general

- `js/dynamic-content.js` carga `content.json`, inyecta los textos dinámicos (historia del club, testimonios, Unite) y refresca las animaciones de AOS.
- `js/main.js` inicializa AOS, configura Lightbox y gestiona los fallbacks de imágenes.
- `js/content-fallback.js` contiene una copia embebida de `content.json`. Se regenera con `node scripts/generate-content-fallback.js` y permite que el sitio funcione cuando se abre con `file://`.

---

## 🧩 Campos editables (`content.json`)

### `historia_club`

```json
"historia_club": {
  "etiqueta": "Comunidad Fitito",
  "titulo": "Historia del Club Fiat 600 Córdoba",
  "lead": "El Club Fiat 600 Córdoba nació en octubre de 2000...",
  "fundadores": {
    "titulo": "Fundadores · Octubre 2000",
    "items": ["Franco Toñosi", "Marcelo Perella", "Rodrigo Salas"],
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

- `etiqueta` y `lead` son opcionales; si faltan se ocultan.
- `fundadores.items` acepta cualquier cantidad de nombres.
- Cada elemento de `destacados` se renderiza como tarjeta; `icono` y `detalle` son opcionales.

### `testimonios`

```json
"testimonios": [
  {
    "autor": "Carolina Ferreyra · Socia Nº 087",
    "texto": "Conocí al club en 2003..."
  }
]
```

- Se renderizan en carrusel horizontal con scroll. Si el array está vacío aparece un mensaje de placeholder.

### `unite`

```json
"unite": {
  "titulo": "Unite al Club",
  "descripcion": "Formar parte del Club...",
  "beneficios_exclusivos": {
    "titulo": "Beneficios exclusivos",
    "items": [
      "Acceso a catálogo de repuestos, manuales y talleres aliados.",
      "Descuentos en encuentros nacionales y regionales."
    ]
  },
  "comunidad_presente": {
    "titulo": "Comunidad presente",
    "items": [
      "Grupo privado de soporte técnico y mecánicos certificados.",
      "Clínicas de restauración y charlas históricas."
    ]
  },
  "formulario": {
    "action": "https://formspree.io/f/tu-endpoint",
    "method": "POST"
  }
}
```

- Cada bloque de beneficios se renderiza a partir de `items`. Si el array está vacío el bloque se oculta.
- `formulario` permite actualizar action/method sin tocar el HTML.

---

## 🔄 Fallback y modo sin servidor

Si abrís el sitio con doble clic (`file://`), `fetch('content.json')` falla. En ese caso:

1. Ejecutá `node scripts/generate-content-fallback.js`.
2. Abrí `index.html`; el loader utilizará `window.CONTENT_FALLBACK` para inyectar los datos.

Repetí el mismo comando siempre que modifiques `content.json`.

---

## 🧼 Buenas prácticas

- Validá el JSON antes de subir cambios:

  ```bash
  python3 -m json.tool content.json
  ```

- Usá comillas dobles y evita caracteres especiales que puedan romper la codificación UTF-8.
- Mantené las imágenes optimizadas (≤ 2000 px de ancho) y con nombres descriptivos.
