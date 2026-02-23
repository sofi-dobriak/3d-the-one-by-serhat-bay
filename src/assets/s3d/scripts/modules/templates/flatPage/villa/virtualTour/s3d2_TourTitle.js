import s3d2_InfoHoverTips from '../../../../../../../s3d2/scripts/templates/common/s3d2_InfoHoverTips';

export default function s3d2_TourTitle(i18n) {
  return `
    <div class="tour-title-container">
      <div class="tour-title-container__title-tips-block">
        <h2 class="tour-title-container__title">${i18n.t('Flat.tour.title')}</h2>
        ${s3d2_InfoHoverTips({
          classNameContent: 'tour-title-container__tips',
          content: i18n.t('Flat.tour.tips'),
        })}
      </div>
      <p class="tour-title-container__subtitle">${i18n.t('Flat.tour.subtitle')}</p>
    </div>
  `;
}
