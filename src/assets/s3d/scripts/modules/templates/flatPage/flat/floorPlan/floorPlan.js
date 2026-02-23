import $goToFlat from '../../$goToFloor';

export default function s3dFloorPlan(i18n, flat, floorList) {
  return `
    <div class="s3d-flat-new__floor-plan">

      <div class="s3d-villa__floor__title-wrap">
        <div class="s3d-villa__floor__title-wrap__line"></div>
        <span class="s3d-villa__floor__title"> ${i18n.t(`Flat.floor_plan`)}</span>
        <div class="s3d-villa__floor__title-wrap__line"></div>
      </div>

      
     ${$goToFlat(i18n, flat, floorList)}
        
    </div>
    `;
}
