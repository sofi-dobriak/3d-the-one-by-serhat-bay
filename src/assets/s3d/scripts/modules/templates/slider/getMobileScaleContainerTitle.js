export default function getMobileScaleContainerTitle(i18n, slider_scale_container_logo) {
    return `
        <div data-slider-mobile-scale-container class="text-gray-900 s3d__flyby-mobile-scale-info-box">
            <div>${slider_scale_container_logo ? `<img src="${slider_scale_container_logo}" alt="Logo">` : i18n.t('Flyby.mobile_scale_title_block.title_1')}</div>
            <div>${i18n.t('Flyby.mobile_scale_title_block.title_2')}</div>
        </div>
    `
}

export function $mobileScaleSwitcher() {
    return `
    <button type="button" class="s3d__flyby-mobile-scale-switcher" data-slider-mobile-scale-switcher>
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 64 64" fill="none" >
            <path d="M28.27 47.948C39.1705 47.948 48.007 39.1114 48.007 28.211C48.007 17.3106 39.1705 8.474 28.27 8.474C17.3696 8.474 8.53302 17.3106 8.53302 28.211C8.53302 39.1114 17.3696 47.948 28.27 47.948Z" stroke="var(--s3d2-color-gray-500)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M42.245 42.1479L56.23 56.287" stroke="var(--s3d2-color-gray-500)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.401 28.2109H38.138" stroke="var(--s3d2-color-gray-500)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path class="remove-when-zoom-in" d="M28.27 38.08V18.343" stroke="var(--s3d2-color-gray-500)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
    `
}