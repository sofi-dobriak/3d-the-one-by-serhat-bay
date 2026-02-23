import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import groupBy from 'lodash/groupBy';

import $s3dVillaNavigation from './villaNavigation';
import generateButtonGroup from './villaSpecifiedDropDown';
import mainScreenVillas from './hero/villaMainScreen';

import s3dVillaFloor from './floor/villaFloor';
import VillaGalleryScreen from './gallery/villaGalleryMarkup';
import s3dVillaContact from './contactUs/villaContactUs';
import FlatDocumentationScreen from './documents/documents';
import FlatConstructionProgressScreen from './constructionProgress/villaConstructionScreen';
import './constructionProgress/villaGetCardById';
import FormViewPage from '../../../../../../s3d/scripts/modules/form/form/formViewApartmentPage';
import renderVillaContact, { initializeVillaContact } from './contactUs/villaContactUs';
import VirtualTour from './virtualTour/virtualTour';
import VillaExteriorSection from './exterior/villaExteriorList';
import renderFaqList from './faq/villaFaqList';
import VillaFinancialTermsScreen from './terms/villaTermsScreen';
import VillaContactLocation from './contactUs/villaContactUsLocation';

import createFlybyVillaPage from './flybyIndividual/villaFlybyView';
import heroPinAnimation from './animation/heroPinAnimation';
import axios from 'axios';
import getConfig from '../../../../../../s3d2/scripts/getConfig';
import $villaUpArrow from './$villaUpArrow';

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
 * @param {Array} [exteriorData=[]] - The array of project exterior.
* @param {Array} [constructionProgressDataList=[]] - The construction progress array.
 * @param {Object} [constructionProgressItemById={}] - The construction progress array.
 * @param {Array} [financialTermsData=[]] - The array of financial terms data.

 */
function Villa(
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
  // constructionProgressItemById = {},
  showPrices,
  getFlat,
  socialMediaLinks = {},
  managerInfo = {},
  contacts = {},
  globalPhoneNumber = '',
  contactAdvantagesList = [],
  project_google_map_location,
  faq_questions = [],
) {
  const isChecked = favouritesIds$.value.includes(flat.id);

  const flybyWithThisFlat = isArray(flat.specifiedFlybys)
    ? flat.specifiedFlybys.find(el => {
        el.link;
      })
    : false;
  const svgFlybyLink = flat.flatSvgLink ? flat.flatSvgLink : false;

  const specifiedFlybyByGroup = groupBy(flat.specifiedFlybys, e => {
    return `flyby_${e.flyby}_${e.side}`;
  });

  const $specifiedFlybysByGroup = Object.entries(specifiedFlybyByGroup)
    .map(([groupName, flybyList]) => generateButtonGroup(groupName, flybyList, flat, i18n))
    .join('');

  const contactFormHtml1 = renderVillaContact(i18n, managerInfo, contactAdvantagesList);
  const contactFormHtml2 = renderVillaContact(i18n, managerInfo, contactAdvantagesList);

  const contactFormContainerId1 = extractContainerId(contactFormHtml1);
  const contactFormContainerId2 = extractContainerId(contactFormHtml2);

  const CONFIG = getConfig();

  const villaHtml = `
      <div class="s3d-villa">
        ${$s3dVillaNavigation({
          i18n,
          flat,
          isChecked,
          $specifiedFlybysByGroup,
        })}
        ${mainScreenVillas(flat, i18n)}
        <div class="s3d-villa__container">

          ${s3dVillaFloor(i18n, flat, CONFIG.show_prices)}

          ${contactFormHtml1}
          ${flat['gallery'] ? VillaGalleryScreen(flat['gallery'], i18n) : ''}
          ${flat['3d_tour'] ? VirtualTour(i18n, flat) : ''}
          ${VillaExteriorSection(exteriorData, i18n)}
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
          ${renderFaqList(i18n, faq_questions, flat)}
          ${VillaFinancialTermsScreen(i18n, financialTermsData)}
          ${FlatDocumentationScreen(i18n, projectDocs)}
          ${FlatConstructionProgressScreen(i18n, constructionProgressDataList)}
          <div class="s3d-villa__contact-screen" last-screen-animation>
            ${VillaContactLocation(
              i18n,
              socialMediaLinks,
              contacts,
              globalPhoneNumber,
              project_google_map_location,
            )}
            ${contactFormHtml2}
          </div>
        </div>
        ${createFlybyVillaPage(flat)}
        ${$villaUpArrow()}
      </div>
    `;

  if (svgFlybyLink) {
    renderFlatFlyby(svgFlybyLink, flat.id, flat, getFlat);
  }

  initializeContactForms(contactFormContainerId1, contactFormContainerId2, i18n);

  return villaHtml;
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
      el.dataset['_type'] = getFlat(el.dataset.id)['build_name'];
    });
    svg.querySelectorAll(`polygon[data-_type="${flat.build_name}"]`).forEach(el => {
      el.classList.add('active');
      const sale = getFlat(el.dataset.id).sale;
      el.dataset['sale'] = sale;
      // el.classList.remove('polygon__filter-select');
    });

    svg.querySelectorAll(`[data-id="${flatId}"]`).forEach(el => el.classList.add('active-flat'));
    container.insertAdjacentElement('beforeend', svg);
    container.scrollTo({
      left: container.scrollWidth / 2 - window.innerWidth / 2,
      behavior: 'smooth',
    });
  });
}
export default Villa;
