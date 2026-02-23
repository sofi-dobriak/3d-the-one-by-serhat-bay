import { isTouchDevice } from '../../../../../../../s3d2/scripts/helpers/helpers_s3d2';
import ButtonWithoutIcon from '../../../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';

export default function VirtualTour(i18n, flat) {
  // const isTouch = isTouchDevice();
  const isTouch = true;
  if (!window.s3dVirtualTourOverlayHanderInited && isTouch) {
    document.body.addEventListener(
      'click',
      e => {
        const target = e.target.closest('[data-mobile-room-tour]');
        if (!target) {
          return;
        }
        const type = target.getAttribute('data-mobile-room-tour');
        const overlay = document.querySelector('.s3d-villa__virtual-tour-iframe-wrap-overlay');

        document.querySelectorAll('[data-mobile-room-tour]').forEach(el => {
          el.style.display = type === el.getAttribute('data-mobile-room-tour') ? 'none' : '';
        });
        overlay.style.display = type === 'open' ? 'none' : '';
      },
      true,
    );
    window.s3dVirtualTourOverlayHanderInited = true;
  }

  return `
        <div class="s3d-villa__virtual-tour-wrap" style="padding-top: 0;">
            <!--<div class="s3d-villa__floor__title-wrap">
                <div class="s3d-villa__floor__title-wrap__line"></div>
                <span class="s3d-villa__floor__title"> ${i18n.t('Flat.virtual_tour')}</span>
                <div class="s3d-villa__floor__title-wrap__line"></div>
            </div>-->
            <div class="s3d-villa__virtual-tour-iframe-wrap">
                <iframe src="${
                  flat['3d_tour']
                }" loading="lazy" allowfullscreen allow="accelerometer; gyroscope"></iframe>
                ${
                  isTouch
                    ? `<div class="s3d-villa__virtual-tour-iframe-wrap-overlay">
                </div>`
                    : ''
                }
                ${
                  isTouch
                    ? `<div class="s3d-villa__virtual-tour-iframe-wrap-menu">
                    ${ButtonWithoutIcon(
                      's3d2-ButtonIconLeft s3d2-ButtonIconLeft--secondary s3d-villa__virtual-tour-iframe-wrap-close',
                      'data-mobile-room-tour="open"',
                      i18n.t('Flat.virtual_tour_open'),
                    )}
                    ${ButtonWithoutIcon(
                      's3d2-ButtonIconLeft s3d2-ButtonIconLeft--secondary s3d-villa__virtual-tour-iframe-wrap-close',
                      'data-mobile-room-tour="close" style="display: none"',
                      i18n.t('Flat.virtual_tour_close'),
                    )}
                </div>`
                    : ''
                }

            </div>
        </div>


    `;
}
