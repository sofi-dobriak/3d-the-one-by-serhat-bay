import ButtonIconLeft from '../../../../s3d2/scripts/templates/common/ButtonIconLeft';

function errorPopupTemplate(description, i18n) {
  let time = 100;
  const intervalID = setInterval(() => {
    if (time === 1) {
      clearInterval(intervalID);
      window.location.href = window.location.href.includes('localhost')
        ? 'http://localhost:3000/wp-content/themes/3d'
        : '/';
    }

    time -= 1;
    document.querySelector('.errorPopup__description span').textContent = time;
  }, 1000);
  return `<div class="errorPopup__container">
    <div class="errorPopup">
      <div class="errorPopup__head">
        <h2 class="errorPopup__title">${i18n.t('Error-popup.title')}</h2>
      </div>
      <div class="errorPopup__body">
          <p class="errorPopup__description">${description}</p>
          <p class="errorPopup__description">${i18n.t(
            'Error-popup.translate-info',
          )} <span>${time}</span></p>
      </div>
      <div class="errorPopup__footer">
        <a class="ButtonIconLeft  ButtonIconLeft--secondary" href="/">
          <svg class="ButtonIconLeft__icon"><use xlink:href="#icon-Back"></use></svg>
          <span>${i18n.t('Error-popup.link')}</span>
        </a>
          <!--${ButtonIconLeft('', 'href="/"', i18n.t('Error-popup.link'), 'Back', 'secondary')}-->
          <!--<a class="errorPopup__link" href="/">${i18n.t('Error-popup.link')}</a>-->
      </div>
    </div>
</div>`;
}

function errorPopupTemplateTranslate(description, i18n) {
  return `<div class="errorPopup__container">
    <div class="errorPopup">
      <div class="errorPopup__head">
        <h2 class="errorPopup__title">${i18n.t('Error-popup.title')}</h2>
      </div>
      <div class="errorPopup__body">
          <p class="errorPopup__description">${description}</p>
          <p class="errorPopup__description">
            ${i18n.t('Error-popup.translate-info')}
            <span class="errorPopup__time js-errorPopup__time"></span>
          </p>
      </div>
      <div class="errorPopup__footer">
          <!--${ButtonIconLeft('', 'href="/"', i18n.t('Error-popup.link'), 'Back', 'secondary')}-->
          <a class="ButtonIconLeft  ButtonIconLeft--secondary" href="/">
            <svg class="ButtonIconLeft__icon"><use xlink:href="#icon-Back"></use></svg>
            <span>${i18n.t('Error-popup.link')}</span>
          </a>
          <!--<a class="errorPopup__link" href="/" >${i18n.t('Error-popup.link')}</a>-->
      </div>
    </div>
</div>`;
}

export { errorPopupTemplate, errorPopupTemplateTranslate };
