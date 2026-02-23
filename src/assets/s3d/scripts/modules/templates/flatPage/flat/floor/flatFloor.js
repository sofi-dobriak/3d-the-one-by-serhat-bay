import s3dFlatFloorDetails from './flatFllorDetails';
import s3dVillaFloorPlanings from '../../villa/floor/villaFloorPlanings';

export default function s3dFlatFloor(i18n, flat, isChecked, flybyLists) {
  return `
    <div class="s3d-villa__floor" id="toScroll">

        <div class="s3d-villa__floor__title-wrap">
            <div class="s3d-villa__floor__title-wrap__line"></div>
            <span class="s3d-villa__floor__title"> ${i18n.t(`Flat.floor_planning`)}</span>
            <div class="s3d-villa__floor__title-wrap__line"></div>
        </div>

        
        <div class="s3d-villa__floor-inner">
            ${s3dFlatFloorDetails(i18n, flat, isChecked, flybyLists)}
            ${s3dVillaFloorPlanings(i18n, flat)}
        </div>
    </div>
    `;
}
