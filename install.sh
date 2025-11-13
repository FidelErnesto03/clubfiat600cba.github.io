#!/bin/bash

# Script de preparación del sitio Club Fiat 600 Córdoba

echo "🚀 Instalando dependencias para el generador del sitio..."

# Verificar Node.js (requerido para los scripts utilitarios)
if command -v node &> /dev/null; then
    echo "✅ Node.js encontrado"
else
    echo "❌ Node.js no encontrado. Instala Node 18+ para usar los scripts del proyecto."
    exit 1
fi

# Crear estructura de carpetas si no existen
mkdir -p images/club
mkdir -p js
mkdir -p scripts

echo ""
echo "📁 Estructura de carpetas creada:"
echo "   images/club/"
echo "   js/"
echo "   scripts/"

echo ""
echo "✅ Instalación completada!"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Edita content.json con tus datos"
echo "   2. Agrega imágenes a images/club/"
echo "   3. Ejecuta:"
echo "      node scripts/generate-content-fallback.js"
echo "   4. Serví la carpeta (python3 -m http.server) o abrí index.html con fallback actualizado"

echo ""
echo "🔄 Cada vez que actualices content.json, corré: node scripts/generate-content-fallback.js"
