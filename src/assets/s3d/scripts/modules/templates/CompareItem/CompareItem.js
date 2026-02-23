/**
 * Renders a compare item component.
 *
 * @param {Object} options - The options for the compare item.
 * @param {Object} options.i18n - The internationalization object.
 * @param {string} options.id - The ID of the compare item.
 * @param {Object} options.flat - The flat object to display in the compare item.
 * @param {Array} options.propertiesToShow - The properties to show in the compare item.
 * @returns {string} The HTML string representing the compare item component.
 */
import get from 'lodash/get';
import ButtonWithoutIcon from '../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';
import s3d2spriteIcon from '../../../../../s3d2/scripts/templates/spriteIcon';
import { TOOLTIP_ATTRIBUTE } from '../../../../../s3d2/scripts/constants';

export default function CompareItem({ i18n, id, flat, propertiesToShow = [] }) {
  const $status = (i18n, flat) => {
    const tooltipAttributes =
      flat.sale == 1 ? `${TOOLTIP_ATTRIBUTE}="${i18n.t('unit_statuses.1_tooltip')}"` : '';
    return `
       <div class="s3d-card__status s3d-card__image-info" data-sale='${
         flat.sale
       }' ${tooltipAttributes}>
          ${i18n.t(`unit_statuses.${flat.sale}`)}
          ${s3d2spriteIcon('Info', 's3d-card__status-icon')}
        </div>
    `;
  };

  return `
    <div class="CompareItem" data-compare-item="${id}"  data-id="${id}">
      ${s3d2spriteIcon('close', 'CompareItem__close', 'data-compare-item-close')}
      <div class="CompareItem__img">
        <img src="${flat['img_big']}" onerror="this.style.opacity = 0">
      </div>
      <div class="CompareItem__table">
        ${propertiesToShow
          .map(({ keyPath, hide, valueFormat = e => e, title }) => {
            if (hide) return '';
            const value = get(flat, keyPath, undefined);
            if (value === undefined)
              return `
            <div class="CompareItem__table-row">
              <div class="CompareItem__table-cell">
                <span class="text-style-3-d-fonts-1920-body-regular">&nbsp;</span>
              </div>
            </div>
            `;
            return `
            <div class="CompareItem__table-row">
              <div class="CompareItem__table-cell">
                <span class="CompareItem__table-title text-style-3-d-fonts-1920-body-regular">${title}:</span>
                <span class="CompareItem__table-value text-style-3-d-fonts-1920-body-regular">${
                  keyPath === 'sale' ? $status(i18n, flat) : valueFormat(value)
                } </span>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
      ${ButtonWithoutIcon(
        'CompareItem__link s3d2-ButtonIconLeft s3d2-ButtonIconLeft--light',
        `data-compare-item-open="${id}" data-id="${id}"`,
        i18n.t('Flat.goToFlat'),
        'secondary',
      )}
    </div>
  `;
}
