import tippy from 'tippy.js';
import isObjectLike from 'lodash/isObjectLike';
import isObject from 'lodash/isObject';
import EventEmitter from '../eventEmitter/EventEmitter';
import { delegateHandler } from '../general/General';
import dispatchTrigger from '../helpers/triggers';
import FlatGalleryPopup from '../templates/flatPage/flatGalleryPopup';
import { FlatExplicationPropertyRow } from '../templates/flatPage/flat';
import { VillaExplicationPropertyRow } from '../templates/flatPage/villa/villaExplication';
import { deviceType } from 'detect-it';
import {
  isDesktopTouchMode,
  isMobile,
  isTablet,
} from '../../../../s3d2/scripts/helpers/helpers_s3d2';

class FlatView extends EventEmitter {
  constructor(model, elements, i18n) {
    super();
    this._model = model;
    this._elements = elements;
    this.i18n = i18n;

    this.mappingClickEvents = {
      polygon: elem => this.emit('clickFlatHandler', elem),
      floorBtn: elem => this.emit('changeFloorHandler', elem),
      floorDirectBtn: elem => this.emit('changeFloorHandlerByNumber', elem),
      toFloorBtn: elem => {
        dispatchTrigger('visit-floor-page-from-flat-page', {
          href: window.location.href,
        });
        this.emit('toFloorPlan', elem);
      },
      pdf: elem => this.emit('clickPdfHandler', elem),
      show3d: elem => this.emit('look3d', elem),
      radioView: elem => {
        if (elem.localName !== 'input') return;
        this.emit('changeRadioChecked', elem);
      },
      galleryPopup: elem => {
        new FlatGalleryPopup(elem.dataset.href).render();
      },
      flatExplication: elem => {
        this.emit('changeFlatExplication', {
          value: elem.dataset.value,
          type: elem.getAttribute('data-flat-explication-button'),
        });
      },
      showFlatInFlyby: elem => {
        this.emit('showFlatInFlyby', elem);
      },
      flatButtonUp: elem => {
        let elementToScroll = this._model.wrapper.querySelector('.s3d-flat__content-wrapper');
        if (isTablet()) {
          elementToScroll = this._model.wrapper.querySelector('.js-s3d-flat');
        }
        if (isMobile()) {
          elementToScroll = this._model.wrapper;
        }
        elementToScroll.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      },
      flatScrollToPrice: elem => {
        document.getElementById('chart').scrollIntoView({
          behavior: 'smooth',
        });
      },
    };

    model.wrapper.addEventListener('click', event => {
      // event.preventDefault();
      const delegateElements = {
        polygon: delegateHandler('.js-s3d-flat__polygon', event),
        floorBtn: delegateHandler('[data-floor_btn]', event),
        floorDirectBtn: delegateHandler('[data-floor_direct-btn]', event),
        toFloorBtn: delegateHandler('#s3d-to-floor', event),
        pdf: delegateHandler('.js-s3d__create-pdf', event),
        show3d: delegateHandler('#js-s3d__show-3d', event),
        radioView: delegateHandler('.js-s3d__radio-view-change', event),
        galleryPopup: delegateHandler('[data-gallery-popup-call]', event),
        showFlatInFlyby: delegateHandler('[data-show-flat-in-flyby]', event),
        flatExplication: delegateHandler('[data-flat-explication-button]', event),
        flatButtonUp: delegateHandler('[data-flat-button-up]', event),
        flatScrollToPrice: delegateHandler('[data-flat-scroll-to-prices]', event),
      };

      const entries = Object.entries(delegateElements);
      entries.map(([key, value]) => isObject(value) && this.mappingClickEvents[key](value));
    });

    model.wrapper.addEventListener('mousemove', evt => {
      if (deviceType !== 'mouseOnly') return;
      const target = evt.target.closest('polygon');
      if (isDesktopTouchMode()) return;
      if (!target) {
        this.emit('hideInfoBox');
        return;
      }
      this.emit('updateInfoBoxPosition', evt);
    });

    model.wrapper.addEventListener('mouseout', event => {
      this.emit('toggleAnimationCircle', event);
    });

    model.wrapper.addEventListener('mouseover', evt => {
      const target = evt.target.closest('polygon');
      this.emit('toggleAnimationCircle', evt);
      if (isDesktopTouchMode()) return;
      if (!target) {
        this.emit('hideInfoBox');
        return;
      }
      this.emit('mouseoverFlatHandler', target);
    });

    model.wrapper.addEventListener('click', evt => {
      const scrollDownButton = evt.target.closest('[href="#toScroll"]');
      if (!scrollDownButton) return;
      evt.preventDefault();
      document.querySelector('[id="toScroll"]').scrollIntoView({ behavior: 'smooth' });
    });

    document.body.addEventListener('click', event => {
      const target = event.target.closest('button[data-type="flat"]');
      if (!target) return;
      if (this._model.g_currentPage$.value.type !== 'flat') return;
      this.emit('goToFlat', target.getAttribute('data-id'));
    });

    model.wrapper.addEventListener('click', elem => {
      const target = delegateHandler('.js-s3d__radio-type', elem);
      if (!isObject(target)) return;
      this.emit('changeRadioType', target);
    });

    model.wrapper.addEventListener('click', elem => {
      const target = delegateHandler('.js-s3d__radio-view', elem);
      if (!isObject(target)) return;
      this.emit('changeRadioView', target);
    });

    model.on('setFlat', html => {
      this.setFlat(html);
    });
    model.on('setFloor', html => {
      this.setFloor(html);
    });
    model.on('removeFloorSvg', () => {
      this.removeFloorSvg();
    });
    model.on('removeElement', tag => {
      this.removeElement(tag);
    });
    model.on('changeClassShow', elem => {
      this.changeClassShow(elem);
    });
    model.on('updateImg', data => {
      this.setNewImage(data);
    });
    model.on('createRadioElement', data => {
      this.createRadio(data);
    });
    model.on('createRadioSvg', data => {
      this.createRadioSvg(data);
    });
    model.on('clearRadioElement', wrap => {
      this.clearRadio(wrap);
    });
    model.on('updateActiveFlatInFloor', id => {
      this.updateActiveFlatInFloor(id);
    });
    model.on('updateFlatIdChoose', id => {
      this.updateFlatIdChoose(id);
    });

    model.on('renderFloorChangeButtons', data => {
      this.renderFloorChangeButtons(data);
    });
    model.on('renderCurrentFloor', data => {
      this.renderCurrentFloor(data);
    });

    model.on('updateExplicationImage', url => {
      document.querySelector('[data-flat-explication-image]').src = url;
    });

    model.on('updateExplication2d3dBtnVisibility', isCurrentFloorHas3dImage => {
      this._model.wrapper
        .querySelectorAll('[data-flat-explication-button="type"][data-value="3d"]')
        .forEach(el => {
          el.style.display = isCurrentFloorHas3dImage ? '' : 'none';
        });
    });

    // model.on('updateExplicationFloorTitle', data => {
    //   this._model.wrapper.querySelectorAll('[data-flat-explication-title]').forEach(el => {
    //     el.textContent = this.i18n.t(`Flat.explication_data.floor_${data.floor}`);
    //   });

    //   this._model.wrapper.querySelectorAll('[data-flat-explication-button="floor"]').forEach(el => {
    //     el.classList.toggle('active', data.floor == el.dataset.value);
    //   });
    //   this._model.wrapper.querySelectorAll('[data-flat-explication-button="type"]').forEach(el => {
    //     el.classList.toggle('active', data.type == el.dataset.value);
    //   });
    // });
    model.on('updateExplicationFloorTitle', data => {
      this._model.wrapper.querySelectorAll('[data-flat-explication-title]').forEach(el => {
        el.textContent = this.i18n.t(`Flat.explication_data.floor_${data.floor}`);
      });

      this._model.wrapper.querySelectorAll('[data-flat-explication-button="floor"]').forEach(el => {
        // Для нових кнопок з photoType порівнюємо по photoType, для старих — по floor
        const isPhotoTypeButton = [
          'site_plan',
          'ground',
          'first_floor',
          'second_floor',
          'roof_terrace',
        ].includes(el.dataset.value);
        if (isPhotoTypeButton) {
          el.classList.toggle('active', data.photoType === el.dataset.value);
        } else {
          el.classList.toggle('active', data.floor == el.dataset.value);
        }
      });

      this._model.wrapper.querySelectorAll('[data-flat-explication-button="type"]').forEach(el => {
        el.classList.toggle('active', data.type == el.dataset.value);
      });
    });
    model.on('updateFloorProperties', propertiesOfCurrentFloor => {
      const updateFloorProperties = (container, properties, propertyRowFunction) => {
        container.innerHTML = properties
          .map(premise =>
            propertyRowFunction(premise.property_name, premise.property_flat, this.i18n),
          )
          .join('');
      };
      const flatContainer = document.querySelector(
        '[data-flat-explication-floor-properties-container]',
      );
      const villaContainer = document.querySelector(
        '[data-villa-explication-floor-properties-container]',
      );
      flatContainer
        ? updateFloorProperties(flatContainer, propertiesOfCurrentFloor, FlatExplicationPropertyRow)
        : villaContainer
        ? updateFloorProperties(
            villaContainer,
            propertiesOfCurrentFloor,
            VillaExplicationPropertyRow,
          )
        : console.warn('No valid container found for floor properties.');
    });
  }

  setTimer(dateOfFinish) {
    const deadline = new Date(dateOfFinish);
    let timerId = null;
    function countdownTimer() {
      const diff = deadline - new Date();
      if (diff <= 0) {
        clearInterval(timerId);
      }
      const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0;
      const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0;
      const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
      const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;
      $days.textContent = days < 10 ? '0' + days : days;
      $hours.textContent = hours < 10 ? '0' + hours : hours;
      $minutes.textContent = minutes < 10 ? '0' + minutes : minutes;
      $seconds.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    const $days = document.querySelector('.timer__days');
    const $hours = document.querySelector('.timer__hours');
    const $minutes = document.querySelector('.timer__minutes');
    const $seconds = document.querySelector('.timer__seconds');
    countdownTimer();
    timerId = setInterval(countdownTimer, 1000);
  }

  setFlat(content) {
    this._model.wrapper.innerHTML = content;

    this.emit('flatContentIsSet');
    const points = this._model.wrapper.querySelectorAll('[data-peculiarity-content]');
    if (points.length === 0) return;
    tippy(points, {
      arrow: false,
      trigger: 'mouseenter click',
      placement: 'bottom',
      content: elem => {
        const container = document.createElement('div');
        container.innerHTML = `${elem.dataset.peculiarityContent}`;
        return container;
      },
    });
  }

  renderCurrentFloor(data) {
    const { floor } = data;
    document.querySelectorAll('[data-current-floor]').forEach(el => {
      el.setAttribute('data-value', floor);
      el.innerHTML = floor;
    });
    this._model.wrapper.querySelectorAll('[data-floor_direct-btn]').forEach(el => {
      el.classList.toggle('active', floor == el.dataset.floor);
    });
    if (this._model.floorListSliderInstance) {
      const nextIndex = this._model.floorListSliderInstance.slides.findIndex(
        slide => slide.dataset.floor == floor,
      );
      this._model.floorListSliderInstance.slideTo(nextIndex);
    }
  }

  renderFloorChangeButtons(data) {
    document.querySelectorAll('[data-floor_direction="prev"]').forEach(el => {
      el.disabled = data.prev === null;
    });
    document.querySelectorAll('[data-floor_direction="next"]').forEach(el => {
      el.disabled = data.next === null;
    });
  }

  updateActiveFlatInFloor(id) {
    const currentActiveFlat = document.querySelector('.js-s3d-flat__polygon.polygon__active-flat');
    if (currentActiveFlat) currentActiveFlat.classList.remove('polygon__active-flat');
    const nextActiveFlat = document.querySelector(`.js-s3d-flat__polygon[data-id="${id}"]`);
    if (nextActiveFlat) nextActiveFlat.classList.add('polygon__active-flat');
  }

  updateFlatIdChoose(id) {
    if (!id) return;
    document.querySelector('.s3d-nav__btn[data-type="flat"]').setAttribute('data-id', id);
  }

  setFloor(html) {
    const node = document.querySelector('.s3d-flat__floor-info');
    const nodes3d2 = document.querySelector('.s3d2-apartment__floor-info');
    if (node) {
      node.insertAdjacentHTML('afterbegin', html);
    }
    if (nodes3d2) {
      nodes3d2.insertAdjacentHTML('afterbegin', html);
    }
  }

  changeClassShow(config) {
    const { element, flag } = config;
    const container = document.querySelector(element);
    if (!isObjectLike(container)) return;
    const method = flag ? 'add' : 'remove';
    container.classList[method]('show');
  }

  removeFloorSvg() {
    this.removeElement('.s3d-floor__svg');
  }

  removeElement(tag) {
    const element = document.querySelector(tag);
    if (element) element.remove();
  }

  createRadio(data) {
    const { wrap, type, name } = data;
    if (!document.querySelector(wrap)) {
      return;
    }
    document.querySelector(wrap).insertAdjacentHTML(
      'beforeend',
      `<label class="s3d-flat__button js-s3d__radio-${name}" data-type=${type} >
      <input type="radio" name=${name} class="s3d-flat__button-input" value=${type} />
    <span>${this.i18n.t(`Flat.buttons.${type}`)}</span></label>`,
    );
  }

  createRadioSvg(wrap) {
    if (!document.querySelector(wrap)) {
      console.warn(`${wrap}: no such element`);
      return;
    }
    document
      .querySelector(wrap)
      .insertAdjacentHTML(
        'beforeend',
        `<div class="s3d-flat__buttons-bg js-s3d__btn-tab-svg"><svg width="50" height="36" viewBox="0 0 50 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="36" rx="0"/></svg></div>`,
      );
  }

  clearRadio(wrap) {
    if (!document.querySelector(wrap)) {
      console.warn(`${wrap}: no such element`);
      return;
    }
    document.querySelector(wrap).innerHTML = '';
  }

  setNewImage(imgPath) {
    const imgContainer = document.querySelector('.js-s3d-flat__image');
    const url = `${defaultProjectPath}${imgPath}`;
    if (imgContainer) {
      imgContainer.setAttribute('src', url);
      imgContainer.setAttribute('data-mfp-src', url);
    }
  }
}

export default FlatView;
