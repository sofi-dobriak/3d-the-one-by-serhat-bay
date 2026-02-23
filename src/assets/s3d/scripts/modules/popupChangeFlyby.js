import toNumber from 'lodash/toNumber';
import popupFlyby from './templates/popupFlyby';

class PopupChangeFlyby {
  constructor(data, i18n) {
    this.state = {};
    this.i18n = i18n;
    this.updateFsm = data.updateFsm;
    this.getFlat = data.getFlat;

    this.init();

    this.updateState = this.updateState.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }

  init() {
    document
      .querySelector('.js-s3d__slideModule')
      .insertAdjacentHTML('beforeend', popupFlyby(this.i18n));
    this.popup = document.querySelector('.js-s3d-popup-flyby');
    this.popup.addEventListener('click', event => {
      if (!event.target.closest('[data-type="close"]')) return;
      this.closePopup();
    });
    this.popup.addEventListener('click', event => {
      if (!event.target.closest('[data-type="next"]')) return;
      this.activateTranslate();
    });
  }

  updateState(config) {
    this.state = config;
  }

  updateContent(element) {
    const filter = document.querySelector('.js-s3d-filter');
    const cor = element.getBoundingClientRect();
    const height = element.offsetHeight;

    const popUp = document.querySelector('.s3d-popup-flyby');
    const heightPopUp = popUp.offsetHeight;

    const top = cor.y + height;
    const elementTop = cor.top;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight;
    const distanceFromBottom = screenHeight - elementTop;
    const rightmostPoint = document.querySelector('.s3d-filter-wrap').offsetWidth + 10;
    const center = cor.y - heightPopUp / 2 + height / 2;
    const elementHeight = 190;
    const windowHeight = window.innerHeight;
    let topPosition = center;

    if (center + elementHeight > windowHeight) {
      topPosition = windowHeight - elementHeight;
    }

    // Стилі для десктопу
    document.querySelector('.js-s3d-popup-flyby__bg-active').setAttribute(
      'style',
      `
    position: absolute;
    transform: translate(0, ${top}px);
    width: ${filter.offsetWidth}px`,
    );

    document.querySelector('.js-s3d-popup-flyby__bg-active-top').setAttribute(
      'style',
      `
    position: absolute;
    transform: translate(0, -${distanceFromBottom}px);
    width: ${filter.offsetWidth}px`,
    );

    document.querySelector('.s3d-popup-flyby').setAttribute(
      'style',
      `
      position: absolute;
      top: 0;
      left: ${rightmostPoint}px;
      transform: translate(0, ${topPosition}px);
      margin: 0
      `,
    );

    if (window.innerWidth > 680) {
      console.log('element', element);
      if (element.classList.contains('s3d-card')) {
        filter.querySelectorAll('.s3d-card').forEach(card => {
          card.style.opacity = card === element ? '1' : '0.1';
        });
      }
    }

    // Мобільна версія - посередині батьківського елемента
    if (window.innerWidth <= 680) {
      // Отримуємо координати батьківського елемента (контейнера)
      const parentElement = element.closest('.s3d-filter') || filter;
      const parentRect = parentElement.getBoundingClientRect();

      // Центруємо попап відносно батьківського елемента
      const centerX = parentRect.left + parentRect.width / 2;
      const centerY = parentRect.top + parentRect.height / 2;

      document.querySelector('.s3d-popup-flyby').setAttribute(
        'style',
        `
      position: fixed;
      top: ${centerY}px;
      left: ${centerX}px;
      transform: translate(-50%, -50%);
      width: ${Math.min(filter.offsetWidth, window.innerWidth - 40)}px;
      max-width: 90vw;
      z-index: 9999;
      margin: 0;
      `,
      );
    } else {
      // Десктопна версія
      document.querySelector('.s3d-popup-flyby').setAttribute(
        'style',
        `
      position: absolute;
      top: 0;
      left: ${rightmostPoint}px;
      transform: translate(0, ${topPosition}px);
      margin: 0;
      `,
      );
    }

    this.flatId = toNumber(element.dataset.id);
    const flat = this.getFlat(this.flatId);
    this.popup.querySelector('[data-type="title"]').innerHTML = flat.number;
  }

  openPopup(setting) {
    this.updateState(setting);
    if (!this.popup.classList.contains('s3d-active')) {
      this.popup.classList.add('s3d-active');
    }
  }

  closePopup() {
    this.popup.classList.remove('s3d-active');
    document.querySelectorAll('.js-s3d-filter .s3d-card').forEach(card => {
      card.style.opacity = 1;
    });
  }

  activateTranslate() {
    this.closePopup();
    this.updateFsm({ ...this.state, id: this.flatId }, true, {
      ...this.state,
      flatId: this.flatId,
    });
  }
}

export default PopupChangeFlyby;
