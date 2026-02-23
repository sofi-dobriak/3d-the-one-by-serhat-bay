import get from 'lodash/get';
import ButtonWithoutIcon from '../../../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';
import ButtonIconLeft from '../../../../../../../s3d2/scripts/templates/common/ButtonIconLeft';
import { $highlightSvgElements } from '../../../controller/$highlightSvgElements';
import { numberWithCommas } from '../../../../../../../s3d2/scripts/helpers/helpers_s3d2';
export default function s3dVillaFloorPlanings(i18n, flat) {
  const $floorButtons = () => {
    //прибрати flat.level = 2
    if (flat.level < 2) {
      return '';
    }
    const $buttons = [];
    for (let i = 1; i <= +flat.level; i++) {
      const buttonClass = i === 1 ? 'active' : '';
      if (!get(flat, `flat_levels_photo.${i}`)) {
        $buttons.push(' ');
        continue;
      }
      $buttons.push(
        ButtonWithoutIcon(
          `${buttonClass}`,
          `data-flat-explication-button="floor" data-value="${i}"`,
          i18n.t(`Flat.explication_data.floor_${i}`),
        ),
      );
    }
    const $buttonsFinal = $buttons.filter(el => el && el.length > 2);
    return $buttons.filter(el => el && el.length > 2).length > 1 ? $buttonsFinal.join('') : '';
  };
  const hasFlat2dAnd3dPlansOnLevel =
    flat.level !== 1 && Object.keys(get(flat, 'flat_levels_photo.1', {})).length > 1;
  return `
        <div class="s3d-villa__floor-explication-screen">
            <div class="s3d-villa__floor-explication-screen-buttons--floor">${$floorButtons()}</div>
            <div class="s3d-villa__floor-explication-screen-slider swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="s3d-villa__floor-explication-screen-slide">
                            <img src="${flat['img_big']}" data-flat-explication-image />
                        </div>
                    </div>
                </div>
                <div class="s3d-villa__floor-explication-screen-buttons--slider">
                  <div class="s3d-villa__floor-explication-screen-buttons--planning3d">
                    ${
                      hasFlat2dAnd3dPlansOnLevel
                        ? ButtonWithoutIcon(
                            '',
                            'data-flat-explication-button="type"  data-value="2d"',
                            i18n.t(`Flat.buttons.planning3d`),
                          )
                        : ''
                    }
                    ${
                      hasFlat2dAnd3dPlansOnLevel
                        ? ButtonWithoutIcon(
                            'active',
                            'data-flat-explication-button="type" data-value="3d"',
                            i18n.t(`Flat.buttons.planning2d`),
                          )
                        : ''
                    }
                  </div>

                  <div class="s3d-villa__floor-explication-screen-buttons--furnished">

                    ${$highlightSvgElements(
                      i18n,
                      `data-flat-explication-furnished`,
                      'flat-explication-furnished',
                      i18n.t(`Flat.buttons.furnished`),
                    )}
                  </div>
              </div>
            </div>
            <div class="s3d-villa__floor-explication-screen-table">
              <div class="s3d-villa__floor-explication-screen-table-inner">
                <div class="s3d-villa__floor-explication-screen-table__title" data-flat-explication-title> 1st floor </div>
                <div class="s3d-villa__floor-explication-screen-info ">
                    <div class="s3d-villa__floor-explication-screen-info-row  ">
                        <div class="s3d-villa__floor-explication-screen-info-row-title">
                            ${i18n.t('Flat.information.allArea')}:
                        </div>
                        <div class="s3d-villa__floor-explication-screen-info-row-blank">
                        </div>

                        <div class="s3d-villa__floor-explication-screen-info-row-value">
                            ${numberWithCommas(flat.area)} ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d-villa__floor-explication-screen-info-row  ">
                        <div class="s3d-villa__floor-explication-screen-info-row-title">
                            ${i18n.t('Flat.information.life_area')}:
                        </div>
                        <div class="s3d-villa__floor-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d-villa__floor-explication-screen-info-row-value">
                            ${numberWithCommas(flat.life_room)} ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d-villa__floor-explication-screen-info-row  ">
                        <div class="s3d-villa__floor-explication-screen-info-row-title">
                            ${i18n.t('Flat.information.exterior_area')}:
                        </div>
                        <div class="s3d-villa__floor-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d-villa__floor-explication-screen-info-row-value">
                            ${numberWithCommas(flat.exterior_area)} ${i18n.t('area_unit')}
                        </div>
                    </div>
                </div>
                <div class="s3d-villa__floor-explication-screen-info" data-villa-explication-floor-properties-container>
                    <div class="s3d-villa__floor-explication-screen-info-row">
                        <div class="s3d-villa__floor-explication-screen-info-row-title">Living area:</div>
                        <div class="s3d-villa__floor-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d-villa__floor-explication-screen-info-row-value">
                            ${flat.life_room} ${i18n.t('area_unit')}
                        </div>
                    </div>
                </div>
              </div>


            </div>

           
        </div>
    `;
}
