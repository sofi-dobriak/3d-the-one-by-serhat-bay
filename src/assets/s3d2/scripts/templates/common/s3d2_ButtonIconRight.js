import s3d2spriteIcon from '../spriteIcon';

/**
 *
 * @param {String} className
 * @param {String} attributes
 * @param {String} text
 * @param {String} iconName - icon name from sprite(folder to see icon names - ./src/assets/s3d/svg-sprite)
 * @returns
 */
export default function s3d2_ButtonIconRight(className, attributes, text = '', iconName) {
  return `
    <button class="s3d2-ButtonIconRight ${className}" ${attributes}>
      <span>${text}</span>
      ${s3d2spriteIcon(iconName, 'ButtonIconRight__icon')}
    </button>
  `;
}
