(function () {
  function inicializarAOS() {
    if (window.AOS) {
      AOS.init({
        duration: 800,
        once: true,
        offset: 140,
        easing: 'ease-in-out'
      });
    }
  }

  function configurarLightbox() {
    if (window.lightbox) {
      lightbox.option({
        albumLabel: 'Imagen %1 de %2',
        fadeDuration: 200,
        imageFadeDuration: 200,
        resizeDuration: 200,
        wrapAround: true
      });
    }
  }

  function prepararFallbacksDeImagen() {
    document.querySelectorAll('img[data-fallback]').forEach(function (imagen) {
      imagen.addEventListener('error', function handleError() {
        var fallback = imagen.dataset.fallback;
        if (!fallback || imagen.dataset.hasFallback) {
          return;
        }

        imagen.dataset.hasFallback = 'true';
        imagen.src = fallback;
        if (imagen.hasAttribute('srcset')) {
          imagen.removeAttribute('srcset');
        }
      }, { once: true });
    });
  }

  function configurarNavFlotante() {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    var nav = document.querySelector('.hero-nav');
    if (!nav) {
      return;
    }

    var sentinel = document.createElement('div');
    sentinel.className = 'hero-nav-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    nav.insertAdjacentElement('afterend', sentinel);

    var placeholder = document.createElement('div');
    placeholder.className = 'hero-nav-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    sentinel.insertAdjacentElement('afterend', placeholder);

    function actualizarAlturaPlaceholder() {
      placeholder.style.height = (nav.offsetHeight + 16) + 'px';
    }

    actualizarAlturaPlaceholder();
    window.addEventListener('resize', actualizarAlturaPlaceholder);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nav.classList.remove('hero-nav--floating');
          placeholder.classList.remove('hero-nav-placeholder--active');
        } else {
          nav.classList.add('hero-nav--floating');
          placeholder.classList.add('hero-nav-placeholder--active');
        }
      });
    }, {
      threshold: 0,
      rootMargin: '-8px 0px 0px 0px'
    });

    observer.observe(sentinel);
  }

  function resaltarSeccionActiva() {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.hero-nav a[href^="#"]'));
    if (navLinks.length === 0) {
      return;
    }

    var secciones = navLinks
      .map(function (link) {
        var id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (secciones.length === 0) {
      return;
    }

    function setActiveSection(idActivo) {
      navLinks.forEach(function (link) {
        var coincide = link.getAttribute('href').replace('#', '') === idActivo;
        link.classList.toggle('is-active', coincide);
        if (coincide) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    secciones.forEach(function (section) {
      observer.observe(section);
    });

    setActiveSection(secciones[0].id);
  }

  document.addEventListener('DOMContentLoaded', function () {
    inicializarAOS();
    configurarLightbox();
    prepararFallbacksDeImagen();
    configurarNavFlotante();
    resaltarSeccionActiva();
  });
})();
