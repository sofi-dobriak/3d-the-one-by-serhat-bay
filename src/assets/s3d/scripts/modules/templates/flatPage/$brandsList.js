import get from 'lodash/get';
import Accordion from './villa/faq/villaFaq';
import renderFaqCard from './villa/faq/villaFaqCard';

export default function $brandsList({ i18n, flat, brands = [], faqs = [] }) {
  if (brands.length === 0 && faqs.length === 0) return '';

  const lang = i18n.language || 'en';

  const brandsMarkup =
    brands.length > 0
      ? `<div class="brands-grid" id="brands-grid">
        ${brands.map(item => cardTemplate(item)).join('')}
       </div>`
      : '';

  const processedFaqs = faqs.reduce((acc, el) => {
    const ignoreList = get(el, 'ignore', {});

    if (typeof isNeedToRenderFaq === 'function' && !isNeedToRenderFaq(ignoreList, flat)) {
      return acc;
    }

    let question = get(el, `question.${lang}`, get(el, 'question.en', ''));
    let answer = get(el, `answer.${lang}`, get(el, 'answer.en', ''));

    question = replacePlaceholders(question, flat, i18n);
    answer = replacePlaceholders(answer, flat, i18n);

    acc.push(renderFaqCard(question, answer));
    return acc;
  }, []);

  const faqMarkup =
    processedFaqs.length > 0
      ? `<div class="s3d-villa__faq-list">
        ${processedFaqs.join('')}
       </div>`
      : '';

  if (!window.s3dFlatAccordeon) {
    new Accordion('body', { singleOpen: true });
    window.s3dFlatAccordeon = true;
  }

  return `
        <div class="s3d-villa__floor" aria-labelledby="brands-title">
            <div class="s3d-villa__floor__title-wrap">
                <div class="s3d-villa__floor__title-wrap__line"></div>
                <span class="s3d-villa__floor__title"> ${i18n.t('Flat.brands_list_title')}</span>
                <div class="s3d-villa__floor__title-wrap__line"></div>
            </div>

            ${brandsMarkup}
            ${faqMarkup}
        </div>
    `;
}

const cardTemplate = item => {
  const brandName = escapeHtml(get(item, 'brand', ''));
  const category = escapeHtml(get(item, 'category', get(item, ['category'], '')));
  const description = escapeHtml(get(item, 'description', get(item, ['description'], '')));
  const logoUrl = get(item, ['logoUrl'], '');

  return `
    <article class="brand-card">
        <div class="brand-top">
        ${
          logoUrl
            ? `<img class="brand-logo" src="${escapeHtml(logoUrl)}" alt="${brandName}">`
            : `<span class="text-style-3-d-fonts-1920-h-1" aria-hidden="true">${brandName}</span>`
        }
        <h3 class="text-style-3-d-fonts-1920-h-1">${category}</h3>
        </div>
        <p class="brand-desc">${description}</p>
    </article>
  `;
};

const escapeHtml = str =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function replacePlaceholders(str, flat, i18n) {
  return str
    .replace(/\{\{(.*?)\}\}/g, (_, key) => i18n.t(key.trim()))
    .replace(/\[\[(.*?)\]\]/g, (_, key) => flat[key.trim()] || '');
}

function isNeedToRenderFaq(ignore = {}, flat) {
  let isNeedToRender = true;
  Object.entries(ignore).forEach(([key, value]) => {
    value.forEach(valueToIgnore => {
      if (flat[key] == valueToIgnore) {
        isNeedToRender = false;
      }
    });
  });
  return isNeedToRender;
}
