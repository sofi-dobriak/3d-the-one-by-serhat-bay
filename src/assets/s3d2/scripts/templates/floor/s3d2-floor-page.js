import s3d2spriteIcon from '../spriteIcon';

function Floor_s3d2({ i18n, floorList = [], activeFloor, hideOverlay, showPrices, getFlat }) {
  console.log('floorList in Floor_s3d2 template:', floorList, activeFloor);

  const $floorItems = floorList
    .map(floor => {
      const isActive = floor.floor === activeFloor;
      return `
            <button class="s3d2-floor-page__floor-item ${
              isActive ? 'active' : ''
            }" data-type="floor" data-floor-id="${floor.id}" data-floor_direct-btn="" data-build="${
        floor.build
      }" data-section="${floor.section}" data-floor="${floor.floor}" data-index="4">
                ${floor.floor}
            </button>
        `;
    })
    .join('');

  return `
        <div class="s3d2-floor-page">
            <div class="s3d2-floor-page__svg-container js-s3d-floor"></div>
            <div class="s3d2-floor-page__floor-list" ${
              !$floorItems ? 'style="display: none;"' : ''
            }>
                <div class="s3d2-floor-page__floor-list-toggle" onclick="this.closest('.s3d2-floor-page__floor-list').classList.toggle('hidden')">
                    <div class="s3d2-floor-page__floor-list-toggle-button" >
                        ${s3d2spriteIcon('Chevron down')}
                    </div>
                </div>
                <div class="s3d2-floor-page__floor-list-wrapper">
                    <div class="s3d2-floor-page__floor-list-items">
                        ${$floorItems}
                    </div>
                </div>
            </div>
        </div>
    `;
}

export default Floor_s3d2;
