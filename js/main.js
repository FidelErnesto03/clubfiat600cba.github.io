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
    nav.insertAdjacentElement('beforebegin', sentinel);

    var placeholder = document.createElement('div');
    placeholder.className = 'hero-nav-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    nav.insertAdjacentElement('afterend', placeholder);

    function actualizarAlturaPlaceholder() {
      placeholder.style.height = (nav.offsetHeight + 24) + 'px';
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
      rootMargin: '-160px 0px 0px 0px'
    });

    observer.observe(sentinel);
  }

  function resaltarSeccionActiva() {
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

    var ultimaSeccionActiva = null;

    function setActiveSection(idActivo) {
      if (!idActivo || idActivo === ultimaSeccionActiva) {
        return;
      }
      ultimaSeccionActiva = idActivo;
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

    function calcularSeccionActiva() {
      var nav = document.querySelector('.hero-nav');
      var navHeight = nav ? nav.getBoundingClientRect().height : 0;
      var offsetReferencia = window.scrollY + navHeight + 32;
      var activa = secciones[0].id;

      // Si estamos muy cerca del top, activar "inicio"
      if (window.scrollY < 50) {
        activa = 'inicio';
      } else {
        for (var i = 0; i < secciones.length; i++) {
          var section = secciones[i];
          if (!section) {
            continue;
          }
          var seccionTop = section.offsetTop;
          // Hacer más sensible la activación de "historia"
          var margenActivacion = i === 0 ? 20 : 4; // Más margen para la primera sección
          if (offsetReferencia >= seccionTop - margenActivacion) {
            activa = section.id;
          } else {
            break;
          }
        }
      }

      setActiveSection(activa);
    }

    // Función mejorada para scroll programático
    function calcularSeccionActivaProgramatica(scrollTarget) {
      var nav = document.querySelector('.hero-nav');
      var navHeight = nav ? nav.getBoundingClientRect().height : 0;
      var offsetReferencia = (scrollTarget || window.scrollY) + navHeight + 32;
      var activa = secciones[0].id;

      // Si el scroll es al inicio (0), activar la sección "inicio"
      if (scrollTarget === 0 || scrollTarget < 100) {
        activa = 'inicio';
      } else {
        for (var i = 0; i < secciones.length; i++) {
          var section = secciones[i];
          if (!section) {
            continue;
          }
          var seccionTop = section.offsetTop;
          // Hacer más sensible la activación de "historia"
          var margenActivacion = i === 0 ? 20 : 4; // Más margen para la primera sección
          if (offsetReferencia >= seccionTop - margenActivacion) {
            activa = section.id;
          } else {
            break;
          }
        }
      }

      setActiveSection(activa);
    }

    window.addEventListener('scroll', calcularSeccionActiva, { passive: true });
    window.addEventListener('resize', calcularSeccionActiva);
    calcularSeccionActiva();
  }

  function habilitarScrollSuaveEnNav() {
    var enlaces = Array.prototype.slice.call(document.querySelectorAll('.hero-nav a[href^="#"]'));
    if (enlaces.length === 0) {
      return;
    }

    enlaces.forEach(function (enlace) {
      enlace.addEventListener('click', function (event) {
        var destinoId = enlace.getAttribute('href');
        if (!destinoId || destinoId === '#') {
          return;
        }

        var destino = document.querySelector(destinoId);
        if (!destino) {
          return;
        }

        event.preventDefault();

        // Calcular offset preciso
        var nav = document.querySelector('.hero-nav');
        var navHeight = nav ? nav.getBoundingClientRect().height : 0;

        // Manejo especial para la sección "Inicio" (header)
        var esInicio = destinoId === '#inicio';
        var scrollMargin = esInicio ? 0 : parseInt(getComputedStyle(destino).scrollMarginTop) || 96;
        var destinoTop = destino.getBoundingClientRect().top + window.pageYOffset;

        // Usar el mayor entre navHeight y scrollMargin
        var offsetCalculado = Math.max(navHeight, scrollMargin);
        var offset = esInicio ? 0 : Math.max(destinoTop - offsetCalculado - 16, 0);

        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });

        // Calcular inmediatamente la sección activa usando el offset objetivo
        if (typeof calcularSeccionActivaProgramatica === 'function') {
          calcularSeccionActivaProgramatica(offset);
        }

        // Recalcular después del scroll para sincronización final
        setTimeout(function() {
          if (typeof calcularSeccionActiva === 'function') {
            calcularSeccionActiva();
          }
        }, 600); // Tiempo aproximado del scroll suave

        if (window.history && typeof window.history.pushState === 'function') {
          window.history.pushState(null, '', destinoId);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    inicializarAOS();
    prepararFallbacksDeImagen();
    configurarNavFlotante();
    resaltarSeccionActiva();
    habilitarScrollSuaveEnNav();
  });
})();
