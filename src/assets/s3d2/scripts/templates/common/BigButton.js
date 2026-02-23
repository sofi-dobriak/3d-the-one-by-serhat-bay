import s3d2spriteIcon from '../spriteIcon';

/**
 * @typedef {"secondary" | "primary"} TypeBigButton
 */

/**
 *
 * @param {String} className
 * @param {String} attributes
 * @param {String} text
 * @param {String} iconName - icon name from sprite(folder to see icon names - ./src/assets/s3d/svg-sprite)
 * @param {"secondary"|"primary"} [type=primary] - pointer position
 * @returns
 */
export default function BigButton(className, attributes, text, iconName, type = 'primary') {
  let typeClassName = '';

  switch (type) {
    case 'secondary':
      typeClassName = 'BigButton--secondary';
      break;

    default:
      break;
  }

  return `
    <button class="BigButton ${className} ${typeClassName}" ${attributes}>
      ${s3d2spriteIcon(iconName, 'BigButton__icon')}
      <span>${text}</span>
    </button>
  `;
}
