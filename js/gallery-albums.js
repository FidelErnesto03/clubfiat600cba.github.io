(function () {
  function GalleryAlbums() {
    this.container = document.querySelector('[data-gallery-albums]');
    this.emptyMessage = document.querySelector('[data-gallery-empty]');
    this.data = null;

    if (!this.container) {
      return;
    }

    this.init();
  }

  GalleryAlbums.prototype.init = async function () {
    await this.loadData();
    this.render();
  };

  GalleryAlbums.prototype.loadData = async function () {
    const url = new URL('content/gallery.json', window.location.href);
    url.searchParams.set('v', Date.now().toString());

    try {
      const response = await fetch(url.toString(), { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      this.data = await response.json();
    } catch (error) {
      if (window.GALLERY_FALLBACK) {
        this.data = window.GALLERY_FALLBACK;
      } else {
        console.warn('No se pudo cargar el manifiesto de la galería', error);
        this.data = null;
      }
    }
  };

  GalleryAlbums.prototype.render = function () {
    if (!this.data || !Array.isArray(this.data.albums) || this.data.albums.length === 0) {
      this.showEmpty(true);
      return;
    }

    this.container.innerHTML = '';
    this.data.albums.forEach((album, index) => {
      const card = this.createAlbumCard(album, index);
      this.container.appendChild(card);
    });
    this.showEmpty(false);

    document.dispatchEvent(new CustomEvent('gallery:refresh'));
  };

  GalleryAlbums.prototype.createAlbumCard = function (album, index) {
    const card = document.createElement('article');
    card.className = 'gallery-album';
    card.dataset.albumId = album.id;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'gallery-album__trigger';
    trigger.setAttribute('aria-expanded', 'false');

    const cover = document.createElement('div');
    cover.className = 'gallery-album__cover';
    const coverImg = document.createElement('img');
    coverImg.src = album.cover || 'images/placeholder.jpg';
    coverImg.alt = album.titulo + ' · Portada';
    coverImg.loading = 'lazy';
    cover.appendChild(coverImg);

    const info = document.createElement('div');
    info.className = 'gallery-album__info';

    const title = document.createElement('h4');
    title.textContent = album.titulo || 'Álbum sin título';
    info.appendChild(title);

    const description = document.createElement('p');
    description.textContent = album.descripcion || '';
    info.appendChild(description);

    const stats = document.createElement('div');
    stats.className = 'gallery-album__stats';

    const count = document.createElement('span');
    count.textContent = album.total + ' fotos';
    stats.appendChild(count);

    const pathInfo = document.createElement('span');
    pathInfo.textContent = album.directorio;
    stats.appendChild(pathInfo);

    info.appendChild(stats);

    trigger.appendChild(cover);
    trigger.appendChild(info);

    const grid = document.createElement('div');
    grid.className = 'gallery-album__grid';
    grid.setAttribute('aria-hidden', 'true');

    const hasImages = Array.isArray(album.imagenes) && album.imagenes.length > 0;

    if (hasImages) {
      trigger.addEventListener('click', () => {
        const isOpen = card.classList.toggle('gallery-album--open');
        trigger.setAttribute('aria-expanded', String(isOpen));
        grid.setAttribute('aria-hidden', String(!isOpen));
      });
    } else {
      trigger.disabled = true;
      trigger.classList.add('gallery-album__trigger--disabled');
    }

    (album.imagenes || []).forEach((image) => {
      const link = document.createElement('a');
      link.href = image.src;
      link.dataset.gallery = album.id;
      link.dataset.caption = image.caption || album.titulo || 'Imagen del club';
      link.setAttribute('aria-label', image.caption || image.filename);
      if (image.historia) {
        link.dataset.historia = image.historia;
        link.title = image.historia;
      } else {
        link.title = image.caption || album.titulo || 'Imagen del club';
      }
      if (image.lugar) {
        link.dataset.lugar = image.lugar;
      }
      if (image.fecha) {
        link.dataset.fecha = image.fecha;
      }

      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.caption || '';
      img.loading = 'lazy';

      link.appendChild(img);

      if (image.lugar || image.fecha) {
        const meta = document.createElement('div');
        meta.className = 'gallery-album__photo-meta';
        if (image.lugar) {
          const lugar = document.createElement('strong');
          lugar.textContent = image.lugar;
          meta.appendChild(lugar);
        }
        if (image.fecha) {
          const fecha = document.createElement('span');
          fecha.textContent = image.fecha;
          meta.appendChild(fecha);
        }
        link.appendChild(meta);
      }

      grid.appendChild(link);
    });

    if (!hasImages) {
      const empty = document.createElement('p');
      empty.className = 'gallery-album__empty';
      empty.textContent = 'Todavía no hay fotos en esta carpeta. Sumá imágenes al directorio para verlas aquí.';
      grid.appendChild(empty);
    }

    card.appendChild(trigger);
    card.appendChild(grid);

    return card;
  };

  GalleryAlbums.prototype.showEmpty = function (show) {
    if (this.emptyMessage) {
      this.emptyMessage.hidden = !show;
    }
    if (show) {
      this.container.innerHTML = '';
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    new GalleryAlbums();
  });
})();
