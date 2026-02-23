import ButtonWithoutIcon from '../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon';
import IconButton from '../../../../../s3d2/scripts/templates/common/IconButton';
import TinyButton from '../../../../../s3d2/scripts/templates/common/TinyButton';

function $goToFlat(i18n, flat, floorList = []) {
  const $floorList = floorList
    .map((floor, index) => {
      return TinyButton({
        className:
          floor.floor == flat.floor ? 'active swiper-slide swiper-slide-active' : 'swiper-slide',
        attributes: `data-floor_direct-btn data-build="${floor.build}" data-section="${floor.section}" data-floor="${floor.floor}" data-index="${index}"`,
        text: floor.floor,
      });
    })
    .join('');

  const $floorListSlider =
    floorList.length > 0
      ? `
    <div class="swiper-container" data-flat-floor-list>
      <div class="swiper-wrapper">
        ${$floorList}
      </div>
    </div>
  `
      : '';

  return `
    <div class="s3d-flat__floor">
      <div class="s3d-flat__floor-wrapper">
        <div class="s3d-flat__floor-info-wrapper">
          <div class="s3d-flat__floor-info">
          </div>
        </div>
        <div class="s3d-flat__floor-clue">${i18n.t('Flat.change_floor')}</div>
        <article class="s3d-floor__nav">
          <div class="s3d-floor__nav-btn ${
            floorList.length > 1 ? '' : 'disable'
          }" data-floor_btn data-floor_direction="prev" >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.90658 12.5062L12.7036 17.3055L11.9963 18.0124L6.34625 12.3597L5.99294 12.0062L6.34625 11.6527L11.9963 6L12.7036 6.70694L7.90658 11.5062H18V12.5062H7.90658Z" fill="#1A1E21"/>
              </svg>
          </div>
          ${$floorListSlider}
          <div class="s3d-floor__nav-btn ${
            floorList.length > 1 ? '' : 'disable'
          }" data-floor_btn data-floor_direction="next">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0864 12.6763L11.2932 17.4696L12.0003 18.1767L17.647 12.5298L18.0005 12.1763L17.647 11.8227L12.0003 6.17578L11.2932 6.88288L16.0864 11.6763H6V12.6763H16.0864Z" fill="#1A1E21"/>
              </svg>
          </div>
        </article>
        
        <!--${ButtonWithoutIcon(
          's3d-flat__to--floor',
          'id="s3d-to-floor"',
          i18n.t('Flat.goToFloor'),
          'secondary',
        )}-->
        <!--<button class="s3d-flat__to--floor" id="s3d-to-floor">
          <span>${i18n.t('Flat.goToFloor')}</span>
        </button>-->
      </div>
    </div>
`;
}

export default $goToFlat;
