import { speed } from 'jquery';
import IconButton from '../../../../../../../s3d2/scripts/templates/common/IconButton';
import Swiper, { Navigation, Autoplay } from 'swiper';

Swiper.use([Navigation, Autoplay]);

export default function VillaGalleryScreen(images = [], i18n) {
  const containerId = `villa-gallery-swiper-${Date.now()}`;
  const galleryHtml = `
    <div class="s3d-villa__gallery-wrap" id="s3dFlatGallery">
        <div class="s3d-villa__floor__title-wrap">
            <div class="s3d-villa__floor__title-wrap__line"></div>
            <span class="s3d-villa__floor__title"> ${i18n.t('Flat.gallery')}</span>
            <div class="s3d-villa__floor__title-wrap__line"></div>

        </div>
        <div class="s3d-villa__gallery-container swiper-container" data-villa-gallery-slider id="${containerId}">
            <div class="swiper">
                <div class="swiper-wrapper">
                ${images
                  .map(
                    image => `
                    <div class="swiper-slide">
                    <div class="s3d-villa__gallery-container-slide">
                        <img src="${image}" alt="villa image" loading="lazy">
                    </div>
                    </div>
                `,
                  )
                  .join('')}
                </div>
            </div>
        <div class="s3d-villa__gallery-container-navigation">
            ${IconButton('', 'data-villa-gallery-swiper-button-prev', 'Big arrow left')}
            <div class="s3d-villa__gallery-container-navigation__counter">
            <span data-villa-gallery-swiper-current-slide>1</span>
            <span>/</span>
            <span data-villa-gallery-swiper-total-slide>${images.length}</span>
            </div>
            ${IconButton('', 'data-villa-gallery-swiper-button-next', 'Big arrow right')}
        </div>
        
        </div>
    </div>
  `;
  setTimeout(() => {
    const swiperContainer = document.querySelector(`#${containerId}`);
    const swiperRef = document.querySelector(`#${containerId} .swiper`);
    if (swiperRef) {
      new Swiper(swiperRef, {
        navigation: {
          nextEl: `#${containerId} [data-villa-gallery-swiper-button-next]`,
          prevEl: `#${containerId} [data-villa-gallery-swiper-button-prev]`,
        },
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 1000,
        loop: true,
        grabCursor: true,
        autoplay: {
          delay: 5000,
        },
        on: {
          slideChange: instance => {
            const currentSlide = instance.realIndex + 1;
            const $currentSlide = swiperContainer.querySelector(
              '[data-villa-gallery-swiper-current-slide]',
            );
            $currentSlide.textContent = currentSlide;
          },
        },
      });
    } else {
      console.warn(`Swiper container not found for ID: ${containerId}`);
    }
  }, 0);
  return galleryHtml;
}
