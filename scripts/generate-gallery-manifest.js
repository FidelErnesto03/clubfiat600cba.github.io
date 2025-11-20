#!/usr/bin/env node
/**
 * Genera content/gallery.json y js/gallery-data.js
 * en base a los directorios definidos en gallery.config.json.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const configPath = path.join(rootDir, 'gallery.config.json');
const contentDir = path.join(rootDir, 'content');
const outputJsonPath = path.join(contentDir, 'gallery.json');
const outputJsPath = path.join(rootDir, 'js', 'gallery-data.js');

function readConfig() {
  if (!fs.existsSync(configPath)) {
    throw new Error(`No se encontró ${configPath}`);
  }
  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw);
}

function isImageFile(file) {
  return /\.(jpe?g|png|webp|gif)$/i.test(file);
}

function humanizeFileName(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildAlbumData(albumConfig) {
  const albumPath = path.join(rootDir, albumConfig.directorio);
  let images = [];
  const albumMetadata = albumConfig.metadata || {};

  if (fs.existsSync(albumPath)) {
    images = fs
      .readdirSync(albumPath)
      .filter((file) => isImageFile(file))
      .sort()
      .map((file) => {
        const relativeSrc = path.posix.join(albumConfig.directorio.replace(/\\/g, '/'), file);
        const captionBase = albumConfig.caption_prefix || albumConfig.titulo || 'Álbum';
        const meta = albumMetadata[file] || {};

        return {
          src: relativeSrc,
          caption: `${captionBase} · ${humanizeFileName(file)}`,
          filename: file,
          historia: meta.historia || '',
          lugar: meta.lugar || '',
          fecha: meta.fecha || ''
        };
      });
  }

  return {
    id: albumConfig.id,
    titulo: albumConfig.titulo,
    descripcion: albumConfig.descripcion,
    directorio: albumConfig.directorio,
    total: images.length,
    cover: images[0]?.src || null,
    imagenes: images
  };
}

function writeJson(manifest) {
  fs.mkdirSync(contentDir, { recursive: true });
  fs.writeFileSync(outputJsonPath, JSON.stringify(manifest, null, 2));
}

function writeFallback(manifest) {
  const header = '// Archivo generado automáticamente. No editar a mano.\n';
  const body = `window.GALLERY_FALLBACK = ${JSON.stringify(manifest, null, 2)};\n`;
  fs.writeFileSync(outputJsPath, header + body);
}

function main() {
  const config = readConfig();
  const albums = config.map(buildAlbumData);

  const manifest = {
    generado: new Date().toISOString(),
    albums
  };

  writeJson(manifest);
  writeFallback(manifest);

  console.log('✅ Manifiesto de galería generado');
  albums.forEach((album) => {
    console.log(`  • ${album.titulo}: ${album.total} fotos (${album.directorio})`);
  });
}

main();
