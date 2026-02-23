import { hideElementsAttribute } from '../../../../s3d/scripts/features/hideElementsOnPages';
// export default function s3d2_ToggleButton({
//   dataAttr = 'data-hightlight-svg-elements',
//   wrapperDataAttr = '',
// }) {
//   return `
//   <label for="${dataAttr}" class="s3d-ctr__menu-3d-btn-style " ${hideElementsAttribute([
//     '',
//   ])} ${wrapperDataAttr}>
//       <input type="checkbox" id=${dataAttr} class="s3d2-toggle-input"/>
//       <label for=${id} class="s3d2-toggle-label"></label>
//   </label>
//   `;
// }

export default function $s3d2_ToggleButton(
  i18n,
  dataAttr = 'data-hightlight-svg-elements',
  name = '',
  wrapperDataAttr = '',
) {
  return `
      <div class="s3d2-toggle-label-wrap " ${hideElementsAttribute([''])} ${wrapperDataAttr}>
        <p class="fonts-3d-small-strikeshrought">${i18n.t('ctr.nav.availability')}</p>
        <div class="s3d2-toggle-checkbox-wrapper">
          <input type="checkbox" name="${name}" ${dataAttr}  id="${dataAttr}"  class="s3d2-toggle-input"/>
          <label for="${dataAttr}" class="s3d2-toggle-label"></label>
        </div>
      </div>
    `;
}
