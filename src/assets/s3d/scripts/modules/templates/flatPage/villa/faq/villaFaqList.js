import get from 'lodash/get';
import Accordion from './villaFaq';
import renderFaqCard from './villaFaqCard';

function replacePlaceholders(str, flat, i18n) {
  return str.replace(/\{\{(.*?)\}\}/g, (_, key) => i18n.t(key.trim()))
            .replace(/\[\[(.*?)\]\]/g, (_, key) => flat[key.trim()] || '');
}


export default function renderFaqList(i18n, list = [], flat) {
  if (list.length === 0) return ``;
  const lang = i18n.language;
  const $list = list.reduce((acc, el) => {
    let question = get(el, `question.${lang}`, '');
    question = replacePlaceholders(question, flat, i18n);
    let answer = get(el, `answer.${lang}`, '');
    answer = replacePlaceholders(answer, flat, i18n);
    const ignoreList = get(el, 'ignore', {});
    const isNeedToRender = isNeedToRenderFaq(ignoreList, flat);
    if (isNeedToRender) {
      acc.push(renderFaqCard(question, answer));
    }
    return acc;
  }, []);

  if ($list.length === 0) return ``;

  const faqMarkup = `
    <section class="s3d-villa__faq">
          <div class="s3d-villa__floor__title-wrap">
              <div class="s3d-villa__floor__title-wrap__line"></div>
              <span class="s3d-villa__floor__title"> ${i18n.t('Flat.faq.faqTitle')}</span>
              <div class="s3d-villa__floor__title-wrap__line"></div>

          </div>
          <div class="s3d-villa__faq-list">
              ${$list.join('')}
          </div>
    </section>
`;
  
  if (!window.s3dFlatAccordeon) {
    new Accordion('body', { singleOpen: true });
    window.s3dFlatAccordeon = true;
  }
  
  return faqMarkup;
}


function isNeedToRenderFaq(ignore = {}, flat) {
  let isNeedToRender = true;
  Object.entries(ignore).forEach(([key, value]) => {
    value.forEach((valueToIgnore) => {
      if (flat[key] == valueToIgnore) {
        isNeedToRender = false;
      }
    });
  });
  return isNeedToRender;
}