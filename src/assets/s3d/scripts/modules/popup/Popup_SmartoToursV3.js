
import EventEmitter from '../eventEmitter/EventEmitter';
import asyncRequest from "../async/async";
import SmartoToursV3 from "../../../../s3d2/scripts/modules/AudioAssistant/SmartoToursV3";
import { isJson } from '../helpers/helpers';

const init = (url, containerSelector, i18n) => {
    const tourDataUrl = url;

    if (!tourDataUrl) return;
    const SMARTO_TOURS_V3_CONTAINER_SELECTOR = containerSelector;

    asyncRequest({
        url: tourDataUrl,
        method: 'get',
    })
        .then(data => {
            console.log('Smarto Tours data received:', JSON.parse(data));
            if (!isJson(data)) {
                console.error('Invalid JSON received for Smarto Tours');
            }
            if (!data) {
                console.error('No data received for Smarto Tours');
                return;
            }

            const tour3Data = JSON.parse(data);
            const premises = tour3Data.data;
            premises.forEach((premise, index) => {
                if (isJson(premise.tour_v2_premise_hotspots)) {
                    premises[index].tour_v2_premise_hotspots = JSON.parse(premise.tour_v2_premise_hotspots);
                }
            });

            console.log('tour3Data', tour3Data);

            const smartoTours = new SmartoToursV3({
                $container: document.querySelector(SMARTO_TOURS_V3_CONTAINER_SELECTOR),
                data: premises,
                scrollableElement: false,
                flat_level_photos: tour3Data.flat_level_photos,
                flat_plan: tour3Data.flat_plan,
                infoHotspotTranslations: tour3Data.infoHotspotTranslations,
                i18n: i18n,
            });
            smartoTours.init();
            window.addEventListener(
                'updateFsm',
                () => {
                    smartoTours.destroy();
                },
                { once: true },
            );
        })
        .catch(error => {
            console.error('Error initializing Smarto Tours:', error);
        });
}


/**
 * Represents a Popup view.
 * @extends EventEmitter
 */
export default class Popup_SmartoToursV3 extends EventEmitter {
    /**
     * Creates a Popup instance.
     * @param {string} href - The URL of the popup content.
     * @param {string} title - The title of the popup.
     * @param {string} text - The text content of the popup.
     */
    constructor(href, title, text, i18n) {
        super();
        this.href = href;
        this.title = title;
        this.text = text;
        this.containerClassName = 'vr-popup';
        const url = new URL(this.href, window.location.origin);
        const hrefExtension = url.pathname.split('.').pop();

        this.type = 'iframe';
        if (hrefExtension.match(/^(jpg|png|jpeg|webp|gif)/i)) {
            this.type = 'image';
        }
        this.i18n = i18n;
    }

    /**
     * Get the HTML markup for the text content of the popup.
     * @returns {string} The HTML markup for the text content.
     */
    get $text() {
        return this.text
            ? `
      <div class="${this.containerClassName}__text">
        ${this.text}
      </div>
    `
            : '';
    }

    /**
     * Get the HTML markup for the title of the popup.
     * @returns {string} The HTML markup for the title.
     */
    get $title() {
        return this.title
            ? `
      <div class="${this.containerClassName}__title">
        ${this.title}
      </div>
    `
            : '';
    }

    /**
     * Render the popup view.
     */
    render() {
        const layout = `
            <div class="${this.containerClassName}">
                <div class="${this.containerClassName}__content">
                <div class="${this.containerClassName}__text-wrapper">
                    ${this.$title}
                    ${this.$text}
                </div>
                <div class="${this.containerClassName}__tours-v-3-wrapper">
                </div>
                </div>
                <div class="vr-popup__close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99995 7.29297L8.35351 7.64652L12.5 11.793L16.6464 7.64652L17 7.29297L17.7071 8.00008L17.3535 8.35363L13.2071 12.5001L17.3535 16.6465L17.7071 17.0001L17 17.7072L16.6464 17.3536L12.5 13.2072L8.35351 17.3536L7.99995 17.7072L7.29285 17.0001L7.6464 16.6465L11.7928 12.5001L7.6464 8.35363L7.29285 8.00008L7.99995 7.29297Z" fill="#1A1E21"/>
                </svg>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', layout);
        document
            .querySelector(`.${this.containerClassName} .${this.containerClassName}__close`)
            .addEventListener(
                'click',
                () => {
                    document.querySelector(`.${this.containerClassName}`).remove();
                },
                { once: true },
            );
        
        init(this.href, `.${this.containerClassName}__tours-v-3-wrapper`, this.i18n);
    }
}
