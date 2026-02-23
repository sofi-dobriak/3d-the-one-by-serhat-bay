import { TOOLTIP_ATTRIBUTE } from "../../../../../../../s3d2/scripts/constants";
import { numberWithCommas } from "../../../../../../../s3d2/scripts/helpers/helpers_s3d2";
import { bigIcons } from "../../../../../../../s3d2/scripts/templates/common/icons/big-icons";

export default function s3dVillaFloorDetails(i18n, flat, show_prices) {

  const currency = i18n.t('currency_label');

  const $promoPrice = () => {
    if (!show_prices) return '';
    if (flat.promo_price) {
      return `
            <div class="s3d-villa__floor-details__info-prices-full">
                <span class="s3d-villa__floor-details__info-prices-full-without-promo">
                  ${currency === '$' ? `${i18n.t('currency_label')} ${numberWithCommas(flat.price)}` : `${numberWithCommas(flat.price)} ${i18n.t('currency_label')}`} 
                </span>
                <span class="s3d-villa__floor-details__info-prices-full-with-promo">
                  ${currency === '$' ? `${i18n.t('currency_label')} ${numberWithCommas(flat.promo_price)}` : `${numberWithCommas(flat.promo_price)} ${i18n.t('currency_label')}`}
                </span>
            </div>
      `;
    }
    return `
      <div class="s3d-villa__floor-details__info-prices-full">
        <span class="s3d-villa__floor-details__info-prices-full-with-promo">
          ${currency === '$' ? `${i18n.t('currency_label')} ${numberWithCommas(flat.price)}` : `${numberWithCommas(flat.price)} ${i18n.t('currency_label')}`} 
        </span>
      </div>
    `;
  }

  const $promoPriceM2 = () => {
    if (!show_prices) return '';
    if (flat.promo_price_m2) {
      return `
        <span class="s3d-villa__floor-details__info-prices-perm-without-promo">
          ${currency === '$' ? `${i18n.t('currency_label')} ${numberWithCommas(flat.price_m2)} ${i18n.t('area_unit')}` : `${numberWithCommas(flat.price_m2)} ${i18n.t('area_unit')} ${i18n.t('currency_label')}`}
        </span>

        <span class="s3d-villa__floor-details__info-prices-perm-with-promo">
          ${currency === '$' ? `${i18n.t('currency_label')} ${numberWithCommas(flat.promo_price_m2)} ${i18n.t('area_unit')}` : `${numberWithCommas(flat.promo_price_m2)} ${i18n.t('area_unit')} ${i18n.t('currency_label')}`}
        </span>
      `;
    }
    return `
        <span class="s3d-villa__floor-details__info-prices-perm-with-promo">
          ${currency === `$` ? `${i18n.t('currency_label')} ${numberWithCommas(flat.price_m2)} ${i18n.t('area_unit')}` : `${numberWithCommas(flat.price_m2)} ${i18n.t('area_unit')} ${i18n.t('currency_label')}`}
        </span>
    `
  }

  const $discoutLabel = () => {
    if (!show_prices || !flat.discount) return '';
    return `
      <div class="s3d-villa__floor-details__info-prices-promo-wrap" >
          <svg class="s3d-villa__floor-details__info-prices-promo-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13404 11.866 1 8 1C4.13404 1 1 4.13404 1 8C1 11.866 4.13404 15 8 15ZM9.18356 11.7733L9.2942 11.2933L9.29417 11.2933C9.23716 11.3218 9.1449 11.3547 9.01758 11.3919C8.89016 11.4292 8.77617 11.4479 8.67562 11.4479C8.46108 11.4479 8.31015 11.4106 8.22303 11.3359C8.13581 11.2613 8.09225 11.1208 8.09225 10.9146C8.09225 10.8328 8.10568 10.7119 8.13255 10.552C8.15932 10.3919 8.18954 10.2497 8.22303 10.1253L8.63534 8.57322C8.67564 8.43105 8.70329 8.27465 8.71831 8.10388C8.73342 7.93323 8.74103 7.81412 8.74103 7.74665C8.74103 7.41948 8.63287 7.15371 8.41664 6.94932C8.20041 6.74481 7.89282 6.64256 7.49387 6.64256C7.2726 6.64256 7.0379 6.68436 6.78987 6.76796C6.54175 6.85144 6.28195 6.95191 6.01042 7.06925L5.89979 7.54926C5.98021 7.5172 6.07661 7.48347 6.18892 7.44795C6.30123 7.41233 6.41107 7.39463 6.51834 7.39463C6.73624 7.39463 6.88372 7.4337 6.96086 7.51196C7.03791 7.59011 7.07653 7.72883 7.07653 7.92787C7.07653 8.03819 7.06389 8.15992 7.0388 8.29329C7.01361 8.42655 6.98259 8.56799 6.94575 8.71727L6.53334 10.2746C6.4965 10.4382 6.46973 10.5849 6.45294 10.7146C6.43614 10.8444 6.42775 10.9715 6.42775 11.0959C6.42775 11.4159 6.53928 11.6799 6.76222 11.8879C6.98515 12.096 7.2978 12.2 7.70002 12.2C7.96159 12.2 8.19114 12.1635 8.38899 12.0906C8.58674 12.0177 8.85167 11.912 9.18356 11.7733ZM9.11056 5.47201C9.30338 5.28175 9.39979 5.05148 9.39979 4.78131C9.39979 4.5111 9.30337 4.28001 9.11056 4.08798C8.91784 3.89595 8.68571 3.79999 8.41407 3.79999C8.14251 3.79999 7.9096 3.89594 7.71511 4.08798C7.52072 4.28003 7.42342 4.51113 7.42342 4.78131C7.42342 5.05148 7.52072 5.28176 7.71511 5.47201C7.90962 5.66226 8.14254 5.75728 8.41407 5.75728C8.68571 5.75728 8.91784 5.66226 9.11056 5.47201Z" fill="#DBE4EC"/>
          </svg>
          <span class="s3d-villa__floor-details__info-prices-promo-title">${flat.discount}% ${i18n.t('Flat.discount')}</span>
      </div>
    `;
  }

  return `
        <div class="s3d-villa__floor-details">
            <div class="s3d-villa__floor-details__info-wrapper">
                <div class="s3d-villa__floor-details__info-img-wrapper">
                    <img class="s3d-villa__floor-details__info-img" src="${
                      flat.project_image_detailed
                    }">
                </div>
                <div class="s3d-villa__floor-details__info">
                    <div class="s3d-villa__floor-details__info-status-wrap" ${flat.sale == 1 ? `${TOOLTIP_ATTRIBUTE}="${i18n.t('unit_statuses.1_tooltip')}"` : ''}>
                        <span class="s3d-villa__floor-details__info-status__title">${i18n.t(
                          `sales.${flat.sale}`,
                        )}</span>

                        <div class="s3d-villa__floor-details__info-status__svg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13404 11.866 1 8 1C4.13404 1 1 4.13404 1 8C1 11.866 4.13404 15 8 15ZM9.18356 11.7733L9.2942 11.2933L9.29417 11.2933C9.23716 11.3218 9.1449 11.3547 9.01758 11.3919C8.89016 11.4292 8.77617 11.4479 8.67562 11.4479C8.46108 11.4479 8.31015 11.4106 8.22303 11.3359C8.13581 11.2613 8.09225 11.1208 8.09225 10.9146C8.09225 10.8328 8.10568 10.7119 8.13255 10.552C8.15932 10.3919 8.18954 10.2497 8.22303 10.1253L8.63534 8.57322C8.67564 8.43105 8.70329 8.27465 8.71831 8.10388C8.73342 7.93323 8.74103 7.81412 8.74103 7.74665C8.74103 7.41948 8.63287 7.15371 8.41664 6.94932C8.20041 6.74481 7.89282 6.64256 7.49387 6.64256C7.2726 6.64256 7.0379 6.68436 6.78987 6.76796C6.54175 6.85144 6.28195 6.95191 6.01042 7.06925L5.89979 7.54926C5.98021 7.5172 6.07661 7.48347 6.18892 7.44795C6.30123 7.41233 6.41107 7.39463 6.51834 7.39463C6.73624 7.39463 6.88372 7.4337 6.96086 7.51196C7.03791 7.59011 7.07653 7.72883 7.07653 7.92787C7.07653 8.03819 7.06389 8.15992 7.0388 8.29329C7.01361 8.42655 6.98259 8.56799 6.94575 8.71727L6.53334 10.2746C6.4965 10.4382 6.46973 10.5849 6.45294 10.7146C6.43614 10.8444 6.42775 10.9715 6.42775 11.0959C6.42775 11.4159 6.53928 11.6799 6.76222 11.8879C6.98515 12.096 7.2978 12.2 7.70002 12.2C7.96159 12.2 8.19114 12.1635 8.38899 12.0906C8.58674 12.0177 8.85167 11.912 9.18356 11.7733ZM9.11056 5.47201C9.30338 5.28175 9.39979 5.05148 9.39979 4.78131C9.39979 4.5111 9.30337 4.28001 9.11056 4.08798C8.91784 3.89595 8.68571 3.79999 8.41407 3.79999C8.14251 3.79999 7.9096 3.89594 7.71511 4.08798C7.52072 4.28003 7.42342 4.51113 7.42342 4.78131C7.42342 5.05148 7.52072 5.28176 7.71511 5.47201C7.90962 5.66226 8.14254 5.75728 8.41407 5.75728C8.68571 5.75728 8.91784 5.66226 9.11056 5.47201Z" fill="#FAFBFE"/>
                            </svg>
                            <div class="s3d-villa__floor-details__info-status__svg-tip"></div>
                        </div>
                    </div>
                    <div class="s3d-villa__floor-details__info-prices-wrap">
                        ${$promoPrice()}
                        <div class="s3d-villa__floor-details__info-prices-perm">
                            ${$promoPriceM2()}
                            ${$discoutLabel()}
                        </div>
                            
                    </div>
                </div>  
            </div>
            <div class="s3d-villa__floor-details__info-list">
            ${flat.level ? `
              <div class="s3d-villa__floor-details__info-list-item">
                  <div class="s3d-villa__floor-details__info-list-item__svg-group">
                      <div class="s3d-villa__floor-details__info-list-item__value">
                          ${flat.level}
                      </div>
                      ${bigIcons['stairs']}
                  </div>
                  <div class="s3d-villa__floor-details__info-list-item__title">
                      ${i18n.t('Flat.floor')}
                  </div>
              </div>
                ` : ''}
                ${flat.bathrooms ? `
                  <div class="s3d-villa__floor-details__info-list-item">
                      <div class="s3d-villa__floor-details__info-list-item__svg-group">
                          <div class="s3d-villa__floor-details__info-list-item__value">
                              ${flat.bathrooms}
                          </div>
                          ${bigIcons['bath']}
                      </div>
                      <div class="s3d-villa__floor-details__info-list-item__title">
                          ${i18n.t('Flat.bathroom')}
                      </div>
                  </div>
                  ` : ''}
                ${flat.bedrooms ? `
                  <div class="s3d-villa__floor-details__info-list-item">
                      <div class="s3d-villa__floor-details__info-list-item__svg-group">
                          <div class="s3d-villa__floor-details__info-list-item__value">
                              ${flat.bedrooms}
                          </div>
                          ${bigIcons['bedroom']}
                      </div>
                      <div class="s3d-villa__floor-details__info-list-item__title">
                          ${i18n.t('Flat.bedrooms')}
                      </div>
                  </div>
                  
                  ` : ''}
                ${flat.garages ? `
                  <div class="s3d-villa__floor-details__info-list-item">
                    <div class="s3d-villa__floor-details__info-list-item__svg-group">
                        <div class="s3d-villa__floor-details__info-list-item__value">
                            ${flat.garages}
                        </div>
                        ${bigIcons['garage']}
                    </div>
                    <div class="s3d-villa__floor-details__info-list-item__title">
                        ${i18n.t('Flat.garage')}
                    </div>
                </div>
                ` : ''}
                ${flat.pool ? `
                  <div class="s3d-villa__floor-details__info-list-item">
                      <div class="s3d-villa__floor-details__info-list-item__svg-group">
                          <div class="s3d-villa__floor-details__info-list-item__value">
                              ${flat.pool}
                          </div>
                          ${bigIcons['pool']}
                      </div>
                      <div class="s3d-villa__floor-details__info-list-item__title">
                          ${i18n.t('Flat.pools')}
                      </div>
                  </div>
                ` : ''}
            </div>
        </div>
        `;
}
