/**
 *
 * @param {String} className
 * @param {String} attributes
 * @param {String} text
 * @param {''|'secondary'|'alert'} viewType
 * @param {string} type
 * @returns String
 */

export default function s3d2_ButtonWithoutIcon(
  className,
  attributes,
  text,
  viewType = '',
  type = 'button',
) {
  switch (viewType) {
    case 'secondary':
      className += ' ButtonWithoutIcon--secondary';
      break;
    case 'alert':
      className += ' ButtonWithoutIcon--alert';
      break;
  }

  return `
    <button class="s3d2-ButtonWithoutIcon ${className}" ${attributes} type="${type}">
      <span>${text}</span>
    </button>
  `;
}
