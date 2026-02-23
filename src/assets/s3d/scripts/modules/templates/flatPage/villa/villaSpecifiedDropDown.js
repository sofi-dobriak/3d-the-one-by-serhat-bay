import i18next from 'i18next';
function generateButton(el, flat, i18n) {
  return `
       <button class="s3d2-ButtonIconLeft" data-show-flat-in-flyby
        data-side="${el.side}"
        data-control-point="${el.controlPoint}"
        data-flyby="${el.flyby}"
        data-type="flyby"
        change="true"
        data-flatid="${flat.id}">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4 5.75V6.3315V18.25L11.5001 22.7031L12.0001 23L12.5001 22.7031L20 18.25V6.33149V5.75L19.5103 5.45925L12.0001 1L4.48968 5.45926L4 5.75ZM5 6.92526V17.6808L11.5001 21.5401L11.4999 10.7846L5 6.92526ZM12.4999 10.7846L12.5001 21.5401L19 17.6808V6.92523L12.4999 10.7846ZM18.531 6.04074L12.0001 2.16299L5.46903 6.04076L11.9999 9.91851L18.531 6.04074Z" fill="#1A1E21"/>
        </svg>
        <span>${i18n?.t('Flat.buttons.showIn3d') || 'Show in 3D'}</span>
      </button>
    `;
}

export default function generateButtonGroup(groupName, flybyList, flat, i18n) {
  const firstFlyby = flybyList.find(() => true);
  return firstFlyby ? generateButton(firstFlyby, flat, i18n) : '';
}
