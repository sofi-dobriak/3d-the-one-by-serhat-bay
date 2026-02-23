import get from 'lodash/get';
import ButtonWithoutIcon from '../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';
import $closeBtn from './$closeBtn';
import {
  isMobile,
  isTablet,
  isDesktop,
  isNotDesktopTouchMode,
  numberWithCommas,
} from '../../../../../s3d2/scripts/helpers/helpers_s3d2';
import s3d2spriteIcon from '../../../../../s3d2/scripts/templates/spriteIcon';

function Floor(i18n, data) {
  const { floor, count, free, build, section, async_data, properties, show_prices } = data;
  const currency = i18n.t(`currency_label`);

  const floorImageUrlNotFormated = get(async_data, 'url', false);
  const defaultModulePath = '/wp-content/themes/3d/assets';
  const floorImageUrl = `${defaultModulePath}${floorImageUrlNotFormated}`;

  window.addEventListener(
    'floor-cached',
    event => {
      if (
        event.detail.floor == floor &&
        event.detail.build == build &&
        event.detail.section == section
      ) {
        const fullImageUrl = `${defaultModulePath}${event.detail.response.url}`;
        document.querySelector('.s3d-infoBox__flat__image-wrapper img').src = fullImageUrl;
        document.querySelector('.s3d-infoBox__flat__image-wrapper').style.display = '';
      }
    },
    {
      once: true,
    },
  );

  const $floorImage = `
    <div class="s3d-infoBox__flat__image-wrapper" ${!floorImageUrl ? ' style="display:none" ' : ''}>
      <div class="s3d-infoBox__image">
        <img src="${floorImageUrl}" class="object-fit-contain-important"/>
      </div>
    </div>
  `;

  const $price =
    show_prices && properties._price
      ? `
    <div class="fonts-3d-h1 s3d-infoBox__title">
      ${
        currency === '$'
          ? `${i18n.t(`currency_label`, '')} ${numberWithCommas(properties._price.value_raw)}`
          : `${numberWithCommas(properties._price.value_raw)} ${i18n.t(`currency_label`, '')}`
      }
    </div>
  `
      : '';
  const $price_m2 =
    show_prices && properties.price_m2
      ? `
    <div class="s3d-infoBox__flat__block" style="margin-top: 8px; margin-bottom:4px;">
      <div class="s3d-infoBox__flat__alert-title" style="margin-bottom: 0px">
        ${
          currency === '$'
            ? `
            ${i18n.t(`currency_label`, '')}
            ${numberWithCommas(properties.price_m2.value_raw)}
            ${i18n.t(`Flat.information.per`, '')}
            ${i18n.t(`area_unit`, '')}
            `
            : `
            ${numberWithCommas(properties.price_m2.value_raw)}
            ${i18n.t(`currency_label`, '')}
            ${i18n.t(`Flat.information.per`, '')}
            ${i18n.t(`area_unit`, '')}
          `
        }
      </div>
    </div>
  `
      : '';

  const buttonHtml =
    isDesktop() && isNotDesktopTouchMode()
      ? ''
      : `
      <div style="margin-top: 20px;">
          ${ButtonWithoutIcon(
            '',
            `data-s3d-event="transform" data-type="floor" data-section="${section}" data-build="${build}" data-floor="${floor}"`,
            i18n.t('Floor.information.reviewFloor'),
            'secondary',
          )}
      </div>
  `;

  return `
    <div class="s3d-infoBox__flat">
        <div class="s3d-infoBox__flat__alert-header">
          <div>
            <div class="s3d-infoBox__flat__alert s3d-infoBox__flat__alert--with-icon" data-s3d-update="sale"  data-sale="1">
              ${i18n.t('Floor.information.free-flats--')} ${free}
              ${s3d2spriteIcon('Info', 's3d-infoBox__status-icon')}
            </div>
          </div>
          ${$closeBtn()}
        </div>
        <div class="s3d-infoBox__flat__alert__middle">
          ${floor} ${i18n.t('Flat.information.floor')}
        </div>
        ${$floorImage}
        <div class="s3d-infoBox__flat-bottom">
          ${
            $price || $price_m2
              ? `<div class="s3d-infoBox__flat__alert-title">
            ${i18n.t('Floor.information.from')}
          </div>`
              : ''
          }
          ${$price}
          ${$price_m2}
          <div class="s3d-infoBox__info">
            <div class="s3d-infoBox__flat__wrapper-label" style="margin-top: 0px">
              <div class="s3d-infoBox__flat__label">
                ${i18n.t('Floor.information.build')}: ${build}
              </div>
              <div class="s3d-infoBox__flat__label">
                ${i18n.t('Floor.information.all-flats')}: ${count}
              </div>
            </div>
          </div>
            ${buttonHtml}
          </div>
        </div>
      </div>
  `;
}

export default Floor;
