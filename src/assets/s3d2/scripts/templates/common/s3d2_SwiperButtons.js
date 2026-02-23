import s3d2spriteIcon from '../spriteIcon';

/**
 *
 * @param {String} className
 * @param {String} classNamePrev
 * @param {String} classNameNext
 * @param {String} content
 *
 * @returns
 */
export default function s3d2_SwiperButtons({
  className = '',
  classNamePrev = '',
  classNameNext = '',
  content = '',
} = {}) {
  return `
        <div class="navigation-buttons ${className}">
          <div class="${classNamePrev}">
            <button class="navigation-buttons__button" type="button">
                ${s3d2spriteIcon('Big arrow left')}
            </button>
          </div>
          ${content}
          <div class="${classNameNext}">
              <button class="navigation-buttons__button" type="button">
                ${s3d2spriteIcon('Big arrow right')}
            </button>
          </div>
        </div>
  `;
}
