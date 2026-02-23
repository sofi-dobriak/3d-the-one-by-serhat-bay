
import $s3d2ApartmentPlanings from './apartmentPlan/s3d2ApartmentPlaning';

export default function s3d2FlatFloorPlan(i18n, flat, floorList, socialMediaLinks, contacts) {
  return `
    <div class="s3d2-apartment__flat-floor-plan-wrap">
        ${$s3d2ApartmentPlanings(i18n, flat,floorList, socialMediaLinks, contacts)}
       

    </div>
    `;
}
