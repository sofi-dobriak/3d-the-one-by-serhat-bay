import { TOOLTIP_ATTR_DONT_SHOW_WHEN_HAVE_CLASSNAME, TOOLTIP_ATTRIBUTE } from "../../../../s3d2/scripts/constants";
import s3d2spriteIcon from "../../../../s3d2/scripts/templates/spriteIcon";

function $addToFavourite(i18n, flat, favouritesIds$) {
  const { id } = flat;
  const isFavourite = favouritesIds$.value.includes(id);
  return `
      <label ${TOOLTIP_ATTR_DONT_SHOW_WHEN_HAVE_CLASSNAME}="added-to-favourites" ${TOOLTIP_ATTRIBUTE}="${i18n.t('card--add_to_compare')}" aria-label="button" aria-role="button" data-id="${id}" data-key="id" class="s3d__add-to-favourite js-s3d-add__favourite ${isFavourite ? 'added-to-favourites' : ''}">
         <input type="checkbox" data-key="checked" ${isFavourite ? 'checked' : ''}/>
         ${s3d2spriteIcon('Compare')}
      </label>
  `;
}

export default $addToFavourite;
