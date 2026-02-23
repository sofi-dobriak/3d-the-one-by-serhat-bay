export default function VillaConstructionProgressCard(i18n, constructionProgress) {
  return `
    <div class="s3d-villa__construction-progress-card swiper-slide" data-id="${constructionProgress.id}">
        <div class="s3d-villa__construction-progress-card__image">
            <img src="${constructionProgress.img}" alt="">
        </div>
        <div class="s3d-villa__construction-progress-card__content">    
          <div class="s3d-villa__construction-progress-card__top">
              <div class="s3d-villa__construction-progress-card__top__day">${constructionProgress.year}</div>
              <div class="s3d-villa__construction-progress-card__top__button">
                <div class="s3d-villa__construction-progress-card__top__button-svg-wrap">
                  <svg class="s3d-villa__construction-progress-card__top__button-svg--1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.73117 12.75L13.0472 19.487L11.9528 20.5129L4.45285 12.5129L3.97195 12L4.45285 11.487L11.9528 3.48703L13.0472 4.51294L6.73117 11.25H20V12.75H6.73117Z" fill="#1A1E21"/>
                  </svg>
                  <svg class="s3d-villa__construction-progress-card__top__button-svg--2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.73117 12.75L13.0472 19.487L11.9528 20.5129L4.45285 12.5129L3.97195 12L4.45285 11.487L11.9528 3.48703L13.0472 4.51294L6.73117 11.25H20V12.75H6.73117Z" fill="#1A1E21"/>
                  </svg>
                </div> 
              </div>     
          </div>
          <div class="s3d-villa__construction-progress-card__bottom">
              <div class="s3d-villa__construction-progress-card__bottom__day">${constructionProgress.day}</div>
              <div class="s3d-villa__construction-progress-card__bottom__month">${constructionProgress.month}</div>
          </div>
        </div>
    </div>
      `;
}
