// Script para cargar contenido dinámico desde content.json y galerías

class DynamicContentLoader {
    constructor() {
        this.contentData = null;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Inicializando contenido dinámico...');
            
            // Cargar content.json
            await this.loadContentJSON();
            console.log('✅ content.json cargado');
            
            // Actualizar contenido dinámico
            this.updateDynamicContent();
            console.log('✅ Contenido dinámico actualizado');
            
        } catch (error) {
            console.error('❌ Error inicializando contenido dinámico:', error);
            this.renderErrorState();
        }
    }

    async loadContentJSON() {
        try {
            const cacheBuster = Date.now().toString();
            const url = new URL('content.json', window.location.href);
            url.searchParams.set('v', cacheBuster);

            const response = await fetch(url.toString(), {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0'
                }
            });
            if (!response.ok) {
                throw new Error(`No se pudo cargar content.json (HTTP ${response.status})`);
            }
            this.contentData = await response.json();
        } catch (error) {
            console.warn('⚠️  fetch de content.json falló, usando fallback si está disponible.', error);
            if (window.CONTENT_FALLBACK) {
                console.log('📦 Usando contenido embebido de fallback.');
                this.contentData = window.CONTENT_FALLBACK;
                return;
            }
            throw error;
        }
    }

    updateDynamicContent() {
        if (!this.contentData) return;

        console.log('🔄 Actualizando contenido dinámico...');

        // Actualizar historia del club
        this.updateClubHistory();

        // Actualizar sección Fitito cordobés
        this.updateFititoCordobes();

        // Actualizar sección "Unite al Club"
        this.updateUniteSection();
        
        // Actualizar testimonios
        this.updateTestimonials();

        // Actualizar información de contacto (si existe)
        this.updateContactInfo();

        this.refreshAOS();
        
        console.log('✅ Contenido dinámico actualizado correctamente');
    }

    updateFititoCordobes() {
        const section = document.getElementById('fitito-cordobes');
        if (!section) {
            return;
        }

        const data = this.contentData.fitito_cordobes;
        if (!data) {
            section.style.display = 'none';
            return;
        }

        const setText = (selector, value) => {
            const el = section.querySelector(selector);
            if (!el) {
                return;
            }
            if (value) {
                el.textContent = value;
                el.hidden = false;
            } else {
                el.hidden = true;
            }
        };

        setText('[data-fitito-eyebrow]', data.eyebrow);
        setText('[data-fitito-title]', data.titulo);
        setText('[data-fitito-intro]', data.intro);
        setText('[data-fitito-footer]', data.footer);

        const cta = section.querySelector('[data-fitito-cta]');
        if (cta) {
            if (data.cta && data.cta.label) {
                cta.textContent = data.cta.label;
            } else {
                cta.textContent = 'Sumate al club';
            }
            cta.href = (data.cta && data.cta.href) || '#unite';
        }

        const highlightsWrapper = section.querySelector('[data-fitito-highlights]');
        if (highlightsWrapper) {
            highlightsWrapper.innerHTML = '';
            if (Array.isArray(data.highlights) && data.highlights.length > 0) {
                data.highlights.forEach((highlight, index) => {
                    const article = document.createElement('article');
                    article.className = 'fitito-cordobes__highlight';
                    article.setAttribute('data-aos', 'fade-up');
                    article.setAttribute('data-aos-delay', String(120 + index * 80));

                    if (highlight.titulo) {
                        const h3 = document.createElement('h3');
                        h3.textContent = highlight.titulo;
                        article.appendChild(h3);
                    }

                    if (highlight.texto) {
                        const p = document.createElement('p');
                        p.textContent = highlight.texto;
                        article.appendChild(p);
                    }

                    if (highlight.detalle) {
                        const small = document.createElement('small');
                        small.textContent = highlight.detalle;
                        article.appendChild(small);
                    }

                    highlightsWrapper.appendChild(article);
                });
            }
        }

        const sidebar = section.querySelector('.fitito-cordobes__sidebar');
        const sidebarTitle = section.querySelector('[data-fitito-sidebar-title]');
        const factsList = section.querySelector('[data-fitito-facts]');
        const sidebarData = data.sidebar || {};

        if (sidebar && factsList) {
            if (Array.isArray(sidebarData.items) && sidebarData.items.length > 0) {
                sidebar.style.display = '';
                if (sidebarTitle) {
                    sidebarTitle.textContent = sidebarData.titulo || 'Postales cordobesas';
                }

                factsList.innerHTML = '';
                sidebarData.items.forEach((item) => {
                    const li = document.createElement('li');
                    if (item.titulo) {
                        const strong = document.createElement('strong');
                        strong.textContent = item.titulo;
                        li.appendChild(strong);
                    }
                    if (item.descripcion) {
                        const span = document.createElement('span');
                        span.textContent = item.descripcion;
                        li.appendChild(span);
                    }
                    factsList.appendChild(li);
                });
            } else {
                sidebar.style.display = 'none';
            }
        }
    }

    updateClubHistory() {
        const section = document.getElementById('historia-club');
        const data = this.contentData.historia_club;

        if (!section || !data) return;

        const tag = section.querySelector('.club-story__tag');
        if (tag) {
            if (data.etiqueta) {
                tag.textContent = data.etiqueta;
                tag.style.display = 'inline-block';
            } else {
                tag.style.display = 'none';
            }
        }

        const title = section.querySelector('h2');
        if (title && data.titulo) {
            title.textContent = data.titulo;
        }

        const lead = section.querySelector('.club-story__lead');
        if (lead) {
            if (data.lead) {
                lead.textContent = data.lead;
                lead.style.display = '';
            } else {
                lead.style.display = 'none';
            }
        }

        const foundersBlock = section.querySelector('.club-story__founders');
        if (foundersBlock) {
            const foundersData = data.fundadores;
            if (foundersData) {
                foundersBlock.style.display = '';

                const heading = foundersBlock.querySelector('h3');
                if (heading && foundersData.titulo) {
                    heading.textContent = foundersData.titulo;
                }

                const list = foundersBlock.querySelector('.club-story__founders-list');
                if (list) {
                    list.innerHTML = '';
                    (foundersData.items || []).forEach(nombre => {
                        const li = document.createElement('li');
                        li.textContent = nombre;
                        list.appendChild(li);
                    });
                    if (!foundersData.items || foundersData.items.length === 0) {
                        foundersBlock.style.display = 'none';
                    }
                }

                const note = foundersBlock.querySelector('.club-story__founders-note');
                if (note) {
                    if (foundersData.nota) {
                        note.textContent = foundersData.nota;
                        note.style.display = '';
                    } else {
                        note.style.display = 'none';
                    }
                }
            } else {
                foundersBlock.style.display = 'none';
            }
        }

        const highlightsWrapper = section.querySelector('.club-story__highlights');
        if (highlightsWrapper) {
            highlightsWrapper.innerHTML = '';

            if (Array.isArray(data.destacados) && data.destacados.length > 0) {
                highlightsWrapper.style.display = '';
                data.destacados.forEach((destacado, index) => {
                    const article = document.createElement('article');
                    article.className = 'club-story__highlight';
                    article.setAttribute('data-aos', 'fade-up');
                    article.setAttribute('data-aos-delay', String(140 + index * 80));

                    if (destacado.icono) {
                        const icon = document.createElement('span');
                        icon.className = 'club-story__icon';
                        icon.setAttribute('aria-hidden', 'true');
                        icon.textContent = destacado.icono;
                        article.appendChild(icon);
                    }

                    if (destacado.titulo) {
                        const heading = document.createElement('h3');
                        heading.textContent = destacado.titulo;
                        article.appendChild(heading);
                    }

                    if (destacado.texto) {
                        const paragraph = document.createElement('p');
                        paragraph.textContent = destacado.texto;
                        article.appendChild(paragraph);
                    }

                    if (destacado.detalle) {
                        const footnote = document.createElement('small');
                        footnote.textContent = destacado.detalle;
                        article.appendChild(footnote);
                    }

                    highlightsWrapper.appendChild(article);
                });
            } else {
                highlightsWrapper.style.display = 'none';
            }
        }

        const closing = section.querySelector('.club-story__closing p');
        if (closing) {
            if (data.cierre) {
                closing.textContent = data.cierre;
                closing.parentElement.style.display = '';
            } else {
                closing.parentElement.style.display = 'none';
            }
        }
    }

    updateUniteSection() {
        const uniteSection = document.getElementById('unite');
        if (!uniteSection || !this.contentData.unite) return;

        const unite = this.contentData.unite;
        
        // Actualizar título y descripción
        const title = uniteSection.querySelector('h2');
        const description = uniteSection.querySelector('p');
        if (title && unite.titulo) title.textContent = unite.titulo;
        if (description && unite.descripcion) description.textContent = unite.descripcion;
        
        // Actualizar beneficios
        const beneficios = uniteSection.querySelectorAll('.beneficio[data-content-key]');
        beneficios.forEach(beneficio => {
            const key = beneficio.dataset.contentKey;
            if (!key || !unite[key]) return;

            const config = unite[key];
            const heading = beneficio.querySelector('h3');
            if (heading && config.titulo) heading.textContent = config.titulo;

            const list = beneficio.querySelector('ul');
            if (list) {
                list.innerHTML = '';
                (config.items || []).forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    list.appendChild(li);
                });
            }
        });
        
        // Actualizar formulario
        const form = uniteSection.querySelector('form');
        if (form && unite.formulario) {
            if (unite.formulario.action) form.action = unite.formulario.action;
            if (unite.formulario.method) form.method = unite.formulario.method;
        }
    }

    updateTestimonials() {
        const testimoniosContainer = document.querySelector('.testimonios');
        if (!testimoniosContainer || !this.contentData.testimonios) return;

        if (!Array.isArray(this.contentData.testimonios) || this.contentData.testimonios.length === 0) {
            testimoniosContainer.innerHTML = `
                <p class="mensaje-vacio">Pronto sumaremos testimonios de nuestros socios.</p>
            `;
            return;
        }

        testimoniosContainer.innerHTML = this.contentData.testimonios
            .map((testimonio, index) => `
                <article class="testimonio" data-aos="fade-up" data-aos-delay="${(index % 3) * 100 + 100}">
                    <p>${testimonio.texto}</p>
                    <h4>${testimonio.autor}</h4>
                </article>
            `).join('');
    }
    updateContactInfo() {
        // Método para futura expansión - actualizar información de contacto dinámica
        if (this.contentData.contacto) {
            console.log('📞 Información de contacto disponible para actualización');
            // Aquí se puede implementar la actualización de redes sociales, teléfono, etc.
        }
    }

    refreshAOS() {
        if (window.AOS && typeof window.AOS.refresh === 'function') {
            window.AOS.refresh();
        }
    }

    renderErrorState() {
        const testimoniosContainer = document.querySelector('.testimonios');
        if (testimoniosContainer && !testimoniosContainer.innerHTML.trim()) {
            const mensaje = window.location.protocol === 'file:'
                ? 'Los testimonios se cargan desde content.json. Abrí un servidor local o regenerá el fallback con "node scripts/generate-content-fallback.js".'
                : 'No pudimos cargar los testimonios en este momento.';

            testimoniosContainer.innerHTML = `<p class="mensaje-vacio">${mensaje}</p>`;
        }

        const uniteSection = document.getElementById('unite');
        if (uniteSection) {
            const fallback = uniteSection.querySelector('[data-error]');
            if (!fallback) {
                const aviso = document.createElement('p');
                aviso.className = 'mensaje-vacio';
                aviso.dataset.error = 'true';
                aviso.textContent = window.location.protocol === 'file:'
                    ? 'La sección Unite se completa desde content.json. Serví la carpeta con un servidor local o regenerá el fallback para verla.'
                    : 'La sección no pudo cargarse dinámicamente. Intentá nuevamente más tarde.';
                uniteSection.appendChild(aviso);
            }
        }
    }
}

// Inicializar cuando el DOM esté listo
function initializeDynamicContent() {
    // Esperar un poco más para asegurar que todo esté cargado
    setTimeout(() => {
        console.log('🏁 Iniciando carga dinámica...');
        new DynamicContentLoader();
    }, 100);
}

// Diferentes formas de inicializar para mayor compatibilidad
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDynamicContent);
} else {
    initializeDynamicContent();
}
