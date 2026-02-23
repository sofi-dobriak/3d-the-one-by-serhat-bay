export function VillaExplicationPropertyRow(title, value, i18n) {
  return `
      <div class="s3d-villa__floor-explication-screen-info-row">
        <div class="s3d-villa__floor-explication-screen-info-row-title">${title}</div>
        <div class="s3d-villa__floor-explication-screen-info-row-blank"></div>
        <div class="s3d-villa__floor-explication-screen-info-row-value">
          ${value}
        </div>
      </div>
    `;
}
