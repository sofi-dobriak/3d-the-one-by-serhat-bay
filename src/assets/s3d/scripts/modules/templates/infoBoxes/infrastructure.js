import { deviceType, primaryInput } from 'detect-it';
import $closeBtn from './$closeBtn';
import ButtonWithoutIcon from '../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';
import s3d2spriteIcon from '../../../../../s3d2/scripts/templates/spriteIcon';
import { isDesktopTouchMode } from '../../../../../s3d2/scripts/helpers/helpers_s3d2';
import { VIDEO_FORMATS_REG_EXP } from '../../helpers/helpers';

function infrastructure(i18n, data) {

  const buttonTitles = {
    video: i18n.t('infoBox.infrastructure_button_video'),
    image: i18n.t('infoBox.infrastructure_button_image'),
    iframe: i18n.t('infoBox.infrastructure_button_iframe'),
  }

  let type = 'image';

  if (!VIDEO_FORMATS_REG_EXP.test(data.href) && !/\.(jpg$|png$|webp$|jpeg$)/i.test(data.href)) {
    type = 'iframe'
  }

  if (/\.(jpg$|png$|webp$|jpeg$)/i.test(data.href)) {
    type = 'image'
  }

  if (VIDEO_FORMATS_REG_EXP.test(data.href)) {
    type = 'video'
  }
  let fancyboxAttr = data.fancyboxCustomGallery ? `data-fancybox-custom-gallery="${data.fancyboxCustomGallery}"` : '';

  const $button =
    (data.href && primaryInput !== 'mouse' && deviceType === 'hybrid') ||
    deviceType === 'touchOnly' ||
    isDesktopTouchMode()
      ? ButtonWithoutIcon(
          'js-s3d-flat__3d-tour',
          `${data.title ? `data-title="${data.title}" ` : ''} ${
            data.text ? `data-text="${data.text}" ` : ''
          } data-href="${data.href}" ${fancyboxAttr}`,
          buttonTitles[type],
          'secondary',
        )
      : '';
  const $title = data.title
    ? `<span class="s3d-infoBox__infrastructure-title">
    ${data.title}
  </span>`
    : '';

  const $description = data.text
    ? `<span class="s3d-infoBox__infrastructure-description">
    ${data.text}
  </span>`
    : '';

  const $vrIcon = /\.(jpg$|png$|webp$|jpeg$)/i.test(data.href) 
    ? ``
    : `
      <div class="s3d-infoBox__infrastructure-vr-icon">
        ${s3d2spriteIcon('Pin 360°', '')}
      </div>
    `;

  const $img = (data.img != 'null')
    ? `<div class="s3d-infoBox__infrastructure-img">
    <img src="${data.img}">
  </div>`
    : '';
  return `
    <div class="s3d-infoBox__infrastructure" ${!data.img ? 'data-no-image' : ''}>
      ${$closeBtn()}
      
      ${$img}
      <!--${$title}-->
      ${$description}
      ${$button}
    </div>`;
}

export default infrastructure;
