// Genera un fallback en JS a partir de content.json para usos sin servidor
// Ejecutar: node scripts/generate-content-fallback.js

const fs = require('fs');
const path = require('path');

const CONTENT_PATH = path.join(__dirname, '..', 'content.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'js', 'content-fallback.js');

function validateContent(data) {
  const requiredSections = ['historia_club', 'testimonios', 'unite'];
  for (const section of requiredSections) {
    if (!data[section]) {
      throw new Error(`Sección requerida faltante: ${section}`);
    }
  }
  
  if (!Array.isArray(data.testimonios)) {
    throw new Error('testimonios debe ser un array');
  }
  
  return true;
}

function main() {
  try {
    console.log('🔍 Validando content.json...');
    const raw = fs.readFileSync(CONTENT_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    
    validateContent(parsed);
    console.log('✅ content.json validado correctamente');

    const banner = [
      '// Archivo generado automáticamente. No editar a mano.',
      '// Ejecutá "node scripts/generate-content-fallback.js" después de modificar content.json.',
      '',
    ].join('\n');

    const serialized = JSON.stringify(parsed, null, 2);
    const output = `${banner}window.CONTENT_FALLBACK = ${serialized};\n`;

    fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
    console.log(`✅ Fallback generado en ${OUTPUT_PATH}`);
    console.log(`📊 Estadísticas:`);
    console.log(`   - Testimonios: ${parsed.testimonios.length}`);
    console.log(`   - Destacados del club: ${parsed.historia_club.destacados?.length || 0}`);
  } catch (error) {
    console.error('❌ Error generando el fallback:', error.message);
    if (error.message.includes('JSON')) {
      console.error('💡 Sugerencia: Usá "python3 -m json.tool content.json" para ver el error específico');
    }
    process.exit(1);
  }
}

main();
