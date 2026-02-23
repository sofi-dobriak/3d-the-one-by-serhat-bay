import $closeBtn from './$closeBtn';
import { isMobile, isTablet } from '../../../../../s3d2/scripts/helpers/helpers_s3d2';

function sold(i18n, data) {
  return `
    ${
      isMobile() || isTablet()
        ? `<div class="s3d-infoBox__flat-overlay" data-s3d-event="closed"></div>`
        : ''
    }
    <div class="s3d-infoBox__sold">
      ${$closeBtn()}
      <span class="s3d-infoBox__title">
        ${i18n.t('infoBox.sold_short')}
      </span>
    </div>`;
}

export default sold;
