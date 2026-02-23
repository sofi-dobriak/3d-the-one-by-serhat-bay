import { hideElementsAttribute } from '../../../s3d/scripts/features/hideElementsOnPages';
import s3d2spriteIcon from './spriteIcon';

export default function s3d2_SpinNav() {
  return `
    <div data-flyby-load-element class="s3d2-SpinNav" ${hideElementsAttribute([
      'floor',
      'flat',
      'plannings',
      'favourites',
      'intro',
    ])}>
      <div class="s3d2-SpinNav__load-element" data-flyby-visual-load-element></div>
      <button class="s3d2-SpinNav__arrow js-s3d__button-left" data-type="prev" type="button">
        ${s3d2spriteIcon('Big arrow left')}
      </button>
      <span class="s3d2-SpinNav__counter fs-preloader-amount">360°</span>
      <button class="s3d2-SpinNav__arrow js-s3d__button-right" data-type="next" type="button">
        ${s3d2spriteIcon('Big arrow right')}
      </button>
    </div>
  `;
}
