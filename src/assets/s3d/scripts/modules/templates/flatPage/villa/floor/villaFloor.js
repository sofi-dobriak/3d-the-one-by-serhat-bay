import s3dVillaFloorDetails from './villaFloorDetails';
import s3dVillaFloorPlanings from './villaFloorPlanings';

export default function s3dVillaFloor(i18n, flat, show_prices) {
  return `
    <div class="s3d-villa__floor" id="toScroll">
        <a href="#toScroll" class="s3d-villa__floor-scroll-wrap">
            <div class="s3d-villa__floor-scroll-title">
              ${i18n.t('Flat.scroll')}
            </div>
            <div  class="s3d-villa__floor-scroll-svg-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5256 17.3185L19.6836 10.6079L20.3675 11.3374L12.3675 18.8374L12.0256 19.158L11.6836 18.8374L3.68359 11.3374L4.36753 10.6079L11.5256 17.3185L11.5256 3.47266L12.5256 3.47266L12.5256 17.3185Z" fill="#1A1E21"/>
                </svg>
            </div>

        </a>

        <div class="s3d-villa__floor__title-wrap">
            <div class="s3d-villa__floor__title-wrap__line"></div>
            <span class="s3d-villa__floor__title">Floor</span>
            <div class="s3d-villa__floor__title-wrap__line"></div>

        </div>

        
        <div class="s3d-villa__floor-inner">
            ${s3dVillaFloorDetails(i18n, flat, show_prices)}
            ${s3dVillaFloorPlanings(i18n, flat)}
        </div>
    </div>
    `;
}
