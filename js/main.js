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

  document.addEventListener('DOMContentLoaded', function () {
    inicializarAOS();
    configurarLightbox();
    prepararFallbacksDeImagen();
  });
})();
