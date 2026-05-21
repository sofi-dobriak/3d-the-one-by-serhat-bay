import groupBy from 'lodash/groupBy';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import { format, parseISO } from 'date-fns';

import createFlatInfo from './$flatInfo';
import $addToFavourite from '../$addToFavourite';
import $goToFloor from './$goToFloor';
import ButtonWithoutIcon from '../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';
import s3d2spriteIcon from '../../../../../s3d2/scripts/templates/spriteIcon';
import IconButton from '../../../../../s3d2/scripts/templates/common/IconButton';
import { $highlightSvgElements } from '../controller/$highlightSvgElements';
import { numberWithCommas, showOn } from '../../../../../s3d2/scripts/helpers/helpers_s3d2';
import FlatDocCard from '../../../../../s3d2/scripts/templates/flat/FlatDocCard';
import FlatFinancialTermsCard from '../../../../../s3d2/scripts/templates/flat/FlatFinancialTermsCard';
import ButtonIconLeft from '../../../../../s3d2/scripts/templates/common/ButtonIconLeft';
import { TOOLTIP_ATTRIBUTE } from '../../../../../s3d2/scripts/constants';
import $s3dVillaNavigation from './villa/villaNavigation';
import s3dFlatFloor from './flat/floor/flatFloor';
import renderVillaContact, { initializeVillaContact } from './villa/contactUs/villaContactUs';
import s32d_renderVillaContact, {
  s3d2_initializeVillaContact,
} from './villa/contactUs/s3d2_villaContactUs';
import s3d2_featureMaterials from './villa/featureMaterials/featureMaterials';
import VillaGalleryScreen from './villa/gallery/villaGalleryMarkup';
import VirtualTour from './villa/virtualTour/virtualTour';
import renderFaqList from './villa/faq/villaFaqList';
import VillaFinancialTermsScreen from './villa/terms/villaTermsScreen';
import FlatDocumentationScreen from './villa/documents/documents';
import FlatConstructionProgressScreen from './villa/constructionProgress/villaConstructionScreen';
import VillaContactLocation from './villa/contactUs/villaContactUsLocation';
import createFlybyVillaPage from './villa/flybyIndividual/villaFlybyView';
import generateButtonGroup from './villa/villaSpecifiedDropDown';
import s3dFloorPlan from '../flatPage/flat/floorPlan/floorPlan';
import s3dApartmentsList from '../flatPage/flat/apartmentsList/apartmentsList';
import $villaUpArrow from './villa/$villaUpArrow';
import initAnimations from './villa/animation/heroPinAnimation';
import s3dDashboard from './flat/s3dDashboard';
import getConfig from '../../../../../s3d2/scripts/getConfig';
import { socialMediaIcons } from '../../../../../s3d2/scripts/templates/common/icons/social-media-icons';
import {
  SMARTO_TOURS_CONTAINER_SELECTOR,
  SMARTO_TOURS_V3_CONTAINER_SELECTOR,
} from '../../../../../s3d2/scripts/modules/AudioAssistant/smartoToursSelectors';
import s3d2FlatFloorPlan from './flat/s3d2FlatFloor';
import $brandsList from './$brandsList';
import $s3d2_brandsList from './$s3d2_brandsList';
import s3d2_paymentSection from './villa/payment/s3d2_payment';
import { initLazyMap } from '../../flat/mapBox/mapInit';
import s3d2_TourTitle from './villa/virtualTour/s3d2_TourTitle';
/**
 * Represents a Flat object.
 *
 * @constructor
 * @param {Object} i18n - The internationalization object.
 * @param {Object} flat - The flat object.
 * @param {Array} favouritesIds$ - The array of favourite IDs.
 * @param {Array} [otherTypeFlats=[]] - The array of other type flats.
 * @param {Array} [labelsToShowInInfoBlock=[]] - The array of labels to show in the info block.
 * @param {Object} [unit_statuses={}] - The unit statuses object.
 * @param {Array} [floorList=[]] - The array of floor list.
 * @param {Array} [projectDocs=[]] - The array of project documents.
 * @param {Array} [constructionProgressList=[]] - The array of constructionProgressList data.
 * @param {Array} [financialTermsData=[]] - The array of financial terms data.
 * @param {Array} [constructionProgressDataList=[]] - The construction progress array.

 */
function Flat({
  i18n,
  flat,
  favouritesIds$,
  otherTypeFlats = [],
  labelsToShowInInfoBlock = [],
  unit_statuses = {},
  floorList = [],
  projectDocs = [],
  exteriorData = [],
  financialTermsData = [],
  constructionProgress = null,
  constructionProgressDataList = [],
  showPrices,
  getFlat,
  globalPhoneNumber = '',
  contactAdvantagesList = [],
  social_media_links: socialMediaLinks = {},
  manager_info: managerInfo = {},
  g_contacts: contacts = {},
  project_google_map_location,
  faq_questions = [],
  brands_list = [],
  payment_list = [],
  materials_list = [],
  contact_block_variant,
}) {
  function s3d2_CalculatorScreen(children = '', className = '') {
    return `
    <div class="calculator-screen">
      <div class="villa__contact-location ${className}">
        ${children}
      </div>
    </div>
  `;
  }

  const CONFIG = getConfig();

  const contactFormHtml1 = renderVillaContact(i18n, managerInfo, contactAdvantagesList);
  const contactFormHtml2 = renderVillaContact(i18n, managerInfo, contactAdvantagesList);

  const s3d2_contactFormHtml1 =
    contact_block_variant == '1' ? s32d_renderVillaContact('v1', { i18n, managerInfo }) : '';
  const s3d2_contactFormHtml2 =
    contact_block_variant == '2'
      ? s32d_renderVillaContact('v2', {
          i18n,
          socialMediaLinks,
          contacts,
          project_google_map_location,
        })
      : '';
  const s3d2_contactFormHtml3 =
    contact_block_variant == '3'
      ? s32d_renderVillaContact('v3', {
          i18n,
          managerInfo,
          project_google_map_location,
        })
      : '';

  const contactFormContainerId1 = extractContainerId(contactFormHtml1);
  const contactFormContainerId2 = extractContainerId(contactFormHtml2);

  const s3d2_contactFormContainerId1 =
    contact_block_variant == '1' ? extractContainerId(s3d2_contactFormHtml1) : '';
  const s3d2_contactFormContainerId2 =
    contact_block_variant == '2' ? extractContainerId(s3d2_contactFormHtml2) : '';
  const s3d2_contactFormContainerId3 =
    contact_block_variant == '3' ? extractContainerId(s3d2_contactFormHtml3) : '';

  const isChecked = favouritesIds$.value.includes(flat.id);

  const specifiedFlybyByGroup = groupBy(flat.specifiedFlybys, e => {
    return `flyby_${e.flyby}_${e.side}`;
  });

  const svgFlybyLink = flat.flatSvgLink ? flat.flatSvgLink : false;

  const $specifiedFlybysByGroup = Object.entries(specifiedFlybyByGroup)
    .map(([groupName, flybyList]) => generateButtonGroup(groupName, flybyList, flat, i18n))
    .join('');

  const flybyLists = Object.entries(specifiedFlybyByGroup).map(
    ([groupName, flybyList]) => flybyList,
  );

  const flatHtml = `
  <div class="s3d-flat-new s3d-villa">
    ${$s3dVillaNavigation({
      i18n,
      flat,
      isChecked,
      $specifiedFlybysByGroup,
    })}
    <div class="s3d-villa__container">

      ${flat['3d_tour'] ? VirtualTour(i18n, flat) : ''}
      ${
        flat['3d_tour_v2']
          ? `
        <div class="s3d-villa__gallery-wrap">
          <div ${SMARTO_TOURS_CONTAINER_SELECTOR.replace(/\[|\]/g, '')}></div>
          ${s3d2_TourTitle(i18n)}
        </div>
      `
          : ``
      }

      ${s3dDashboard(i18n, flat, $specifiedFlybysByGroup, contacts, showPrices)}
      ${s3d2FlatFloorPlan(i18n, flat, floorList, socialMediaLinks, contacts)}
      ${
        flat['3d_tour_v3']
          ? `
        <div class="s3d-villa__gallery-wrap">
          <div ${SMARTO_TOURS_V3_CONTAINER_SELECTOR.replace(/\[|\]/g, '')}></div>
          ${s3d2_TourTitle(i18n)}
        </div>
      `
          : ``
      }

      <div class="s3d-villa__container-bg"></div>
      <div class="s3d-villa__video-screen" style="padding-top: var(--space-5);     padding-left: var(--space-6);padding-right: var(--space-6);">
        <div class="s3d-villa-description-screen">
          <div class="s3d-villa-description-screen-item" ${
            !flat.description ? 'style="display:none;"' : ''
          }>
            <div class="s3d-villa-description-screen-item-title">
              Description
            </div>
            <div class="s3d-villa-description-screen-item-text">
              ${flat.description}
            </div>
          </div>
          <div class="s3d-villa-description-screen-item" ${
            Object.entries(CONFIG.flat_description_2.items).length === 0
              ? 'style="display:none;"'
              : ''
          }>
            <div class="s3d-villa-description-screen-item-title">
              ${CONFIG.flat_description_2.title}
            </div>
            <div class="s3d-villa-description-screen-item-text">
              ${Object.entries(CONFIG.flat_description_2.items)
                .map(
                  ([name, value]) => `
                <a href="${value}" class="s3d-villa__contact-location-intro-item__social-item" target="_blank">
                  ${socialMediaIcons[name]}
                </a>
              `,
                )
                .join('')}
            </div>
          </div>

        </div>

      </div>

      ${$additionalAmenities(flat)}
    <!--  ${$brandsList({ i18n, flat, brands: brands_list, faqs: faq_questions })} -->
    <!--  ${s3d2_CalculatorScreen('', 'js-installment-calculator')} -->
      ${s3d2_featureMaterials({ i18n, materials: materials_list })}
      ${$s3d2_brandsList({ i18n, flat, brands: brands_list, faqs: faq_questions })}
      ${s3d2_paymentSection({ i18n, flat, payment_list })}
      <!-- <div id="map-root"></div> -->
      ${s3d2_contactFormHtml1}
      ${s3d2_contactFormHtml2}
      ${s3d2_contactFormHtml3}
      <!-- ${contactFormHtml1} -->
      ${
        flat['view_from_window_link']
          ? `
        <div class="s3d-villa__virtual-tour-wrap">
            <div class="s3d-villa__floor__title-wrap">
                <div class="s3d-villa__floor__title-wrap__line"></div>
                <span class="s3d-villa__floor__title"> ${i18n.t('Flat.from_window_view')}</span>
                <div class="s3d-villa__floor__title-wrap__line"></div>
            </div>
            <div class="s3d-villa__virtual-tour-iframe-wrap">
                <iframe src="${flat['view_from_window_link']}" loading="lazy"></iframe>
            </div>
        </div>
      `
          : ''
      }
      ${
        flat['video']
          ? `
        <div class="s3d-villa__video-screen">
          <div class="s3d-villa__floor__title-wrap">
            <div class="s3d-villa__floor__title-wrap__line"></div>
            <span class="s3d-villa__floor__title">${i18n.t('Flat.video')}</span>
            <div class="s3d-villa__floor__title-wrap__line"></div>
          </div>
          <div class="s3d-villa__video-screen-iframe-wrap">
            <video class="" controls src="${flat['video']}" loading="lazy">
            </video>
          </div>
        </div>
      `
          : ''
      }


      ${VillaFinancialTermsScreen(i18n, financialTermsData)}
      ${FlatDocumentationScreen(i18n, projectDocs)}
      ${FlatConstructionProgressScreen(i18n, constructionProgressDataList)}
      <div class="s3d-villa__contact-screen">
      ${VillaContactLocation(
        i18n,
        socialMediaLinks,
        contacts,
        globalPhoneNumber,
        project_google_map_location,
      )}
        ${contactFormHtml2}
      </div>

      <div last-screen-animation>
        <div class="s3d-flat-new__bottom" ></div>
      </div>
    </div>
    ${svgFlybyLink ? createFlybyVillaPage(flat) : ''}
    ${$villaUpArrow()}

  </div>
`;

  if (svgFlybyLink) {
    renderFlatFlyby(svgFlybyLink, flat.id, flat, getFlat);
  }

  initializeContactForms(contactFormContainerId1, contactFormContainerId2, i18n);
  s32d_initializeContactForms(
    s3d2_contactFormContainerId1,
    s3d2_contactFormContainerId2,
    s3d2_contactFormContainerId3,
    i18n,
    contact_block_variant,
  );

  return flatHtml;
}
/**
 * Extracts the container ID from the given HTML string (assumes the first ID found is the target).
 *
 * @param {string} html - The HTML string to extract the ID from.
 * @returns {string|null} - The extracted ID or null if no ID is found.
 */
function extractContainerId(html) {
  const match = html.match(/id="([^"]+)"/);
  return match ? match[1] : null;
}

export function FlatExplicationPropertyRow(title, value, i18n) {
  return `
    <div class="s3d-flat__explication-screen-info-row text-style-3-d-fonts-1920-body-regular text-gray-800">
      <div class="s3d-flat__explication-screen-info-row-title">${title}</div>
      <div class="s3d-flat__explication-screen-info-row-value">
        ${value} ${i18n.t('area_unit')}
      </div>
    </div>
  `;
}

/**
 * Initializes the contact forms by their container IDs.
 *
 * @param {string|null} id1 - The ID of the first contact form container.
 * @param {string|null} id2 - The ID of the second contact form container.
 */

function initializeContactForms(id1, id2, i18n) {
  setTimeout(() => {
    if (id1) {
      initializeVillaContact(id1, i18n);
    }
    if (id2) {
      initializeVillaContact(id2, i18n);
    }
  }, 0);
}

function s32d_initializeContactForms(id1, id2, id3, i18n, contact_block_variant) {
  setTimeout(() => {
    if (id1 && contact_block_variant == '1') {
      s3d2_initializeVillaContact(id1, i18n);
    }
    if (id2 && contact_block_variant == '2') {
      s3d2_initializeVillaContact(id2, i18n);
    }
    if (id3 && contact_block_variant == '3') {
      s3d2_initializeVillaContact(id3, i18n);
    }
  }, 0);
}

function renderFlatFlyby(link, flatId, flat, getFlat) {
  axios.get(link).then(el => {
    const container = document.querySelector('[data-flat-flyby-svg-container]');
    const parser = new DOMParser();
    const doc = parser.parseFromString(el.data, 'text/html');
    const svg = doc.querySelector('svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg
      .querySelectorAll('[data-type="infrastructure"], [data-type="flyby"]')
      .forEach(el => el.remove());
    svg.querySelectorAll(`polygon`).forEach(el => el.setAttribute('fill', 'none'));
    svg.querySelectorAll(`polygon[data-type="flat"]`).forEach(el => {
      el.classList.add('polygon__filter-select');
      if (!getFlat(el.dataset.id)) {
        el.remove();
        return;
      }
      el.dataset['_type'] = getFlat(el.dataset.id)['build_name'];
    });
    svg.querySelectorAll(`polygon[data-_type="${flat.build_name}"]`).forEach(el => {
      el.classList.add('active');
      const sale = getFlat(el.dataset.id).sale;
      el.dataset['sale'] = sale;
      // el.classList.remove('polygon__filter-select');
    });

    svg.querySelectorAll(`[data-id="${flatId}"]`).forEach(el => el.classList.add('active-flat'));
    container.querySelectorAll('svg').forEach(s => s.remove());
    container.insertAdjacentElement('beforeend', svg);
    const scrollEl = container.closest('.s3d-villa__flyby-wrapper');
    setTimeout(() => {
      scrollEl.scrollTo({
        left: scrollEl.scrollWidth / 2 - window.innerWidth / 2,
        behavior: 'smooth',
      });
    }, 3000);
  });
}

export default Flat;

function $additionalAmenities(flat) {
  if (!window.s3dAdditionalServices || !window.s3dAdditionalServices[flat.id]) {
    return ``;
  }

  const data = window.s3dAdditionalServices[flat.id]; // на проді ці дані виведені хардкодом у 3d.php !!!!

  return `
    <div class="s3d-villa__video-screen">
      <div class="s3d-villa__floor__title-wrap">
        <div class="s3d-villa__floor__title-wrap__line"></div>
        <span class="s3d-villa__floor__title">Features & Amenities</span>
        <div class="s3d-villa__floor__title-wrap__line"></div>
      </div>
      <div class="s3d-villa__additional-amenities">

      ${data
        .map(
          item => `
        <div class="s3d-villa__additional-amenities-item">
          ${
            item.title ? `<h3 class="s3d-villa__additional-amenities-title">${item.title}</h3>` : ''
          }
          <ul class="s3d-villa__additional-amenities-list">
            ${item.features
              .map(
                feature => `
              <li class="s3d-villa__additional-amenities-list-item">
                ${Object.entries(feature)
                  .map(
                    ([key, value]) => `
                  <span class="s3d-villa__additional-amenities-list-item-key">${key}:</span>
                  <span class="s3d-villa__additional-amenities-list-item-value">${value}</span>`,
                  )
                  .join('')}
              </li>`,
              )
              .join('')}
            </ul>
          </div>
        `,
        )
        .join('')}
      </div>
    </div>
  `;
}
