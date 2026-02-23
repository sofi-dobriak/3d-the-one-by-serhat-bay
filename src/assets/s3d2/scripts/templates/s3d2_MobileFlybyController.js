import s3d2_SpinNav from './s3d2_SpinNav';
import s3d2_Dropdown from './common/s3d2_Dropdown';
import s3d2_IconButton from './common/s3d2_IconButton';
import {
  defineFlybyDropdownData,
  FLYBY_DROPDOWN_ATTRIBUTES,
} from '../templates/header/s3d2_navBar.js';

export default function s3d2_MobileFlybyController(i18n, config) {
  const dataForFlybyDropdown = defineFlybyDropdownData(config, undefined, i18n);

  window.addEventListener('updateFsm', evt => {
    const buttons = document.querySelectorAll('[data-s3d2-update-content-btn]');
    const type = evt.detail.type; 
    let title = '';
    if (evt.detail.type != 'flyby') {
        title = i18n.t('ctr.nav.' + type);
    } else {
      title = i18n.t('ctr.nav.' + "flyby" + '_' + evt.detail.flyby + '_' + evt.detail.side);
    }
    buttons.forEach(button => {
      button.querySelector('span').textContent = title;
    });
  });

  return `
    <div class="s3d2-mobile-flyby">
      ${s3d2_IconButton(
        's3d2-mobile-flyby__button js-toggle-button',
        i18n.t('ctr.nav.fisher_island'),
        'data-icon-open="Tiny chevron down" data-icon-closed="close" data-s3d2-update-content-btn',
        'Tiny chevron down',
      )}

      <div class="s3d2-mobile-flyby__content js-mobile-flyby-content">

        <div class="s3d2-mobile-flyby__content__first-block">
          ${s3d2_IconButton(
            'js-s3d-nav__btn',
            i18n.t('ctr.nav.availability'),
            'data-type="plannings" data-s3d2-header-plannings',
            '',
          )}
          ${s3d2_IconButton(
            'js-s3d-nav__btn',
            i18n.t('ctr.nav.level'),
            'data-type="floor" data-header-floor-plan-group',
            '',
          )}
        </div>

        <div class="s3d2-mobile-flyby__content__second-block">
          ${s3d2_IconButton(
            's3d2-IconButton--dark js-s3d-nav__btn',
            i18n.t('ctr.nav.fisher_island'),
            'data-type="flyby" data-flyby="1" data-side="outside"',
            '',
          )}
          ${dataForFlybyDropdown
          .map(item => {
            return `<button ${item.attributes}  class="s3d2-Dropdown__item ${item.className}">${item.title}</button>`;
          })
          .join('')}
          <!--${s3d2_Dropdown(
            dataForFlybyDropdown,
            i18n.t('ctr.nav.flat'),
            'Tiny chevron right',
            FLYBY_DROPDOWN_ATTRIBUTES,
            'js-s3d-nav__btn',
          )}
          ${s3d2_Dropdown(
            dataForFlybyDropdown,
            `${i18n.t('ctr.nav.flat')} 7 page`,
            'Tiny chevron right',
            FLYBY_DROPDOWN_ATTRIBUTES,
            'js-s3d-nav__btn',
          )}-->
        </div>
    </div>
    ${s3d2_SpinNav(i18n)}
  `;
}



function toggleMobileMenuIcon(button) {
  const iconUse = button.querySelector('.s3d2-IconButton use');
  const content = document.querySelector('.js-mobile-flyby-content');

  if (!iconUse || !content) return;

  const iconOpenName = button.getAttribute('data-icon-open');
  const iconClosedName = button.getAttribute('data-icon-closed');

  const isOpen = content.classList.contains('is-open');

  const newIconName = isOpen ? iconOpenName : iconClosedName;

  // encodeURIComponent, щоб обробити пробіли в імені іконки 'Tiny chevron down'
  const newHref = `#icon-${encodeURIComponent(newIconName)}`;

  iconUse.setAttribute('href', newHref);
  iconUse.setAttribute('xlink:href', newHref);

  content.classList.toggle('is-open', !isOpen);
  button.classList.toggle('is-active', !isOpen);
}

export function initMobileFlybyListeners() {
  const button = document.querySelector('.js-toggle-button');

  if (button) {
    button.addEventListener('click', () => toggleMobileMenuIcon(button));

    const content = document.querySelector('.js-mobile-flyby-content');
    if (content) {
      content.classList.remove('is-open');
    }
  }
}
  