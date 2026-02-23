import s3d2_SwiperButtons from '../../../../../../../s3d2/scripts/templates/common/s3d2_SwiperButtons';
import s3d2_InfoHoverTips from '../../../../../../../s3d2/scripts/templates/common/s3d2_InfoHoverTips';
import { escapeHtml } from '../../../../../../../s3d2/scripts/helpers/helpers_s3d2';

import Swiper, { Navigation } from 'swiper';
Swiper.use([Navigation]);

export default function s3d2_featureMaterials({ i18n, materials = [] }) {
  setTimeout(() => {
    initMaterialsSwiper();
  }, 50);

  return materials.length > 0
    ? `
    <section class="materials">
      <div class="materials__title-icon-block">
        <h2 class="materials__title">${i18n.t('Flat.materials.title')}</h2>
        ${s3d2_InfoHoverTips({
          classNameContent: 'materials-title-info-text',
          content: i18n.t('Flat.materials.tips'),
        })}
      </div>

      <p class="materials__description">${i18n.t('Flat.materials.subtitle')}</p>

      <div class="swiper materials-swiper">
        <ul class="materials__list swiper-wrapper">
          ${materials.map((item, index) => getMaterialsCard(i18n, item, index)).join('')}
        </ul>
      </div>

      ${s3d2_SwiperButtons({
        className: 'materials-nav-buttons',
        classNamePrev: 'materials-swiper-button-prev',
        classNameNext: 'materials-swiper-button-next',
      })}
    </section>
  `
    : ``;
}

function getMaterialsCard(i18n, item, index) {
  const lang = i18n.language || 'en';
  const tags = item.tags[lang] || [];

  const getTranslation = field => {
    const value = field[lang] || field['en'] || '';
    return escapeHtml(value);
  };

  const title = getTranslation(item.title);
  const subtitle = getTranslation(item.subtitle);

  return `
  <li class="materials__list__item swiper-slide" data-index="${index}" data-material-index="${index}" data-open-materials>
      <div class="materials__list__item__center-text-block">
        <div class="materials__list__item__tags-block">
          <ul class="materials__list__item__tags-list">
            ${
              tags.length > 0
                ? tags
                    .map(tag => getMaterialTags(tag))
                    .slice(0, 3)
                    .join('')
                : ``
            }
          </ul>
          <p class="materials__list__item__center-subtitle">${subtitle}</p>
          <a class="materials__list__item__center-link" href="${item.videoLink}" target="_blank">
            <span>${i18n.t('Flat.materials.watch_video')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5C6.7535 2.5 2.50039 6.75366 2.5 12L2.5127 12.4893C2.76734 17.5086 6.91739 21.5 12 21.5L12.4893 21.4873C17.3465 21.2409 21.2409 17.3465 21.4873 12.4893L21.5 12C21.4996 6.75366 17.2465 2.5 12 2.5ZM12 3.5C16.6942 3.5 20.4996 7.30587 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5L11.5625 20.4893C7.2163 20.2689 3.73109 16.7837 3.51074 12.4375L3.5 12C3.50038 7.30587 7.30585 3.5 12 3.5ZM10.9082 8.86133C10.5225 8.66878 10.0647 8.67514 9.68457 8.88086C9.30088 9.08885 9.04599 9.47685 9.0459 9.92578V14.0771L9.05762 14.2422C9.11174 14.6191 9.34889 14.9365 9.68164 15.1182C9.8787 15.2257 10.0969 15.2803 10.3154 15.2803L10.4658 15.2715C10.6151 15.2544 10.7617 15.2112 10.8994 15.1436L15.0889 13.0869V13.0859C15.4408 12.9128 15.6992 12.5859 15.7598 12.1953L15.7734 12.0234C15.7751 11.5582 15.4985 11.156 15.0967 10.9551L10.9082 8.86133ZM10.1611 9.75977C10.2527 9.71037 10.3654 9.70827 10.4609 9.75586L14.6494 11.8496C14.7431 11.8964 14.7735 11.9688 14.7734 12.0195L14.7666 12.0605C14.7534 12.1045 14.7183 12.1536 14.6475 12.1885L10.459 14.2461V14.2471C10.4132 14.2695 10.3639 14.2803 10.3154 14.2803L10.2354 14.2705C10.2095 14.2639 10.184 14.2542 10.1602 14.2412C10.094 14.2051 10.0633 14.159 10.0518 14.1172L10.0459 14.0771V9.92578C10.046 9.87345 10.073 9.80755 10.1611 9.75977Z" fill="var(--s3d2-color-text-gray-200)"/>
            </svg>
          </a>
        </div>

        <div class="materials__list__item__center-title-block">
          <div class="materials__list__item__scale-info-block">
            <p class="materials__list__item__center-text">${i18n.t(
              'Flat.materials.real_scale.title',
            )}</p>
            ${s3d2_InfoHoverTips({
              classNameBlock: 'materials-link-info-block',
              classNameContent: 'materials-link-info-text',
              content: i18n.t('Flat.materials.real_scale.tips'),
            })}
          </div>
          <h3 class="materials__list__item__center-title">${title}</h3>
        </div>
      </div>

      <div class="materials__list__item__image-block">
        <img class="materials__list__item__image" src="${item.image}" alt="${title}">
      </div>
      <h3 class="materials__list__item__title">${title}</h3>
    </li>`;
}

function getMaterialTags(tag) {
  return `
    <li class="materials__list__item__tags-item">
      <p class="materials__list__item__tags-text">${tag}</p>
    </li>
  `;
}

function initMaterialsSwiper() {
  const swiperElement = document.querySelector('.materials-swiper');

  if (!swiperElement) {
    console.error('Swiper element not found');
    return;
  }

  // КОНСТАНТИ РОЗМІРІВ (точно як в CSS)
  // Важливо: ці значення мають збігатись з CSS
  const getSizes = () => {
    const ww = window.innerWidth;

    if (ww <= 767) {
      return {
        activeW: 0.92 * ww,
        inactiveW: 80, // фіксована ширина
        gap: 10,
      };
    } else if (ww <= 1023) {
      return {
        activeW: (520 / 1023) * ww,
        inactiveW: 140,
        gap: 16,
      };
    } else {
      return {
        activeW: (588 / 1512) * ww,
        inactiveW: 200,
        gap: 20,
      };
    }
  };

  const swiper = new Swiper('.materials-swiper', {
    slidesPerView: 'auto',
    spaceBetween: window.innerWidth <= 767 ? 10 : window.innerWidth <= 1023 ? 16 : 20,
    speed: 400,
    watchSlidesProgress: true,
    initialSlide: 2,
    centeredSlides: true,
    allowTouchMove: false,
    on: {
      setTransition: function(swiper, duration) {
        swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
      },
      setTranslate: function(swiper, translate) {
        if (swiper.animating) return;

        const { activeW, inactiveW, gap } = getSizes();
        const activeIndex = swiper.activeIndex;

        const widthOfPrevSlides = activeIndex * inactiveW;
        const gapsOfPrevSlides = activeIndex * gap;

        const centerOffset = (swiper.width - activeW) / 2;
        const newTranslate = -widthOfPrevSlides - gapsOfPrevSlides + centerOffset;

        if (!isNaN(newTranslate)) {
          swiper.translate = newTranslate;
          swiper.wrapperEl.style.transform = `translate3d(${newTranslate}px, 0, 0)`;
        }

        swiper.wrapperEl.style.transform = `translate3d(${newTranslate}px, 0, 0)`;
      },

      slideChangeTransitionStart: function(swiper) {
        swiper.emit('setTranslate', swiper, swiper.translate);
      },

      resize: function(swiper) {
        swiper.update();
        swiper.emit('setTranslate', swiper, swiper.translate);
      },
    },
  });

  document.querySelector('.materials-swiper-button-prev').addEventListener('click', e => {
    e.stopPropagation();
    if (swiper.activeIndex > 0) {
      swiper.slideTo(swiper.activeIndex - 1, 400); // 400 — це швидкість у мс
      updateButtonsState(swiper);
    }
  });

  document.querySelector('.materials-swiper-button-next').addEventListener('click', e => {
    e.stopPropagation();
    if (swiper.activeIndex < swiper.slides.length - 1) {
      swiper.slideTo(swiper.activeIndex + 1, 400);
      updateButtonsState(swiper);
    }
  });
}

function updateButtonsState(swiper) {
  const prevBtn = document.querySelector('.materials-swiper-button-prev');
  const nextBtn = document.querySelector('.materials-swiper-button-next');

  // Перевірка для кнопки "Назад"
  if (swiper.activeIndex === 0) {
    prevBtn.classList.add('swiper-button-disabled');
  } else {
    prevBtn.classList.remove('swiper-button-disabled');
  }

  // Перевірка для кнопки "Вперед"
  if (swiper.activeIndex === swiper.slides.length - 1) {
    nextBtn.classList.add('swiper-button-disabled');
  } else {
    nextBtn.classList.remove('swiper-button-disabled');
  }
}
