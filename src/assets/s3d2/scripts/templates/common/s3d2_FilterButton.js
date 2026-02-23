export default function s3d2_FilterButton(text) {
  return `
    <button type="button" class="js-ctr-btn js-s3d-ctr__filter s3d2-filter-call-button">

    <span>${text}</span>

    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  fill="none">
      <path d="M11.1465 17.293L15.793 12.6465L6 12.6465L6 11.6465L15.793 11.6465L11.1465 7L11.8535 6.29297L17.707 12.1465L11.8535 18L11.1465 17.293Z" fill="var(--s3d2-color-icon-gray-900)"/>
    </svg>
    </button>`;
}
