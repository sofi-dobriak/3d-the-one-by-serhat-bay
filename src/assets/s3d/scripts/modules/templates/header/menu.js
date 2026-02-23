import smarto from '../$smarto-logo';

function menu(i18n, config = {}) {
  return `
    <div class="s3d2-menu-wrap" data-menu data-disable-page-scroll>
      <div class="s3d2-menu-header-close" data-menu-close>
        <div class="s3d2-menu-header-close-elem-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00008 7.29286L8.35363 7.64642L12.5001 11.7929L16.6465 7.64642L17.0001 7.29286L17.7072 7.99997L17.3536 8.35352L13.2072 12.5L17.3536 16.6464L17.7072 17L17.0001 17.7071L16.6465 17.3535L12.5001 13.2071L8.35363 17.3535L8.00008 17.7071L7.29297 17L7.64652 16.6464L11.793 12.5L7.64652 8.35352L7.29297 7.99997L8.00008 7.29286Z" fill="var(--s3d2-color-icon-gray-900)"/>
          </svg>

        </div>
      </div>
      <div class="s3d2-menu-img">
        <img src="${config.menu_top_img}" alt="Mansion on Fisher" />
      </div>
      <div class="s3d2-menu-nav-wrap">
        <div class="s3d2-menu-nav">
          <ul>
            <li class="s3d2-menu-nav-link">
              <div class="js-s3d-nav__btn" data-type="intro" ddata-title="Home" data-menu-close>
                <!--<svg data-v-a51d3662="" data-v-e742a666="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" role="presentation" class="icon app-menu-item__icon"><g data-v-a51d3662="" class="stroke no-fill" style="stroke-width: 2.08333;"><path d="M10 18.9995H9.00002C7.90003 18.9995 7.00003 19.8995 7.00003 20.9995V23.9995H12V20.9995C12 19.8995 11.1 18.9995 10 18.9995Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.00011 1H17V23.9998H2.00011V1Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 7H23V23.9999H17V7Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 6H6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 10H6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 14H6" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>-->
                <svg class="app-menu-item__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#4b535b"  width="18" height="18" viewBox="0 0 495.398 495.398">
                  <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391     v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158     c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747     c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"/>
                  <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401     c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79     c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"/>
                </svg>
                <span>${i18n.t('asideMenu.home')}</span>
              </div>
            </li>
            <li class="s3d2-menu-nav-link">
              <div class="js-s3d-nav__btn" data-type="flyby" data-flyby="1" data-side="outside" data-title="${i18n.t(
                'ctr.nav.genplan',
              )}" data-menu-close>
                <svg data-v-a51d3662="" data-v-e742a666="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" role="presentation" class="icon app-menu-item__icon"><g data-v-a51d3662="" class="stroke no-fill" style="stroke-width: 2.08333;"><path d="M10 18.9995H9.00002C7.90003 18.9995 7.00003 19.8995 7.00003 20.9995V23.9995H12V20.9995C12 19.8995 11.1 18.9995 10 18.9995Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.00011 1H17V23.9998H2.00011V1Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 7H23V23.9999H17V7Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 6H6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 10H6" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 14H6" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
                <span>${i18n.t('asideMenu.building_overview')}</span>
              </div>
            </li>
            <li class="s3d2-menu-nav-link">
              <div class="js-s3d-nav__btn" data-type="plannings" data-title="${i18n.t(
                'asideMenu.plannings',
              )}" data-menu-close>
                <svg data-v-a51d3662="" data-v-7d94f7cc="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" role="presentation" class="icon button-icon__icon"><g data-v-a51d3662="" class="fill no-stroke" style="stroke-width: 2.08333;"><path stroke="none" fill="var(--text-gray-800)" d="M3.125 11.4583H11.4583V3.125H3.125V11.4583ZM5.20833 5.20833H9.375V9.375H5.20833V5.20833ZM3.125 21.875H11.4583V13.5417H3.125V21.875ZM5.20833 15.625H9.375V19.7917H5.20833V15.625ZM13.5417 3.125V11.4583H21.875V3.125H13.5417ZM19.7917 9.375H15.625V5.20833H19.7917V9.375ZM19.7917 19.7917H21.875V21.875H19.7917V19.7917ZM13.5417 13.5417H15.625V15.625H13.5417V13.5417ZM15.625 15.625H17.7083V17.7083H15.625V15.625ZM13.5417 17.7083H15.625V19.7917H13.5417V17.7083ZM15.625 19.7917H17.7083V21.875H15.625V19.7917ZM17.7083 17.7083H19.7917V19.7917H17.7083V17.7083ZM17.7083 13.5417H19.7917V15.625H17.7083V13.5417ZM19.7917 15.625H21.875V17.7083H19.7917V15.625Z"></path></g></svg>
                <span>${i18n.t('asideMenu.availability')}</span>
              </div>
            </li>
            <li class="s3d2-menu-nav-link" ${!config.menu_tour_link ? 'style="display:none;"' : ''}>
              <div class="js-s3d-flat__3d-tour" data-href="${
                config.menu_tour_link
              }" data-menu-close>
                <svg data-v-a51d3662="" stroke="none" fill="var(--text-gray-800)" data-v-e742a666="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" role="presentation" class="icon app-menu-item__icon"><g data-v-a51d3662="" class="fill no-stroke" style="stroke-width: 2.08333;">
                <path stroke="none" fill="var(--text-gray-800)" d="M15.7,19.6c-0.2,0-0.4-0.1-0.5-0.2c-0.1-0.1-0.2-0.3-0.2-0.5c0-0.2,0-0.4,0.2-0.5c0.1-0.1,0.3-0.2,0.5-0.3
                  c2.3-0.3,4.4-0.9,5.8-1.8c1.3-0.8,2.1-1.7,2.1-2.6c0-1-0.9-1.8-1.6-2.2c-0.1-0.1-0.2-0.1-0.2-0.2c-0.1-0.1-0.1-0.2-0.1-0.3
                  c0-0.1,0-0.2,0-0.3c0-0.1,0.1-0.2,0.1-0.3c0.1-0.1,0.1-0.1,0.2-0.2c0.1-0.1,0.2-0.1,0.3-0.1c0.1,0,0.2,0,0.3,0
                  c0.1,0,0.2,0.1,0.3,0.1c1.4,1,2.2,2.2,2.2,3.5c0,1.4-1,2.8-2.8,3.8C20.6,18.6,18.4,19.3,15.7,19.6C15.8,19.6,15.8,19.6,15.7,19.6z"></path>
                  <path stroke="none" fill="var(--text-gray-800)" d="M12.3,18.6l-1.9-2c-0.1-0.1-0.3-0.2-0.5-0.2c-0.2,0-0.4,0.1-0.5,0.2c-0.1,0.1-0.2,0.3-0.2,0.5
                  c0,0.2,0.1,0.4,0.2,0.5l0.6,0.6c-2.2-0.2-4.2-0.7-5.7-1.5c-1.7-0.8-2.7-1.9-2.7-2.9c0-0.9,0.7-1.8,2-2.5c0.1,0,0.2-0.1,0.2-0.2
                  C3.7,11,3.8,11,3.8,10.9c0-0.1,0-0.2,0-0.3c0-0.1,0-0.2-0.1-0.3c0-0.1-0.1-0.2-0.2-0.2C3.5,10,3.4,10,3.3,10c-0.1,0-0.2,0-0.3,0
                  c-0.1,0-0.2,0-0.3,0.1C0.5,11.4,0,12.8,0,13.8c0,1.6,1.3,3.1,3.6,4.2c1.8,0.9,4.1,1.4,6.6,1.6l-0.8,0.8c-0.1,0.1-0.2,0.3-0.2,0.5
                  c0,0.2,0.1,0.4,0.2,0.5c0.1,0.1,0.3,0.2,0.5,0.2c0.2,0,0.4-0.1,0.5-0.2l1.9-2c0.1-0.1,0.1-0.1,0.2-0.2c0-0.1,0.1-0.2,0.1-0.3
                  s0-0.2-0.1-0.3C12.4,18.7,12.4,18.6,12.3,18.6z"></path>
                  <path stroke="none" fill="var(--text-gray-800)" d="M7.7,12.4v-0.2c0-0.6-0.4-0.7-0.9-0.7c-0.3,0-0.4-0.3-0.4-0.6c0-0.3,0.1-0.6,0.4-0.6c0.4,0,0.7,0,0.7-0.8
                  c0-0.5-0.3-0.7-0.7-0.7C6.4,8.9,6.1,9,6.1,9.3c0,0.3-0.1,0.5-0.7,0.5c-0.7,0-0.8-0.1-0.8-0.6c0-0.7,0.5-1.7,2.1-1.7
                  c1.2,0,2.1,0.4,2.1,1.7c0,0.7-0.2,1.3-0.7,1.5c0.5,0.2,0.9,0.6,0.9,1.4v0.2c0,1.5-1,2.1-2.3,2.1c-1.6,0-2.2-1-2.2-1.8
                  c0-0.4,0.2-0.5,0.7-0.5c0.6,0,0.7,0.1,0.7,0.5c0,0.4,0.4,0.5,0.8,0.5C7.4,13.2,7.7,13,7.7,12.4z"></path>

                  <path stroke="none" fill="var(--text-gray-800)" d="M14.8,12.2L14.8,12.2c0,1.7-1,2.3-2.3,2.3c-1.3,0-2.3-0.6-2.3-2.2V9.8c0-1.6,1-2.2,2.4-2.2
                  c1.6,0,2.2,1,2.2,1.7c0,0.4-0.2,0.6-0.7,0.6c-0.4,0-0.7-0.1-0.7-0.5c0-0.4-0.4-0.5-0.8-0.5c-0.5,0-0.9,0.3-0.9,0.9v0.8
                  c0.3-0.3,0.7-0.4,1.2-0.4C13.9,10.2,14.8,10.7,14.8,12.2z M11.6,12.4c0,0.6,0.3,0.9,0.8,0.9c0.5,0,0.8-0.3,0.8-0.9v-0.1
                  c0-0.7-0.3-0.9-0.8-0.9c-0.5,0-0.8,0.2-0.8,0.9V12.4z"></path>
                  <path stroke="none" fill="var(--text-gray-800)" d="M15.9,12.3V9.8c0-1.6,1-2.2,2.3-2.2s2.3,0.6,2.3,2.2v2.5c0,1.6-1,2.2-2.3,2.2C16.9,14.5,15.9,13.9,15.9,12.3
                  z M19,9.8c0-0.6-0.3-0.9-0.8-0.9s-0.8,0.3-0.8,0.9v2.5c0,0.6,0.3,0.9,0.8,0.9s0.8-0.3,0.8-0.9V9.8z"></path>
                  <path stroke="none" fill="var(--text-gray-800)" d="M22.2,7.6c-0.4,0-0.9-0.1-1.2-0.4c-0.4-0.2-0.6-0.6-0.8-1C20,5.9,19.9,5.4,20,5c0.1-0.4,0.3-0.8,0.6-1.1
                  c0.3-0.3,0.7-0.5,1.1-0.6c0.4-0.1,0.9,0,1.3,0.1c0.4,0.2,0.7,0.4,1,0.8c0.2,0.4,0.4,0.8,0.4,1.2c0,0.6-0.2,1.1-0.6,1.6
                  C23.3,7.4,22.8,7.6,22.2,7.6z M22.2,4.7c-0.1,0-0.3,0-0.4,0.1c-0.1,0.1-0.2,0.2-0.3,0.3c-0.1,0.1-0.1,0.3,0,0.4
                  c0,0.1,0.1,0.3,0.2,0.4C21.8,6,21.9,6.1,22,6.1c0.1,0,0.3,0,0.4,0C22.6,6,22.7,6,22.8,5.8c0.1-0.1,0.1-0.3,0.1-0.4
                  c0-0.2-0.1-0.4-0.2-0.5C22.6,4.8,22.4,4.7,22.2,4.7z"></path></g>
                </svg>
                <span>${i18n.t('asideMenu.tours')}</span>
              </div>
            </li>
            <li class="s3d2-menu-nav-link" ${
              !config.menu_video_link ? 'style="display:none;"' : ''
            }>
              <div data-menu-close class="js-s3d-flat__3d-tour" data-href="${
                config.menu_video_link
              }">
                <svg data-v-a51d3662="" data-v-e742a666="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" role="presentation" class="icon app-menu-item__icon"><g data-v-a51d3662="" class="stroke no-fill" style="stroke-width: 2.08333;"><path d="M12.5 24C18.8513 24 24 18.8513 24 12.5C24 6.14873 18.8513 1 12.5 1C6.14873 1 1 6.14873 1 12.5C1 18.8513 6.14873 24 12.5 24Z" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M18 12.5L9 6.5V18.5L18 12.5Z" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
                <span>${i18n.t('asideMenu.video')}</span>
              </div>
            </li>
            <li ${
              !config.menu_brochure_link ? 'style="display:none;"' : ''
            } class="s3d2-menu-nav-link js-s3d-flat__3d-tour" data-menu-close data-href="${
    config.menu_brochure_link
  }">
              <div>
                <svg data-v-a51d3662="" data-v-e742a666="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" role="presentation" class="icon app-menu-item__icon">
                  <g data-v-a51d3662="" class="no-stroke fill" style="stroke-width: 2.08333;">
                    <path stroke="none" fill="var(--text-gray-800)" d="M12.5 2.5C18.0125 2.5 22.5 6.9875 22.5 12.5C22.5 18.0125 18.0125 22.5 12.5 22.5C6.9875 22.5 2.5 18.0125 2.5 12.5C2.5 6.9875 6.9875 2.5 12.5 2.5ZM12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 5.6 25 12.5 25C19.4 25 25 19.4 25 12.5C25 5.6 19.4 0 12.5 0ZM13.75 12.5V7.5H11.25V12.5H7.5L12.5 17.5L17.5 12.5H13.75Z">
                    </path>
                  </g>
                  </svg>
                <span>${i18n.t('asideMenu.brochure')}</span>
              </div>
            </li>
            <li class="s3d2-menu-nav-link js-s3d-flat__3d-tour" data-href="${
              config.project_google_map_location
            }" data-menu-close>
              <div>
                <svg data-v-a51d3662="" data-v-e742a666="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" role="presentation" class="icon app-menu-item__icon"><g data-v-a51d3662="" class="stroke no-fill" style="stroke-width: 2.08333;"><path d="M21.3354 9.59632C21.3354 14.6848 15.5026 21.415 13.4121 23.6788C13.0144 24.1071 12.3312 24.1071 11.9233 23.6788C9.82267 21.4252 3.98982 14.7154 4.00001 9.59632C4.00001 4.85458 7.88518 1 12.6677 1C17.4502 1 21.3354 4.85458 21.3354 9.59632Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.6678 13.8175C14.9205 13.8175 16.7467 11.9913 16.7467 9.73859C16.7467 7.48586 14.9205 5.65967 12.6678 5.65967C10.4151 5.65967 8.58887 7.48586 8.58887 9.73859C8.58887 11.9913 10.4151 13.8175 12.6678 13.8175Z" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
                <span>${i18n.t('asideMenu.location')}</span>
              </div>
            </li>
            <li class="s3d2-menu-nav-link">
              <div data-open-form data-menu-close>
                <svg data-v-a51d3662="" data-v-e742a666="" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" role="presentation" class="icon app-menu-item__icon"><g data-v-a51d3662="" class="stroke no-fill" style="stroke-width: 2.08333;"><path d="M2.15537 2.20615C1.95537 2.56695 1.97537 3.06177 2.06537 3.5772C2.96537 8.7831 5.40537 13.4426 8.83537 16.9888C12.2654 20.535 16.9154 23.1741 21.8054 23.9369C22.3054 24.0194 22.7854 24.0503 23.1354 23.8441C23.2554 23.772 23.4154 23.638 23.4554 23.4318L24.2554 19.7206C24.3154 19.4011 24.2054 19.0712 23.9554 18.8032C23.8354 18.6795 21.1054 17.6589 19.8154 17.0198C19.2854 16.7517 18.6654 16.9064 18.4054 17.3496L17.9054 18.2362C17.7354 18.5351 17.4454 18.7619 17.1254 18.8444C15.8654 19.1743 11.9654 15.4735 11.1154 14.5972C10.2354 13.69 6.52537 9.56657 6.84537 8.26767C6.92537 7.92748 7.14537 7.63884 7.43537 7.46359C8.18537 7.01 7.98537 7.13371 8.28537 6.94815C8.72537 6.68013 8.87537 6.04099 8.61537 5.49462C8.05537 4.30912 7.72537 3.19578 7.35537 1.92781C7.19537 1.37114 6.67537 0.927865 6.15537 1.04126C6.15537 1.04126 6.09537 1.05157 2.53537 1.87627C2.34537 1.9175 2.21537 2.07213 2.14537 2.20615H2.15537Z" stroke-miterlimit="10"></path><path d="M13.1255 4.10303C17.0555 4.10303 20.2355 7.3812 20.2355 11.4325" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.1255 1C18.7155 1 23.2455 5.66985 23.2455 11.4324" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
                <span>${i18n.t('asideMenu.contact')}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="s3d2-menu-wrap__overlay" data-menu-close></div>
  `;
}

export default menu;
