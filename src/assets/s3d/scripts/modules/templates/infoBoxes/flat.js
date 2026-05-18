import { TOOLTIP_ATTRIBUTE } from '../../../../../s3d2/scripts/constants';
import {
  isMobile,
  isTablet,
  isDesktop,
  isNotDesktopTouchMode,
  numberWithCommas,
} from '../../../../../s3d2/scripts/helpers/helpers_s3d2';
import ButtonWithoutIcon from '../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';
import s3d2spriteIcon from '../../../../../s3d2/scripts/templates/spriteIcon';
import $closeBtn from './$closeBtn';

function Flat(i18n, data) {
  const imageDefault = `${window.defaultModulePath}/images/examples/no-image.png`;
  const {
    rooms,
    rooms_unit,
    floor,
    price,
    price_m2,
    build,
    type,
    number,
    project_deadline,
    baths,
    area,
    sale,
    id,
    show_prices,
    parking_spots,
    img_small: srcImage,
    specifiedFlybys,
    img_big: src,
  } = data;
  const $vrButton = (() => {
    const isMarked = data['3d_tour_v3'];
    if (!isMarked) return '';
    return `
      <div class="s3d-card__right-bottom-button s3d-card__right-bottom-button--vr"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128" xml:space="preserve"><path d="M128 37.94c0-6.248-6.785-11.656-19.63-15.643-11.888-3.682-27.633-5.712-44.363-5.712s-32.489 2.03-44.363 5.712C6.799 26.284 0 31.692 0 37.94v55.44h.015C0 93.452 0 93.525 0 93.597c0 7.075 8.916 13.164 25.11 17.151l2.697.667V80.042c9.772-2.247 22.138-3.682 36.201-3.682 14.077 0 26.444 1.435 36.201 3.682v31.373l2.697-.667C119.084 106.761 128 100.672 128 93.597c0-.072 0-.145-.015-.217H128V37.94zM23.457 105.819c-11.859-3.276-19.108-7.872-19.108-12.222 0-.131 0-.275.015-.406.449-4.219 7.611-8.626 19.093-11.816v24.444zm81.1 0V81.375c11.482 3.19 18.644 7.597 19.079 11.816.015.131.015.275.015.406 0 4.349-7.235 8.945-19.094 12.222zm19.094-63.341c-4.451 3.16-12.12 6.046-21.747 8.177l-1.696.377v21.862h4.349V54.511c7.945-1.87 14.425-4.219 19.093-6.901v37.636c-3.291-2.856-8.423-5.393-15.281-7.51-11.887-3.696-27.631-5.726-44.362-5.726s-32.489 2.03-44.363 5.727c-6.857 2.117-12.004 4.654-15.295 7.51V47.668c4.697 2.653 11.207 5.002 19.108 6.857v18.369h4.349V51.032l-1.711-.377c-9.51-2.088-17.238-4.973-21.747-8.09V37.94c0-8.046 24.501-17.006 59.658-17.006s59.643 8.96 59.643 17.006v4.538zm-66.978-5.859h6.137l-9.637 28.266h-5.58l-9.559-28.266h6.309l6.137 21.458 6.193-21.458zm27.77.728a6.976 6.976 0 0 1 2.646 1.975c.599.716 1.072 1.509 1.421 2.379s.524 1.86.524 2.972c0 1.344-.339 2.663-1.017 3.961-.677 1.297-1.797 2.214-3.356 2.751 1.304.525 2.228 1.27 2.771 2.234.543.966.815 2.439.815 4.42v1.899c0 1.293.052 2.168.156 2.628.156.729.52 1.266 1.091 1.611v.709h-6.52a19.771 19.771 0 0 1-.383-1.515 13.882 13.882 0 0 1-.25-2.435l-.038-2.628c-.024-1.802-.336-3.004-.934-3.605-.598-.602-1.72-.902-3.365-.902h-5.769v11.084h-5.772V36.619h13.52c1.932.038 3.42.28 4.46.728zm-12.207 4.181v7.594h6.356c1.263 0 2.21-.153 2.841-.46 1.117-.537 1.676-1.598 1.676-3.184 0-1.713-.541-2.863-1.621-3.452-.607-.331-1.518-.498-2.732-.498h-6.52z"/></svg>
      </div>
    `;
  })();
  const $showIn3dButton = (() => {
    const isMarked = Array.isArray(specifiedFlybys) && specifiedFlybys.length > 0;
    if (!isMarked) return '';
    const firstFlyby = specifiedFlybys.find(() => true);
    return `
      <div class="s3d-card__right-bottom-button"
        data-show-flat-in-flyby
        data-side="${firstFlyby.side}"
        data-control-point="${firstFlyby.controlPoint}"
        data-flyby="${firstFlyby.flyby}"
        data-type="flyby"
        change="true"
        data-flatid="${id}"
        ${TOOLTIP_ATTRIBUTE}="${i18n.t('Flat.buttons.showIn3d')}"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4 5.75V6.3315V18.25L11.5001 22.7031L12.0001 23L12.5001 22.7031L20 18.25V6.33149V5.75L19.5103 5.45925L12.0001 1L4.48968 5.45926L4 5.75ZM5 6.92526V17.6808L11.5001 21.5401L11.4999 10.7846L5 6.92526ZM12.4999 10.7846L12.5001 21.5401L19 17.6808V6.92523L12.4999 10.7846ZM18.531 6.04074L12.0001 2.16299L5.46903 6.04076L11.9999 9.91851L18.531 6.04074Z" fill="#1A1E21"></path>
        </svg>
      </div>
    `;
  })();

  const currency = i18n.t('Flat.information.priceText');

  const $status = (i18n, flat) => {
    const tooltipAttributes =
      flat.sale == 1 ? `${TOOLTIP_ATTRIBUTE}="${i18n.t('unit_statuses.1_tooltip')}"` : '';
    return `
       <div class="s3d-card__status s3d-card__image-info" data-sale='${sale}' ${tooltipAttributes}>
          ${i18n.t(`unit_statuses.${sale}`)}
          ${s3d2spriteIcon('Info', 's3d-card__status-icon')}
        </div>
    `;
  };

  const $number = (i18n, flat) => {
    return `
      <div class="s3d-card__rooms-count s3d-card__image-info">
        ${i18n.t('Flat.information.area')}: ${numberWithCommas(flat.area)} ${i18n.t(
      'Flat.information.area_unit',
    )}
      </div>
    `;
  };

  const $price = () => {
    if (!show_prices) return '';
    if (currency.trim() == '$') {
      return `
        <div class="s3d-card__price">
          ${i18n.t('Flat.information.priceText')} ${numberWithCommas(price)}
        </div>
      `;
    }
    return `
      <div class="s3d-card__price">
        ${numberWithCommas(price)} ${i18n.t('Flat.information.priceText')}
      </div>
    `;
  };

  const $priceM2 = () => {
    if (!show_prices) return '';
    if (currency.trim() == '$') {
      return `
        <div class="s3d-card__row">
          <div class="s3d-card__name">
            ${i18n.t('Flat.information.priceText')}
            ${price_m2}
            ${i18n.t('Flat.information.per')}
            ${i18n.t('Flat.information.area_unit')}
          </div>
        </div>
      `;
    }
    return `
      <div class="s3d-card__row">
        <div class="s3d-card__name">
          ${price_m2}
          ${i18n.t('Flat.information.priceText')}
          ${i18n.t('Flat.information.per')}
          ${i18n.t('Flat.information.area_unit')}
        </div>
      </div>
    `;
  };

  return `
    ${
      isMobile() || isTablet()
        ? `
            <div class="s3d-infoBox__flat-overlay" data-s3d-event="closed"></div>
          `
        : ''
    }
    <div class=" s3d-card s3d2-infobox js-s3d-card" data-id="${id}" data-key="id" data-sale="${sale}">
      <!--<div class="s3d-card__header">
        <div class="left">

          ${
            project_deadline
              ? `
            <div class="s3d-card__badge">
              ${project_deadline}
              ${s3d2spriteIcon('Construction', 's3d-card__badge-icon')}
            </div>
            `
              : ''
          }
        </div>
        <div class="right">

        </div>

       ${$number(i18n, data)}
      </div>-->
      <div class="s3d-card__middle">
        <div class="s3d-card__flat-title">${i18n.t('ctr.nav.villa')} ${number}</div>

        <div class="s3d-card__flat-area">${area} ${i18n.t('Flat.information.area_unit')}</div>
        ${isDesktop() ? '' : $closeBtn()}
        <!-- <div>${area} м²</div> -->
      </div>
      <div class="s3d-card__image">
        ${$status(i18n, data)}
        ${$price()}
        <img src="${src ||
          imageDefault}" onerror="this.src='${imageDefault}'" data-key="src" loading="lazy">
      </div>
      <div class="s3d-card__info-wrapper">
        <div class="s3d-card__info-label-wrapper">
          <div class="s3d-card__info-label">
            ${rooms} Beds
          </div>
          <div class="s3d-card__info-label">

           ${baths} Baths
          </div>
        </div>
        <!-- <div class="s3d-card__buttons">
            ${ButtonWithoutIcon('js-s3d-card__link', '', i18n.t('Flat.goToFlat'), 'secondary')}
        </div> -->
        ${$vrButton}
      </div>


   </div>`;
}

export default Flat;
