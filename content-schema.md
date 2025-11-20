# Esquema de Contenido Dinámico - Club Fiat 600 Córdoba

## Estructura del JSON

### `historia_club`
```json
{
  "etiqueta": "string (opcional)",
  "titulo": "string",
  "lead": "string (opcional)",
  "fundadores": {
    "titulo": "string",
    "items": ["string", "string", ...],
    "nota": "string (opcional)"
  },
  "destacados": [
    {
      "icono": "emoji (opcional)",
      "titulo": "string",
      "texto": "string",
      "detalle": "string (opcional)"
    }
  ],
  "cierre": "string"
}
```

### `fitito_cordobes`
```json
{
  "eyebrow": "string (opcional)",
  "titulo": "string",
  "intro": "string",
  "highlights": [
    {
      "titulo": "string",
      "texto": "string",
      "detalle": "string (opcional)"
    }
  ],
  "sidebar": {
    "titulo": "string (opcional)",
    "items": [
      {
        "titulo": "string",
        "descripcion": "string"
      }
    ]
  },
  "footer": "string (opcional)",
  "cta": {
    "label": "string",
    "href": "#ancla o URL absoluta"
  }
}
```

### `testimonios`
```json
[
  {
    "autor": "string",
    "texto": "string"
  }
]
```

### `unite`
```json
{
  "titulo": "string",
  "descripcion": "string",
  "beneficios_exclusivos": {
    "titulo": "string",
    "items": ["string", "string", ...]
  },
  "comunidad_presente": {
    "titulo": "string",
    "items": ["string", "string", ...]
  },
  "formulario": {
    "action": "URL",
    "method": "POST"
  }
}
```

## Campos Críticos para Futuros Ajustes

### 1. **Información de Contacto**
- **Faltante**: Redes sociales específicas
- **Faltante**: Teléfono de contacto
- **Faltante**: Dirección exacta de El Club del Chañar

### 2. **Eventos y Actividades**
- **Faltante**: Próximos eventos
- **Faltante**: Horarios de reuniones
- **Faltante**: Calendario anual

### 3. **Información del Club**
- **Faltante**: Cuota de socio
- **Faltante**: Requisitos de afiliación
- **Faltante**: Comisión directiva actual

## Propuesta de Expansión del JSON

```json
{
  "contacto": {
    "email": "contacto@clubfiat600cba.com",
    "telefono": "+54 9 XXX XXX XXXX",
    "direccion": "El Club del Chañar, Río Ceballos, Córdoba",
    "redes_sociales": {
      "facebook": "https://facebook.com/clubfiat600cba",
      "instagram": "https://instagram.com/clubfiat600cba",
      "whatsapp": "+549XXXXXXXXX"
    }
  },
  "club_info": {
    "cuota_anual": "$XXXX",
    "requisitos_afiliacion": ["string", "string", ...],
    "comision_directiva": [
      {
        "nombre": "string",
        "cargo": "string",
        "contacto": "string (opcional)"
      }
    ]
  },
  "eventos": {
    "proximos": [
      {
        "titulo": "string",
        "fecha": "YYYY-MM-DD",
        "lugar": "string",
        "descripcion": "string"
      }
    ],
    "reuniones_habitueles": {
      "dia": "string",
      "hora": "string",
      "lugar": "string"
    }
  }
}
```

## Recomendaciones para Mantenimiento

1. **Validación**: Usar `python3 -m json.tool content.json` antes de cada cambio
2. **Backup**: Mantener versiones anteriores del JSON
3. **Documentación**: Actualizar este archivo cuando se agreguen nuevos campos
4. **Testing**: Probar cambios en servidor local antes de subir a producción
