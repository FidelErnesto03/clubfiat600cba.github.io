# Guía de Despliegue - Club Fiat 600 Córdoba

## 🚀 Despliegue en GitHub Pages

### 1. Preparación del Repositorio

1. **Crear repositorio en GitHub:**
   - Nombre: `clubfiat600cba`
   - Descripción: "Sitio web oficial del Club Fiat 600 Córdoba"
   - Público

2. **Configurar GitHub Pages:**
   - Ir a Settings → Pages
   - Source: "GitHub Actions"
   - Branch: `gh-pages` (se creará automáticamente)

### 2. Configuración del Dominio Personalizado

1. **En Namecheap:**
   - Ir al panel de control del dominio `clubfiat600cba.com`
   - Configurar DNS:
     ```
     Tipo: CNAME
     Host: www
     Valor: clubfiat600cba.github.io
     TTL: Automatic
     
     Tipo: A
     Host: @
     Valor: 185.199.108.153
     Valor: 185.199.109.153
     Valor: 185.199.110.153
     Valor: 185.199.111.153
     TTL: Automatic
     ```

2. **En GitHub:**
   - Settings → Pages → Custom domain
   - Ingresar: `clubfiat600cba.com`
   - Marcar "Enforce HTTPS"

### 3. Flujo de Actualización

1. **Modificar contenido:**
   ```bash
   # Editar content.json
   nano content.json
   
   # Validar cambios
   node scripts/validate-content.js
   python3 -m json.tool content.json
   
   # Generar fallback
   node scripts/generate-content-fallback.js
   ```

2. **Subir cambios:**
   ```bash
   git add .
   git commit -m "Actualizar contenido del club"
   git push origin main
   ```

3. **GitHub Actions se ejecuta automáticamente:**
   - Valida el JSON
   - Genera el fallback
   - Despliega a GitHub Pages

## 🔧 Configuración Local para Desarrollo

### Servidor Local
```bash
# Opción 1: Python
python3 -m http.server 8080

# Opción 2: Node.js (si está instalado)
npx serve .

# Opción 3: PHP
php -S localhost:8080
```

### Validación de Cambios
```bash
# Validar JSON
node scripts/validate-content.js

# Formatear y validar JSON
python3 -m json.tool content.json

# Generar fallback para modo local
node scripts/generate-content-fallback.js
```

## 📋 Checklist de Despliegue

- [ ] `content.json` validado correctamente
- [ ] `js/content-fallback.js` actualizado
- [ ] Dominio configurado en Namecheap
- [ ] Dominio configurado en GitHub Pages
- [ ] HTTPS habilitado
- [ ] Archivo `.nojekyll` presente
- [ ] Archivo `CNAME` configurado

## 🛠️ Estructura de Archivos Críticos

```
clubf600cba/
├── .nojekyll                 # Deshabilita Jekyll
├── CNAME                     # Dominio personalizado
├── .github/workflows/
│   └── deploy.yml            # Automatización de despliegue
├── scripts/
│   ├── generate-content-fallback.js
│   └── validate-content.js
└── js/
    └── content-fallback.js   # Contenido embebido
```

## 📞 Soporte

- **Problemas de despliegue:** Revisar Actions en GitHub
- **Problemas de dominio:** Verificar configuración DNS
- **Problemas de contenido:** Validar JSON con scripts

## 🔄 Actualizaciones Futuras

Para agregar nuevas secciones dinámicas:

1. Expandir `content.json` con nuevos campos
2. Actualizar `js/dynamic-content.js` para renderizar los nuevos datos
3. Actualizar `scripts/validate-content.js` para validar la nueva estructura
4. Probar localmente antes de desplegar