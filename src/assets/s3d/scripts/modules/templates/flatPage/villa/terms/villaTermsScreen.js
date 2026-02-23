import VillaFinancialTermsCard from './villaTermsCard';
export default function VillaFinancialTermsScreen(i18n, financialTermsData) {
  if (!financialTermsData.length) {
    return '';
  }
  return `
    <div class="s3d-villa__financial-terms-screen">
       <div class="s3d-villa__floor__title-wrap">
                <div class="s3d-villa__floor__title-wrap__line"></div>
                <span class="s3d-villa__floor__title"> ${i18n.t(
                  'Flat.financial_terms_title',
                )}</span>
                <div class="s3d-villa__floor__title-wrap__line"></div>
            </div>
        <div class="s3d-villa__financial-terms-list">        
        ${financialTermsData
          .map(el => {
            // return el.title;
            return VillaFinancialTermsCard(el, i18n);
          })
          .join('')}
        </div>
    </div>
  `;
}
