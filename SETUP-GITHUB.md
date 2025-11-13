# Configuración de GitHub Pages - Club Fiat 600 Córdoba

## 🚀 Pasos para Configurar el Repositorio

### 1. Crear Repositorio en GitHub

1. **Ir a GitHub.com** y crear un nuevo repositorio:
   - **Nombre:** `clubfiat600cba.github.io`
   - **Descripción:** "Sitio web oficial del Club Fiat 600 Córdoba"
   - **Público**
   - **NO inicializar con README** (ya tenemos archivos locales)

### 2. Configurar el Repositorio Local

```bash
# Ya está configurado, solo ejecutar estos comandos:
git remote add origin https://github.com/clubfiat600cba/clubfiat600cba.github.io.git
git push -u origin main
```

### 3. Configurar GitHub Pages

1. **Ir a Settings → Pages** en el repositorio
2. **Source:** "GitHub Actions"
3. **Branch:** `gh-pages` (se creará automáticamente)

### 4. Configurar Dominio Personalizado

1. **En GitHub Pages:**
   - Settings → Pages → Custom domain
   - Ingresar: `clubfiat600cba.com`
   - Marcar "Enforce HTTPS"

2. **En Namecheap:**
   - Ir al panel del dominio `clubfiat600cba.com`
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

## 📁 Archivos Críticos Incluidos

- `.nojekyll` - Deshabilita procesamiento Jekyll
- `CNAME` - Dominio personalizado configurado
- `.github/workflows/deploy.yml` - Automatización de despliegue
- `scripts/validate-content.js` - Valida JSON antes del despliegue
- `scripts/generate-content-fallback.js` - Genera contenido embebido

## 🔄 Flujo de Actualización

Después de configurar, cada vez que hagas:
```bash
git add .
git commit -m "Mensaje descriptivo"
git push origin main
```

GitHub Actions automáticamente:
- ✅ Valida el JSON
- 📦 Genera el fallback
- 🚀 Despliega a GitHub Pages

## 🌐 URL del Sitio

- **GitHub Pages:** https://clubfiat600cba.github.io
- **Dominio Personalizado:** https://clubfiat600cba.com (después de configurar DNS)

## 📞 Soporte

- **Problemas de despliegue:** Revisar Actions en GitHub
- **Problemas de dominio:** Verificar configuración DNS en Namecheap
- **Problemas de contenido:** Usar `node scripts/validate-content.js`