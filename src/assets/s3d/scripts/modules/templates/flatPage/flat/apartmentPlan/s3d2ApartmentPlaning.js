import get from 'lodash/get';
import ButtonWithoutIcon from '../../../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';
import ButtonIconLeft from '../../../../../../../s3d2/scripts/templates/common/ButtonIconLeft';
import { $highlightSvgElements } from '../../../controller/$highlightSvgElements';
import { numberWithCommas } from '../../../../../../../s3d2/scripts/helpers/helpers_s3d2';
import { socialMediaIcons } from '../../../../../../../s3d2/scripts/templates/common/icons/social-media-icons';
import $s3d2GoToFloor from '../../$s3d2GoToFloor';

export default function s3d2ApartmentPlanings(i18n, flat, floorList, socialMediaLinks, contacts) {
  const $socialMediaList = Object.entries(socialMediaLinks)
    .map(([name, url]) => {
      if (!url) return '';
      return `
        <a href="${url}" class="s3d2-apartment__flat-explication-screen-socials-item" rel="noopener noreferrer" target="_blank">
            ${socialMediaIcons[name]}
        </a>
      `;
    })
    .join('');

  const $email = get(contacts, 'email');

  const $floorButtons = () => {
    const levelPhotos = get(flat, 'flat_levels_photo.1', {});
    const photoTypes = Object.keys(levelPhotos);

    // Якщо один поверх але кілька типів фото — рендеримо кнопки по типах
    if (flat.level < 2) {
      const orderedTypes = [
        'site_plan',
        'ground',
        'first_floor',
        'second_floor',
        'roof_terrace',
      ].filter(type => levelPhotos[type]); // тільки ті, що є в даних

      if (orderedTypes.length <= 1) return '';

      return orderedTypes
        .map((type, idx) => {
          const buttonClass = idx === 0 ? 'active' : '';
          return ButtonWithoutIcon(
            buttonClass,
            `data-flat-explication-button="floor" data-value="${type}" data-floor="1"`,
            i18n.t(`Flat.explication_data.floor_${idx + 1}`),
          );
        })
        .join('');
    }

    // Оригінальна логіка для кількох поверхів
    const $buttons = [];
    for (let i = 1; i <= +flat.level; i++) {
      const buttonClass = i === 1 ? 'active' : '';
      if (!get(flat, `flat_levels_photo.${i}`)) {
        $buttons.push(' ');
        continue;
      }
      $buttons.push(
        ButtonWithoutIcon(
          buttonClass,
          `data-flat-explication-button="floor" data-value="${i}"`,
          i18n.t(`Flat.explication_data.floor_${i}`),
        ),
      );
    }

    const $buttonsFinal = $buttons.filter(el => el && el.length > 2);
    return $buttonsFinal.length > 1 ? $buttonsFinal.join('') : '';
  };

  const hasFlat2dAnd3dPlansOnLevel =
    flat.level !== 1 && Object.keys(get(flat, 'flat_levels_photo.1', {})).length > 1;

  return `
      <div class="s3d2-apartment__flat-explication-screen-wrap">
        <div class="s3d2-apartment__flat-explication-screen">
            <div class="s3d2-apartment__flat-explication-screen-slider swiper-container">
                <div class="s3d2-apartment__flat-explication-screen-buttons--floor-wrap">
                  ${
                    flat.level > 1 || Object.keys(get(flat, 'flat_levels_photo.1', {})).length > 1
                      ? `
                        <div class="s3d2-apartment__flat-explication-screen-buttons--floor" data-switch-explication-floor="2">
                          ${$floorButtons()}
                        </div>`
                      : `<div class="s3d2-apartment__flat-explication-screen-buttons--floor" data-switch-explication-floor="2">
                    ${ButtonWithoutIcon(
                      'active',
                      'data-switch-explication-floor="2"',
                      i18n.t(`Flat.flatPlan`),
                    )}
                  </div>`
                  }

                  ${
                    flat.level > 1 && hasFlat2dAnd3dPlansOnLevel
                      ? `<div class="s3d2-apartment__flat-explication-screen-buttons--divider">/</div>`
                      : ''
                  }

                  <div class="s3d2-apartment__flat-explication-screen-buttons--slider" data-switch-explication-floor="2">
                    ${
                      hasFlat2dAnd3dPlansOnLevel
                        ? `
                      <div class="s3d2-apartment__flat-explication-screen-buttons--planning3d">
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
                      `
                        : ''
                    }


                      <!-- <div class="s3d2-apartment__flat-explication-screen-buttons--furnished">

                        ${$highlightSvgElements(
                          i18n,
                          `data-flat-explication-furnished`,
                          'flat-explication-furnished',
                          i18n.t(`Flat.buttons.furnished`),
                        )}
                      </div> -->
                  </div>
                  <!--<div class="s3d2-apartment__flat-explication-screen-buttons--floor" data-switch-explication-floor="1">
                    ${ButtonWithoutIcon(
                      '',
                      'data-switch-explication-floor="1"',
                      i18n.t(`Flat.goToFloor`),
                    )}
                  </div>-->
                </div>


                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="s3d2-apartment__flat-explication-screen-slide">
                            <img src="${
                              flat['img_big']
                            }" data-flat-explication-image data-container-explication-floor="2"/>
                            ${$s3d2GoToFloor(i18n, flat, floorList)}
                        </div>
                    </div>
                </div>

            </div>

            <div class="s3d2-apartment__flat-explication-screen-table">
              <span class="s3d2-apartment__flat-explication-screen-title">${i18n.t(
                'Flat.layout',
              )}</span>
              <div class="s3d2-apartment__flat-explication-screen-table-inner">
                <div class="s3d2-apartment__flat-explication-screen-table-content">
                  <div class="s3d2-apartment__flat-explication-screen-table__title"></div> <!-- data-flat-explication-title -->
                  <!-- <div class="s3d2-apartment__flat-explication-screen-info">
                      <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                          <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                              ${i18n.t('Flat.information.allArea')}:
                          </div>
                          <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                          </div>

                          <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                              ${numberWithCommas(flat.area)} ${i18n.t('area_unit')}
                          </div>
                      </div>
                      <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                          <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                              ${i18n.t('Flat.information.life_area')}:
                          </div>
                          <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                          </div>
                          <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                              ${numberWithCommas(flat.life_room)} ${i18n.t('area_unit')}
                          </div>
                      </div>
                      ${
                        flat.exterior_area
                          ? `
                            <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                              <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                                  ${i18n.t('Flat.information.exterior_area')}:
                              </div>
                              <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                              </div>
                              <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                                  ${numberWithCommas(flat.exterior_area)} ${i18n.t('area_unit')}
                              </div>
                            </div>`
                          : ''
                      }
                  </div> -->

                  <div class="s3d2-apartment__flat-explication-screen-info">
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.land')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            ~2,510 ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.building_area')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            ~890 ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.ground_floor')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            327 ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.first_floor')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            292 ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.second_floor')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            252 ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.roof_terrace')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            204 ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.terrace_outdoor')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            500 ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.entrance_parking')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            280 ${i18n.t('area_unit')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.swimming_pool')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            ~130 ${i18n.t('area_unit')}
                            ${i18n.t('Flat.explication_list.infinity_pool')}
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.jacuzzi')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            ~10 ${i18n.t('area_unit')}
                            (12 ${i18n.t('Flat.explication_list.persons')})
                        </div>
                    </div>
                    <div class="s3d2-apartment__flat-explication-screen-info-row  ">
                        <div class="s3d2-apartment__flat-explication-screen-info-row-title">
                            ${i18n.t('Flat.explication_list.additional_spaces')}:
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-blank">
                        </div>
                        <div class="s3d2-apartment__flat-explication-screen-info-row-value">
                            ${i18n.t('Flat.explication_list.office')} ·
                            ${i18n.t('Flat.explication_list.gallery')} /
                            ${i18n.t('Flat.explication_list.leisure')}
                        </div>
                    </div>
                  </div>

                  <div class="s3d2-apartment__flat-explication-screen-info" data-villa-explication-floor-properties-container>
                    <div class="s3d2-apartment__flat-explication-screen-info-row"></div>
                  </div>
                </div>



              </div>
              <button class="s3d2-ButtonIconLeft active s3d2-ButtonIconLeft--secondary text-uppercase-important s3d2-apartment__flat-explication-screen-open text-uppercase-important js-s3d__create-pdf">
                <span>${i18n.t('Flat.explication_data.open_full_plan')}</span>
              </button>
              <div class="s3d2-apartment__flat-explication-screen-socials-wrap">
                <div class="s3d2-apartment__flat-explication-screen-socials-share">
                  <span>${i18n.t('Flat.share')}:</span>
                </div>
                <div class="s3d2-apartment__flat-explication-screen-socials">
                  ${$socialMediaList}
                  <a class="s3d2-apartment__flat-explication-screen-socials-item" href="mailto:${$email}" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M4 16.5C4 17.3249 4.71979 17.9998 5.59961 18L18.4004 18C19.2802 17.9998 20 17.3249 20 16.5L20 7.5C20 7.38762 19.9853 7.27834 19.96 7.17285L12.4941 13.707C12.2115 13.9544 11.7896 13.9542 11.5068 13.707L4.03906 7.17285C4.01379 7.27827 4 7.38769 4 7.5L4 16.5ZM12 12.1455L18.9258 6.08496C18.7609 6.03073 18.5843 6.00004 18.4004 6L5.59961 6C5.41533 6.00004 5.23834 6.03054 5.07324 6.08496L12 12.1455Z" fill="none"/>
                    </svg>
                  </a>
                </div>

              </div>
            </div>

        </div>
      </div>
    `;
}
