import FlatDocCard from '../../../../../../../s3d2/scripts/templates/flat/FlatDocCard';
import Swiper, { Navigation } from 'swiper';

Swiper.use([Navigation]);

/**
 * Renders the documentation screen for a flat, including a Swiper instance
 * for project documentation cards.
 *
 * @param {object} i18n - Localization object for translations.
 * @param {Array} projectDocs - List of project documentation objects.
 * @returns {string} - HTML markup for the documentation screen.
 */
export default function FlatDocumentationScreen(i18n, projectDocs) {
  if (!projectDocs.length) {
    return '';
  }

  const containerId = `flat-doc-swiper-${Date.now()}`;

  // Generate HTML markup.
  const html = `
    <div class="s3d-villa__documentation-screen">
        <div class="s3d-villa__floor__title-wrap">
            <div class="s3d-villa__floor__title-wrap__line"></div>
            <span class="s3d-villa__floor__title"> ${i18n.t('Flat.doc_title')}</span>
            <div class="s3d-villa__floor__title-wrap__line"></div>
        </div>
        <div id="${containerId}" class="s3d-villa__documentation-screen-swiper-container">
            <div class="swiper">
                <div class="swiper-wrapper">
                    ${projectDocs.map(doc => FlatDocCard(doc, i18n)).join('')}
                </div>
            
            </div>
            <div class="s3d-villa__documentation-swiper-nav-wrap">
                <div class="s3d-villa__documentation-swiper-button-prev swiper-button-prev">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.90658 12.5062L12.7036 17.3055L11.9963 18.0124L6.34625 12.3597L5.99294 12.0062L6.34625 11.6527L11.9963 6L12.7036 6.70694L7.90658 11.5062H18V12.5062H7.90658Z" fill="#1A1E21"/>
                    </svg>
                </div>
                <div class="s3d-villa__documentation-swiper-button-next swiper-button-next">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0864 12.6763L11.2932 17.4696L12.0003 18.1767L17.647 12.5298L18.0005 12.1763L17.647 11.8227L12.0003 6.17578L11.2932 6.88288L16.0864 11.6763H6V12.6763H16.0864Z" fill="#1A1E21"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
  `;

  setTimeout(() => {
    const swiperContainer = document.querySelector(`#${containerId} .swiper`);
    if (swiperContainer) {
      new Swiper(swiperContainer, {
        navigation: {
          nextEl: `#${containerId} .s3d-villa__documentation-swiper-button-next`,
          prevEl: `#${containerId} .s3d-villa__documentation-swiper-button-prev`,
        },
        slidesPerView: 4,
        spaceBetween: 40,
        speed: 1000,
        loop: false,
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1366: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
          1920: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        },
      });
    } else {
      console.warn(`Swiper container not found for ID: ${containerId}`);
    }
  }, 0);

  return html;
}
