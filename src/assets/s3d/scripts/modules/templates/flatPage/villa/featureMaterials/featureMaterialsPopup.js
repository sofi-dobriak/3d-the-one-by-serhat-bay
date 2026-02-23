import s3d2_SwiperButtons from '../../../../../../../s3d2/scripts/templates/common/s3d2_SwiperButtons';
import Swiper from 'swiper';

export default class featureMaterialsPopup {
  constructor(props) {
    this._id = `materials-popup-${(Math.random() * 1000).toFixed(0)}`;
    this.modalManager = props.modalManager;
    this.inited = false;
    this.config = props.config;
    this.i18n = props.i18n;
    this.init();
  }

  init() {
    if (!this.inited) {
      document.body.insertAdjacentHTML('beforeend', this.getTemplate());

      document.addEventListener('click', evt => {
        const materialsCard = evt.target.closest('[data-open-materials]');

        if (materialsCard) {
          const materialIndex = materialsCard.dataset.materialIndex;
          this.open(materialIndex);
        }

        if (
          evt.target.closest('[data-materials-layout-close]') ||
          evt.target.classList.contains('materials-layout')
        ) {
          this.close();
        }
      });

      if (this.modalManager.push) {
        this.modalManager.push({ id: this._id, close: () => this.close() });
      }
      this.inited = true;
    }
  }

  initSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }

    const swiperEl = document.querySelector(`#${this._id} .swiper`);
    if (swiperEl) {
      this.swiper = new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 0,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: '.materials-popup-swiper-button-next',
          prevEl: '.materials-popup-swiper-button-prev',
        },
        on: {
          slideChange: slide => {
            const counter = swiperEl.querySelector('.current');
            if (counter) counter.textContent = slide.realIndex + 1;
          },
        },
      });
    }
  }

  open(materialIndex) {
    const el = document.querySelector(`#${this._id}`);
    if (el) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';

      this.updateContent(materialIndex);

      if (this.modalManager.open) {
        this.modalManager.open(this._id);
      }
    }
  }

  close() {
    const el = document.querySelector(`#${this._id}`);
    if (el) {
      el.style.visibility = '';
      el.style.opacity = '';
    }
  }

  updateContent(materialIndex) {
    const materials = this.config?.flat?.materials_list || [];
    const lang = this.i18n.language || 'en';
    const material = materials[parseInt(materialIndex)];

    if (!material) {
      console.error('Material not found for index:', materialIndex);
      return;
    }

    const title = material.title[lang] || material.title['en'] || [];
    const description = material.description[lang] || material.description['en'] || [];
    const tags = material.tags[lang] || material.tags['en'] || [];
    const image = material.image || '';
    const videoLink = material.videoLink || '#';
    const gallery = material.gallery || [];

    const contentEl = document.querySelector(`#${this._id} .materials-content-block`);
    if (contentEl) {
      const paginationHtml = `
        <div class="navigation-buttons__button materials-popup-swiper-pagination">
          <span class="current">1</span> / <span>${gallery.length || 1}</span>
        </div>
      `;

      contentEl.innerHTML = `
      <div class="materials-popup__content">
        <div class="materials-popup__images-block">
          <div class="swiper">
            <div class="swiper-wrapper">
              ${
                gallery.length > 0
                  ? gallery
                      .map(
                        img =>
                          `<div class="swiper-slide">
                        <img src="${img}" alt="${title}" class="materials-popup__images-block__image" />
                      </div>`,
                      )
                      .join('')
                  : `<div class="swiper-slide">
                        <img src="${image}" alt="${title}" class="materials-popup__images-block__image" />
                      </div>`
              }
            </div>
            ${s3d2_SwiperButtons({
              className: 'materials-popup-nav-buttons',
              classNamePrev: 'materials-popup-swiper-button-prev',
              classNameNext: 'materials-popup-swiper-button-next',
              content: paginationHtml,
            })}
          </div>
        </div>
        <div class="materials-popup__text-content">
          <h2 class="materials-popup__text-content__title-block">${this.i18n.t(
            'Flat.materials.title',
          )}</h2>
          <h3 class="materials-popup__text-content__title-item">${title}</h3>
          <ul class="materials-popup__text-content__tags">
            ${
              tags.length > 0
                ? tags
                    .map(
                      tag =>
                        `<li class="materials-popup__text-content__tags__tags-item"><p class="materials-popup__text-content__tags__text">${tag}</p></li>`,
                    )
                    .join('')
                : ``
            }
          </ul>
          ${
            videoLink
              ? `<a class="materials-popup__text-content__video-link" href="${videoLink}" target="_blank">
            <span>${this.i18n.t('Flat.materials.watch_video')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5C6.7535 2.5 2.50039 6.75366 2.5 12L2.5127 12.4893C2.76734 17.5086 6.91739 21.5 12 21.5L12.4893 21.4873C17.3465 21.2409 21.2409 17.3465 21.4873 12.4893L21.5 12C21.4996 6.75366 17.2465 2.5 12 2.5ZM12 3.5C16.6942 3.5 20.4996 7.30587 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5L11.5625 20.4893C7.2163 20.2689 3.73109 16.7837 3.51074 12.4375L3.5 12C3.50038 7.30587 7.30585 3.5 12 3.5ZM10.9082 8.86133C10.5225 8.66878 10.0647 8.67514 9.68457 8.88086C9.30088 9.08885 9.04599 9.47685 9.0459 9.92578V14.0771L9.05762 14.2422C9.11174 14.6191 9.34889 14.9365 9.68164 15.1182C9.8787 15.2257 10.0969 15.2803 10.3154 15.2803L10.4658 15.2715C10.6151 15.2544 10.7617 15.2112 10.8994 15.1436L15.0889 13.0869V13.0859C15.4408 12.9128 15.6992 12.5859 15.7598 12.1953L15.7734 12.0234C15.7751 11.5582 15.4985 11.156 15.0967 10.9551L10.9082 8.86133ZM10.1611 9.75977C10.2527 9.71037 10.3654 9.70827 10.4609 9.75586L14.6494 11.8496C14.7431 11.8964 14.7735 11.9688 14.7734 12.0195L14.7666 12.0605C14.7534 12.1045 14.7183 12.1536 14.6475 12.1885L10.459 14.2461V14.2471C10.4132 14.2695 10.3639 14.2803 10.3154 14.2803L10.2354 14.2705C10.2095 14.2639 10.184 14.2542 10.1602 14.2412C10.094 14.2051 10.0633 14.159 10.0518 14.1172L10.0459 14.0771V9.92578C10.046 9.87345 10.073 9.80755 10.1611 9.75977Z" fill="var(--s3d2-color-text-gray-200)"/>
            </svg>
          </a>`
              : ``
          }

          <div class="materials-popup__text-content__description-block">
          ${
            description.length > 0
              ? description
                  .map(text => `<p class="materials-popup__text-content__description">${text}</p>`)
                  .join('')
              : ``
          }
          </div>
          <button class="materials-popup__text-content__lear-more-button">
            <span>${this.i18n.t('Flat.materials.popup.lear_more')}</span>
          </button>
        </div>
      </div>
    `;

      this.initSwiper();
    }
  }

  getTemplate() {
    return `
      <div class="materials-layout materials-popup-layout" id="${this._id}">
        <div class="materials-popup materials-popup--modal materials-container">
          <svg width="24" class="materials-layout-close" data-materials-layout-close height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00008 7.29297L8.35363 7.64652L12.5001 11.793L16.6465 7.64652L17.0001 7.29297L17.7072 8.00008L17.3536 8.35363L13.2072 12.5001L17.3536 16.6465L17.7072 17.0001L17.0001 17.7072L16.6465 17.3536L12.5001 13.2072L8.35363 17.3536L8.00008 17.7072L7.29297 17.0001L7.64652 16.6465L11.793 12.5001L7.64652 8.35363L7.29297 8.00008L8.00008 7.29297Z" fill="#1A1E21"></path>
          </svg>
          <div class="materials-content-block"></div>
        </div>
      </div>
    `;
  }
}
