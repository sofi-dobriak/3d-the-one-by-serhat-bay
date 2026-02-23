import s3d2_SwiperButtons from '../../../../../../../s3d2/scripts/templates/common/s3d2_SwiperButtons';
import s3d2_InfoHoverTips from '../../../../../../../s3d2/scripts/templates/common/s3d2_InfoHoverTips';
import { escapeHtml } from '../../../../../../../s3d2/scripts/helpers/helpers_s3d2';

import get from 'lodash/get';
import Swiper, { Navigation } from 'swiper';

Swiper.use([Navigation]);

let disablePreviousResize = null;

export default function s3d2_paymentSection({ i18n, flat, payment_list = [] }) {
  if (typeof disablePreviousResize === 'function') {
    disablePreviousResize();
    disablePreviousResize = null;
  }

  const paymentHtml =
    payment_list.length > 0
      ? `
    <section class="payment">
      <div class="payment__title-icon-container">
        <h1 class="payment__title-icon-container__title">${i18n.t('Flat.payment.title')}</h1>
        ${s3d2_InfoHoverTips({ content: i18n.t('Flat.payment.tips') })}
      </div>

      <p class="payment__description">${i18n.t('Flat.payment.description')}</p>
      <div class="payment-swiper-wrapper">

        <div class="swiper">
          <ul class="payment__list swiper-wrapper">

            <!--викликати функцію getPaymentCardFromDevBase замість отримувати значення з settings.json, якщо треба отримати дані з девбейзу-->
            ${payment_list.map(card => paymentCard(i18n, card)).join('')}

          </ul>
        </div>

        ${s3d2_SwiperButtons({
          classNamePrev: 'payment-swiper-button-prev',
          classNameNext: 'payment-swiper-button-next',
        })}
        <p class="payment__end-text">${i18n.t('Flat.payment.end_text')}</p>
      </div>
    </section>
  `
      : ``;

  requestAnimationFrame(() => initSwiper());

  return paymentHtml;
}

function getPaymentCardFromDevBase(flat) {
  // ВКАЗАТИ СВОЇ ID ПОЛІВ - МОЖУТЬ ВІДРІЗНЯТИСЯ ВІД НАПИСАНИХ ТУТ !!!

  const PAYMENT_FIELD_IDS = {
    DOWN_PAYMENT: '63', // Down Payment (%35)
    INTERIM_6M: '64', // Interim Payment (6th month-%10)
    INTERIM_12M: '65', // Interim Payment (12th month-%15)
    INTERIM_18M: '66', // Interim Payment (18th month-%10)
    INSTALLMENT: '67', // Installment Amount (36 month)
  };

  const paymentIds = Object.values(PAYMENT_FIELD_IDS);
  const propertiesMap = new Map(flat.customProperties.map(prop => [prop.properties?.id, prop]));

  const paymentItemsHtml = paymentIds
    .map(id => {
      const property = propertiesMap.get(id);
      const rawLabel = property?.properties?.label ?? '';
      const priceValue = property?.value?.value ?? '';

      if (!rawLabel && !priceValue) return '';

      const { title, period, percent } = parsePaymentTitle(rawLabel);

      return `
          <li class="payment__list__item swiper-slide">
            <div class="payment__list__item__title-container">
              <h2 class="payment__list__item__title">
                ${title}${percent ? ` (${percent})` : ''}
              </h2>
            </div>
              <div class="payment__list__item__description-percent-container">
                <div class="payment__list__item__percent-container">
                  <p class="payment__list__item__percent-container__percent">${priceValue}</p>
                </div>
              </div>
              <p class="payment__list__item__period">${period}</p>
          </li>
        `;
    })
    .join('');

  return paymentItemsHtml;
}

function parsePaymentTitle(input) {
  // Регулярний вираз витягує:
  // 1. Все до першої дужки (Назва платежу)
  // 2. Вміст у дужках до дефіса або знака % (Період)
  // 3. Все, що залишилося після знака % (Значення відсотка)
  const regex = /^([^(]+)\s*\(([^-%]*)-?%?([^)]*)\)$/;
  const match = input.match(regex);

  if (match) {
    // Якщо всередині дужок був тільки відсоток (як %35),
    // то match[2] буде пустим, а match[3] отримає число.
    return {
      title: match[1].trim(),
      period: match[2].trim() ? `${match[2].trim()}` : '',
      percent: match[3].trim() ? `${match[3].trim()}%` : '',
    };
  }

  // Якщо формат не підійшов — просто виводимо назву, а інше порожнє
  return { title: input, period: '', percent: '' };
}

function paymentCard(i18n, item) {
  const lang = i18n.language || 'en';

  function getTranslation(field) {
    const value = field[lang] || field['en'] || '';
    return escapeHtml(value);
  }

  const title = getTranslation(item.title);
  const description = getTranslation(item.description);
  const percent = getTranslation(item.percent);
  const payment = getTranslation(item.payment);
  const period = getTranslation(item.period);

  return `
      <li class="payment__list__item swiper-slide">
        <div class="payment__list__item__title-container">
          <h2 class="payment__list__item__title">${title}</h2>
        </div>

        <div class="payment__list__item__description-percent-container">
          <p class="payment__list__item__description">${description}</p>

          <div class="payment__list__item__percent-container">
            <p class="payment__list__item__percent-container__percent">${percent}</p>
            <p class="payment__list__item__percent-container__payment">${payment}</p>
          </div>
        </div>

        <p class="payment__list__item__period">${period}</p>
      </li>
  `;
}

function initSwiper() {
  const swiperEl = document.querySelector('.payment-swiper-wrapper .swiper');
  if (!swiperEl) return;

  if (swiperEl.swiper) {
    swiperEl.swiper.destroy(true, true);
  }

  const swiper = new Swiper(swiperEl, {
    slidesPerView: 5,
    spaceBetween: 20,
    observer: true,
    observeParents: true,
    watchOverflow: true,
    navigation: {
      nextEl: '.payment-swiper-button-next',
      prevEl: '.payment-swiper-button-prev',
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1366: { slidesPerView: 5 },
    },
    on: {
      init: handleSwiperInit,
      resize: function() {
        updateSwiperUI(this);
      },
      afterInit: function() {
        updateSwiperUI(this);
      },
    },
  });
}

function handleSwiperInit() {
  if (!this?.slides) return;

  updateSwiperUI(this);

  disablePreviousResize = debounceResizeCallback(() => {
    if (this && !this.destroyed && this.slides) {
      updateSwiperUI(this);
    }
  }, 150);
}

function updateSwiperUI(swiperInstance) {
  //оновлення розмітки карток, якщо їх менше за зазначену кількість у свайпері
  //(займають всю ширину екрану)
  if (!swiperInstance?.slides?.length) return;

  const { slides, params, el, wrapperEl } = swiperInstance;

  // Центрування карток
  if (slides.length <= params.slidesPerView) {
    el.classList.add('swiper--centered');
  } else {
    el.classList.remove('swiper--centered');
  }

  //створення timeline лінії
  const firstSlide = slides[0];
  const lastSlide = slides[slides.length - 1];

  if (!firstSlide || !lastSlide) {
    console.error('No first or last slides');
    return;
  }

  const lineStart = firstSlide.offsetLeft + firstSlide.offsetWidth / 2;
  const lineEnd = lastSlide.offsetLeft + lastSlide.offsetWidth / 2;

  let line = wrapperEl.querySelector('.payment-timeline');

  //якщо лінії не знайдено, створюємо її
  if (!line) {
    line = document.createElement('div');
    line.className = 'payment-timeline';
    Object.assign(line.style, {
      position: 'absolute',
      top: '-16px',
    });
    wrapperEl.appendChild(line);
  }

  line.style.left = `${lineStart}px`;
  line.style.width = `${lineEnd - lineStart}px`;
}

//перерахунок лінії при ресайзі екрану
export function debounceResizeCallback(callback, wait = 150, options) {
  const isFn = typeof callback === 'function';

  const w = typeof wait === 'number' && Number.isFinite(wait) && wait >= 0 ? wait : 0;

  /** @type {ReturnType<typeof setTimeout> | null} */
  let timer = null;

  /** @type {boolean} */
  let disabled = false;

  // Guard for non-browser / no window.
  const hasWindow =
    typeof window !== 'undefined' &&
    window &&
    typeof window.addEventListener === 'function' &&
    typeof window.removeEventListener === 'function';

  /** @param {UIEvent|Event} ev */
  const handler = ev => {
    if (disabled) return;

    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      timer = null;
      if (disabled) return;
      if (!isFn) return;

      try {
        callback(ev);
      } catch {
        // Intentionally swallow to avoid breaking resize event loop.
        // Users can wrap callback if they need error propagation/logging.
      }
    }, w);
  };

  if (hasWindow && isFn) {
    // Use provided options only when it's a valid type per spec.
    const optType = typeof options;
    const validOptions = options == null || optType === 'boolean' || optType === 'object';

    window.addEventListener('resize', handler, validOptions ? options : undefined);
  }

  /**
   * Disables the resize callback: removes the event listener (if any)
   * and cancels any pending debounced call.
   *
   * Safe to call multiple times.
   *
   * @returns {void}
   */
  const disable = () => {
    if (disabled) return;
    disabled = true;

    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }

    if (hasWindow && isFn) {
      const optType = typeof options;
      const validOptions = options == null || optType === 'boolean' || optType === 'object';

      window.removeEventListener('resize', handler, validOptions ? options : undefined);
    }
  };

  return disable;
}
