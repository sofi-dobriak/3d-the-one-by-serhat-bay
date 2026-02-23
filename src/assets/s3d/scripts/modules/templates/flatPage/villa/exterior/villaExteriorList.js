import VillaExteriorCard from './villaExteriorCard.js';

function VillaExteriorList(exteriorData = [], i18n) {
  const exteriorImages = Array.isArray(exteriorData) ? exteriorData : [];

  if (!exteriorImages.length) {
    return `<p class="s3d-villa__no-exterior">${i18n.t('Flat.exterior.noData')}</p>`;
  }

  return `
    <div class="s3d-villa__exterior-list">
        ${exteriorImages
          .map((item, i) =>
            VillaExteriorCard(
              item.img || '',
              item.title || i18n.t('Flat.exterior.defaultTitle'),
              item.description || i18n.t('Flat.exterior.defaultDescription'),
              i18n,
              i,
            ),
          )
          .join('')}
    </div>
  `;
}

export default function VillaExteriorSection(exteriorData, i18n) {
  return `
    <section class="s3d-villa__exterior">
        <div class="s3d-villa__floor__title-wrap">
            <div class="s3d-villa__floor__title-wrap__line"></div>
            <span class="s3d-villa__floor__title">${i18n.t('Flat.exterior.exteriorTitle')}</span>
            <div class="s3d-villa__floor__title-wrap__line"></div>
        </div>
        ${VillaExteriorList(exteriorData, i18n)}
    </section>
  `;
}
