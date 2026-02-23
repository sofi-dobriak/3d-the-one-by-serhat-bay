import infoFloor from './$floorInfo';
import $floorFilter from './$floorFilter';
import $floorNav from './$floorNav';
import IconButton from '../../../../../s3d2/scripts/templates/common/IconButton';
import get from 'lodash/get';
import { $highlightSvgElements } from '../controller/$highlightSvgElements';
import CheckboxWithLabel from '../../../../../s3d2/scripts/templates/components/filter/CheckboxWithLabel';
import Checkbox from '../../../../../s3d2/scripts/templates/components/filter/Checkbox';
import { numberWithCommas } from '../../../../../s3d2/scripts/helpers/helpers_s3d2';

function Floor(i18n, floor, hideOverlay = false, showPrices, getFlat) {
  const isMobile = document.documentElement.classList.contains('mobile');

  const info = get(floor, 'properties', {});

  const roomsCountList = new Set(
    get(floor, 'flatsIds', []).map(flatId => {
      const flat = getFlat(flatId);
      return get(flat, 'rooms', null);
    }),
  );

  const $minValues =
    Object.entries(info).length > 0
      ? `
    <div class="s3d-floor__info-container2">
      <div class="text-style-3-d-fonts-1920-body-regular text-gray-700" style="display: ${
        showPrices ? '' : 'none'
      }">
        ${i18n.t('Floor.apps_from')}
      </div>
      ${Object.entries(info)
        .map(([key, value]) => {
          if (/price/.test(key) && !showPrices) return '';
          const formatedValToShow =
            value['type'] === 'number' ? numberWithCommas(value['value']) : value['value'];
          switch (value['size']) {
            case 'large':
              return `<div class="text-style-3-d-fonts-1920-h-1">${formatedValToShow}</div>`;
            default:
              return `<div class="text-style-3-d-fonts-1920-semi-tiny text-gray-700">
                ${i18n.t(`currency_label`, '')}
                ${value.value_raw}
                ${i18n.t(`Flat.information.per`, '')}
                ${i18n.t(`area_unit`, '')}
              </div>`;
          }
        })
        .join('')}
    </div>
  `
      : '';

  const $hideOverlay = isMobile
    ? ''
    : $highlightSvgElements(
        i18n,
        `data-highlight-floor-svg-elements ${hideOverlay ? 'checked' : ''}`,
        'highlight-floor-svg-elements',
      );

  const $navWrapperForDesktopAndTablet = `<div class="s3d-floor__nav-wrapper">
    <div class="s3d-floor__info-container__title text-style-3-d-fonts-1920-body-regular text-gray-700">
      ${i18n.t('Floor.changeFloor--')}
    </div>
    ${$floorNav(floor)}
  </div>`;

  return `
  <div class="s3d-floor ">
    <div class="s3d-floor__overlay" data-floor-overlay></div>
    ${isMobile ? $navWrapperForDesktopAndTablet : ''}
    <div class="s3d-floor__zoom-wrapper">
      ${IconButton('', 'data-floor-zoom-button-up', 'Plus')}
      ${IconButton('', 'data-floor-zoom-button-down', 'Minus')}
    </div>
    <!--<div class="s3d__title ">${i18n.t('Floor.title-1')} ${floor.floor} ${i18n.t(
    'Floor.title-2',
  )}</div>-->
    <div class="s3d-floor__menu-container">
      <div>
        <div class="s3d-floor__title text-style-3-d-fonts-1920-h-1">
         ${i18n.t('Floor.title-3')} ${floor.floor}
        </div>
        ${infoFloor(i18n, floor)}
      </div>
      ${$minValues}
      <div>
        ${isMobile ? '' : $floorFilter(i18n, roomsCountList)}
        ${
          !isMobile
            ? '<div class="s3d-floor__info-container__title text-style-3-d-fonts-1920-body-regular"></div>'
            : ''
        }
        ${$hideOverlay}
        ${
          !isMobile
            ? '<div class="s3d-floor__info-container__title text-style-3-d-fonts-1920-body-regular"></div>'
            : ''
        }
      </div>
      ${!isMobile ? $navWrapperForDesktopAndTablet : ''}

    </div>
    <div class="s3d-floor__svg-container ">
      <div class="s3d-floor__svg-container--inner">
        <div class="s3d-floor__svg-wrapper js-s3d-floor"></div>
      </div>


    </div>
  </div>
`;
}

export default Floor;
