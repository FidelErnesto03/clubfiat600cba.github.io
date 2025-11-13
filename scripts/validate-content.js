#!/usr/bin/env node

/**
 * Script de validación para content.json
 * Verifica que el JSON esté bien formado y tenga la estructura esperada
 */

const fs = require('fs');
const path = require('path');

const CONTENT_FILE = path.join(__dirname, '..', 'content.json');

function validateContent() {
    try {
        console.log('🔍 Validando content.json...');
        
        // Verificar que el archivo existe
        if (!fs.existsSync(CONTENT_FILE)) {
            throw new Error('❌ content.json no existe');
        }

        // Leer y parsear el JSON
        const content = fs.readFileSync(CONTENT_FILE, 'utf8');
        const data = JSON.parse(content);

        // Validar estructura básica
        const requiredSections = ['historia_club', 'testimonios', 'unite'];
        for (const section of requiredSections) {
            if (!data[section]) {
                throw new Error(`❌ Sección requerida faltante: ${section}`);
            }
        }

        // Validar historia_club
        if (!data.historia_club.titulo) {
            console.warn('⚠️  historia_club.titulo está vacío');
        }

        // Validar testimonios
        if (!Array.isArray(data.testimonios)) {
            throw new Error('❌ testimonios debe ser un array');
        }

        // Validar unite
        if (!data.unite.titulo) {
            console.warn('⚠️  unite.titulo está vacío');
        }

        console.log('✅ content.json es válido');
        console.log(`📊 Estadísticas:`);
        console.log(`   - Testimonios: ${data.testimonios.length}`);
        console.log(`   - Destacados del club: ${data.historia_club.destacados?.length || 0}`);
        
        return true;
        
    } catch (error) {
        console.error(error.message);
        if (error.message.includes('JSON')) {
            console.error('💡 Sugerencia: Usá "python3 -m json.tool content.json" para ver el error específico');
        }
        return false;
    }
}

// Ejecutar validación si se llama directamente
if (require.main === module) {
    const isValid = validateContent();
    process.exit(isValid ? 0 : 1);
}

module.exports = validateContent;