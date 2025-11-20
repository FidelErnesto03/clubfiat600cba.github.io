(function () {
  function GalleryViewer() {
    this.viewer = document.getElementById('gallery-viewer');
    if (!this.viewer) {
      return;
    }

    this.imageEl = this.viewer.querySelector('.gallery-viewer__image');
    this.captionEl = this.viewer.querySelector('.gallery-viewer__caption');
    this.counterEl = this.viewer.querySelector('.gallery-viewer__counter');
    this.spinnerEl = this.viewer.querySelector('.gallery-viewer__spinner');
    this.closeButtons = Array.prototype.slice.call(this.viewer.querySelectorAll('[data-gallery-close]'));
    this.prevButton = this.viewer.querySelector('[data-gallery-prev]');
    this.nextButton = this.viewer.querySelector('[data-gallery-next]');

    this.groups = {};
    this.boundTriggers = new WeakSet();
    this.activeGroup = null;
    this.activeIndex = 0;
    this.isOpen = false;
    this.storyEl = this.viewer.querySelector('.gallery-viewer__story');
    this.detailEls = {
      lugar: this.viewer.querySelector('[data-detail="lugar"]'),
      fecha: this.viewer.querySelector('[data-detail="fecha"]')
    };

    this.init();
  }

  GalleryViewer.prototype.init = function () {
    this.bindControls();
    this.refresh();
    document.addEventListener('gallery:refresh', this.refresh.bind(this));
  };

  GalleryViewer.prototype.refresh = function () {
    this.groups = {};
    var triggers = document.querySelectorAll('[data-gallery]');

    triggers.forEach(function (trigger) {
      var group = trigger.dataset.gallery || 'default';
      if (!this.groups[group]) {
        this.groups[group] = [];
      }

      var triggerImg = trigger.querySelector('img');
      var item = {
        src: trigger.getAttribute('href'),
        caption: trigger.dataset.caption || (triggerImg ? triggerImg.alt : '') || '',
        historia: trigger.dataset.historia || '',
        lugar: trigger.dataset.lugar || '',
        fecha: trigger.dataset.fecha || '',
        trigger: trigger
      };

      var index = this.groups[group].length;
      trigger.dataset.galleryIndex = index;
      trigger.dataset.galleryGroup = group;
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');

      this.groups[group].push(item);

      if (!this.boundTriggers.has(trigger)) {
        this.boundTriggers.add(trigger);
        trigger.addEventListener('click', this.handleTriggerClick.bind(this));
        trigger.addEventListener('keydown', this.handleTriggerKeydown.bind(this));
      }
    }.bind(this));
  };

  GalleryViewer.prototype.handleTriggerClick = function (event) {
    event.preventDefault();
    this.openFromTrigger(event.currentTarget);
  };

  GalleryViewer.prototype.handleTriggerKeydown = function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openFromTrigger(event.currentTarget);
    }
  };

  GalleryViewer.prototype.openFromTrigger = function (trigger) {
    var groupId = trigger.dataset.galleryGroup;
    var index = Number(trigger.dataset.galleryIndex) || 0;
    this.open(groupId, index);
  };

  GalleryViewer.prototype.bindControls = function () {
    var self = this;
    this.closeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        self.close();
      });
    });

    if (this.prevButton) {
      this.prevButton.addEventListener('click', function () {
        self.navigate(-1);
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', function () {
        self.navigate(1);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (!self.isOpen) {
        return;
      }

      if (event.key === 'Escape') {
        self.close();
      } else if (event.key === 'ArrowLeft') {
        self.navigate(-1);
      } else if (event.key === 'ArrowRight') {
        self.navigate(1);
      }
    });
  };

  GalleryViewer.prototype.open = function (group, index) {
    if (!group || !this.groups[group] || !this.groups[group][index]) {
      return;
    }

    this.activeGroup = group;
    this.activeIndex = index;
    this.viewer.dataset.active = 'true';
    this.viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');
    this.isOpen = true;

    this.renderCurrent();
  };

  GalleryViewer.prototype.close = function () {
    if (!this.isOpen) {
      return;
    }
    this.viewer.dataset.active = 'false';
    this.viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('viewer-open');
    this.isOpen = false;
  };

  GalleryViewer.prototype.navigate = function (direction) {
    if (!this.isOpen || !this.groups[this.activeGroup]) {
      return;
    }

    var items = this.groups[this.activeGroup];
    var nextIndex = this.activeIndex + direction;

    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    this.activeIndex = nextIndex;
    this.renderCurrent();
  };

  GalleryViewer.prototype.renderCurrent = function () {
    var groupItems = this.groups[this.activeGroup];
    if (!groupItems || !groupItems[this.activeIndex]) {
      return;
    }

    var item = groupItems[this.activeIndex];
    this.setLoadingState(true);
    this.updateNavigation(groupItems.length);

    var tempImage = new Image();
    var self = this;
    tempImage.onload = function () {
      self.imageEl.src = item.src;
      self.imageEl.alt = item.caption || 'Imagen del club';
      self.imageEl.dataset.loaded = 'true';
      self.setLoadingState(false);
    };
    tempImage.onerror = function () {
      self.setLoadingState(false);
      self.captionEl.textContent = 'No se pudo cargar la imagen.';
    };

    this.imageEl.dataset.loaded = 'false';
    tempImage.src = item.src;
    this.captionEl.textContent = item.caption || 'Imagen sin descripción';
    this.renderMetadata(item);
    this.counterEl.textContent = (this.activeIndex + 1) + ' / ' + groupItems.length;
  };

  GalleryViewer.prototype.setLoadingState = function (isLoading) {
    if (this.spinnerEl) {
      this.spinnerEl.style.display = isLoading ? 'block' : 'none';
    }
  };

  GalleryViewer.prototype.updateNavigation = function (length) {
    if (this.prevButton) {
      this.prevButton.disabled = this.activeIndex === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.activeIndex >= length - 1;
    }
  };

  GalleryViewer.prototype.renderMetadata = function (item) {
    if (this.storyEl) {
      if (item.historia) {
        this.storyEl.textContent = item.historia;
        this.storyEl.hidden = false;
      } else {
        this.storyEl.textContent = '';
        this.storyEl.hidden = true;
      }
    }

    if (!this.detailEls) {
      return;
    }

    Object.keys(this.detailEls).forEach(function (key) {
      var el = this.detailEls[key];
      if (!el) {
        return;
      }
      var value = item[key];
      var parent = el.parentElement;
      if (value) {
        el.textContent = value;
        el.removeAttribute('aria-hidden');
        if (parent) {
          parent.classList.remove('is-empty');
        }
      } else {
        el.textContent = '—';
        el.setAttribute('aria-hidden', 'true');
        if (parent) {
          parent.classList.add('is-empty');
        }
      }
    }, this);
  };

  document.addEventListener('DOMContentLoaded', function () {
    new GalleryViewer();
  });
})();
