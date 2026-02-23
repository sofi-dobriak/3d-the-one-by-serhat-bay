import i18next from 'i18next';
import heroPinAnimation from '../animation/heroPinAnimation';

export default function mainScreenVillas(flat, i18n) {
  const heroMarkup = `
    <div class="s3d-villa-hero">
        <div class="s3d-villa-hero__img-wrapper">
          <img class="s3d-villa-hero__img" src="${flat.project_image}" alt="${flat.title}">
        </div>
        <div class="s3d-villa-hero__info">
          <span class="s3d-villa-hero__subtitle">${flat.subtitle}</span>
          <h1 class="s3d-villa-hero__title">${flat.title}</h1>
          <span class="s3d-villa-hero__line"></span>
          <p class="s3d-villa-hero__description">${flat.description}</p>
        </div>
    </div>
  `;
  const initAnimation = () => {
    const hero = document.querySelector('.s3d-villa-hero');
    if (hero) {
      heroPinAnimation();
    } else {
      setTimeout(initAnimation, 50);
    }
  };
  setTimeout(initAnimation, 50);

  return heroMarkup;
}
