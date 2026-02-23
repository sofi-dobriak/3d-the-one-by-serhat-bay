let AFRAME;

const ensureAframeLoaded = async () => {
  if (AFRAME) return AFRAME;

  const aframeModule = await import(/* webpackChunkName: "aframe" */ 'aframe');
  AFRAME = aframeModule && aframeModule.default ? aframeModule.default : aframeModule;

  // Plugins usually expect globals.
  if (typeof window !== 'undefined') {
    window.AFRAME = window.AFRAME || AFRAME;
    window.THREE = window.THREE || (AFRAME && AFRAME.THREE);
  }

  await import(/* webpackChunkName: "aframe-troika-text" */ 'aframe-troika-text');

  return AFRAME;
};
import gsap from 'gsap';
import Toastify from 'toastify-js';
import { isJson } from '../../../../s3d/scripts/modules/helpers/helpers';
import debounce from 'lodash/debounce';
import floor from 'lodash/floor';
import get from 'lodash/get';
import { BehaviorSubject } from 'rxjs';
import { Vector3, MathUtils } from 'three';
// window.THREE = THREE; // aframe requires THREE to be available on the window object

window.Vector3 = Vector3; // aframe-troika-text requires THREE.Vector3 to be available on the window object
class SmartoTourAssets {
  constructor() {}

  get $scene() {
    return this.$container.querySelector('a-scene');
  }

  get $camera() {
    return this.$container.querySelector('a-camera');
  }

  get $title() {
    return this.$container.querySelector(`[${this.TITLE_ATTRIBUTE}]`);
  }

  get $hotspots() {
    return this.$container.querySelectorAll('.collidable');
  }

  getNavButtons() {
    return `
            <div class="s3d-smarto-tours__navbar">
                ${this.data.fields
                  .map(
                    el =>
                      `<button class="ButtonIconLeft" type="button" data-aframe-src="#${el.title}"><span>${el.image_title}</span></button>`,
                  )
                  .join('')}
            </div>
        `;
  }

  getCamera() {
    return `
            <a-entity id="rig" position="0 0 0">
                <a-camera
                    id="cam"
                    wasd-controls-enabled="false"
                    look-controls="reverseMouseDrag: true;"
                    cursor__mouse="rayOrigin: mouse;"
                    raycaster="objects: .collidable, [html-projector];">
                </a-camera>
            </a-entity>
        `;
  }
  getFlatGenplan(flat_plan_data = [], tourData, flat_level_photos = {}) {
    const url = get(Object.values(flat_level_photos), '[0].url', false);
    if (!url || !flat_plan_data.length) return '';

    return `
        <div class="flat-plan">
            <img src="${url}" alt="">
            ${flat_plan_data
              .map((data, index) => {
                const { left, top, scene, id, angle } = data;
                const sceneForThisLink = Object.entries(tourData.fields).find(
                  el1 => el1[0] == scene,
                )
                  ? Object.entries(tourData.fields).find(el1 => el1[0] == scene)[1]
                  : null;

                if (!sceneForThisLink) return '';
                return `
                    <div class="flat-plan-pin"
                        data-angle="${angle}" style="left: ${left - 10}px; top: ${top - 10}px"
                        data-key="${scene}"
                        data-aframe-src="#${sceneForThisLink.title}"
                        data-preview-pin-level="${sceneForThisLink.property_level}"
                    >
                        <svg width="162" height="162" viewBox="0 0 162 162" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M80.6672 86.2653C80.2723 86.6675 79.6231 86.6641 79.2325 86.2577L4.75562 8.76597C4.59064 8.59431 4.49926 8.3638 4.61637 8.15651C5.51455 6.56672 13.3208 9.04815e-10 81 7.47478e-09C136.657 1.28776e-08 152.49 6.04455 156.086 7.93914C156.6 8.20971 156.654 8.85243 156.247 9.26668L80.6672 86.2653Z" fill="var(--color-brand-800, #fff)" fill-opacity="0.55"/>
                            <path d="M81 0.5C136.648 0.500001 152.374 6.54861 155.854 8.38184C155.962 8.43892 156.006 8.52088 156.015 8.60352C156.024 8.69259 155.994 8.81009 155.891 8.91602L80.3105 85.915C80.1131 86.1162 79.7881 86.1143 79.5928 85.9111L5.11621 8.41992L5.07422 8.36719C5.24928 8.086 5.82065 7.45426 7.61328 6.66895C9.47796 5.85207 12.61 4.89126 17.8516 3.97461C28.3331 2.14159 47.1709 0.5 81 0.5Z" stroke="#fff" stroke-opacity="0.7"/>
                        </svg>
                    </div>
                `;
              })
              .join('')}
        </div>
        `;
  }
  getLayout({ uniqueByLevel }) {
    return `
            <div class="s3d-smarto-tours__menu">
                <div class="s3d-smarto-tours__nav-button s3d-smarto-tours__floorplan-toggle" title="${this.i18n.t(
                  'SmartoTours.floor_show_or_hide',
                )}">
                    <svg viewBox="0 0 183 186" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M160.6 27V159.8H23V84.6H75.8V77.4H91.8V100.6H39V143.8H75V117.4H91V143.8H143.8V103.8H113.4V87.8H143.8V43H75.8V27H160.6Z" fill="black"/>
                    </svg>
                </div>
                <div class="s3d-smarto-tours__nav-button" data-smarto-tours-nav title="${this.i18n.t(
                  'SmartoTours.menu',
                )}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.7471 15.7528L19.7471 16.7528L4.25195 16.7528L4.25195 15.7528L19.7471 15.7528ZM19.7471 11.4999L19.7471 12.4999L4.25195 12.4999L4.25195 11.4999L19.7471 11.4999ZM13.5352 7.24695L13.5352 8.24695L4.25195 8.24695L4.25195 7.24695L13.5352 7.24695Z" fill="#EB5757"/>
                    </svg>
                </div>
            </div>
            ${this.getNavButtons()}
            ${this.getScene(`
                <div class="s3d-smarto-tours__css-hotspots-wrapper">
                </div>
            `)}
            ${this.getTitleContainer()}
            ${this.getOptionsContainer()}
            <style>
                .s3d-smarto-tours__css-hotspots-wrapper {
                    position: absolute;
                    inset: 0;               /* top:0; right:0; bottom:0; left:0 */
                    pointer-events: none;
                    overflow: visible;
                    z-index: 2;
                }


            </style>
            <div class="flatplan-wrapper">
                <div class="flatplan-wrapper__nav">
                    ${uniqueByLevel
                      .map((levelData, index) => {
                        const title = get(
                          this.customFloorTitles,
                          levelData.property_level,
                          `${this.i18n.t('SmartoTours.floor')} ${levelData.property_level}`,
                        );
                        const order = get(this.customNavFloorsOrders, index, null);
                        return `<div ${
                          order ? `style="order: ${order}"` : ''
                        } class="flat-plan-level-button" data-flatplan-floor-button="${
                          levelData.property_level
                        }" data-aframe-src="#${levelData.title}">
                                ${title}
                            </div>
                        `;
                      })
                      .join('')}
                </div>
                ${this.getFlatGenplan(this.flat_plan_data, this.data, this.data.flat_level_photos)}
            </div>
        `;
  }

  findClosestScrollableParent(element) {
    let parent = element.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY;
      const overflowX = style.overflowX;

      // Check if the element has explicit scroll properties or if its content overflows
      if (
        overflowY === 'auto' ||
        overflowY === 'scroll' ||
        overflowX === 'auto' || overflowX === 'scroll' ||
        parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    // If no scrollable parent is found, the window itself is the scrollable container
    return window;
  }
}

export default class SmartoTours extends SmartoTourAssets {
  constructor(config) {
    super();
    this.$container = config.$container;
    this.data = config.data;
    this.now = Date.now();
    this.SPHERE_RADIUS = 30;
    this.HOTSPOT_ASSETS_ID = 'hotspot-img';
    this.scrollableElement = config.scrollableElement || window;
    this.i18n = config.i18n;
    this.customFloorTitles = config.customFloorTitles || {};
    this.customNavFloorsOrders = config.customNavFloorsOrders || [];

    this.TITLE_ATTRIBUTE = 'data-smarto-tours-title-container';
    this.OPTIONS_ATTRIBUTE = 'data-smarto-tours-options-container';

    this.defaultScene =
      config.defaultSceneIndex && this.data.fields[config.defaultSceneIndex]
        ? this.data.fields[config.defaultSceneIndex]
        : this.data.fields[0];
    this.LOADED_SCENES = [];

    this.debouncedResize = debounce(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);

    this.navBar = new BehaviorSubject({
      floorPlanVisible: false,
      navMenuVisible: false,
    });

    this.navBar.subscribe(visible => {
      const flatPlan = this.$container.querySelector('.flatplan-wrapper');
      if (!flatPlan) return;
      flatPlan.classList.toggle('visible', visible.floorPlanVisible);
    });
    this.navBar.subscribe(visible => {
      const navbar = this.$container.querySelector('.s3d-smarto-tours__navbar');
      if (!navbar) return;
      navbar.classList.toggle('visible', visible.navMenuVisible);
      //data-smarto-tours-nav
    });

    this.data.fields.forEach(el => {
      const image_pin_data = el.image_pin_data;
      if (isJson(image_pin_data)) {
        el.image_pin_data = JSON.parse(image_pin_data);
      }
    });

    this.flat_plan_data = isJson(this.data.flat_plan) ? JSON.parse(this.data.flat_plan) : [];
  }

  async init() {
    await ensureAframeLoaded();

    if (!AFRAME.isComponentsRegistered) {
      this.registerHtmlProjectorComponent();
      this.registerLaserEventsComponent();
      AFRAME.isComponentsRegistered = true;
    }

    this.$container.classList.add('s3d-smarto-tours');

    const uniqueByLevel = [
      ...new Map(this.data.fields.map(item => [item.property_level, item])).values(),
    ];

    this.$container.innerHTML = this.getLayout({ uniqueByLevel });

    this.initShader();
    this.initCustomFullscreenHandler();

    this.$scene.addEventListener(
      'loaded',
      () => {
        this.loadDefaultScene();
      },
      { once: true },
    );

    this.$container.addEventListener('click', evt => {
      const target = evt.target.closest('[data-aframe-src]');
      if (target) this.changeScene(target.getAttribute('data-aframe-src'), target);
    });

    this.$hotspots.forEach(el => {
      el.addEventListener('click', evt => {
        this.changeScene(el.getAttribute('data-scene'));
      });
    });

    this.$container.addEventListener('pointerdown', evt => {
      this.isPointerDown = true;
      this.pointerYDelta = 0;
      this.pointerYStart = evt.clientY;
      this.startScrollTop =
        this.scrollableElement === window ? window.scrollY : this.scrollableElement.scrollTop;
    });
    this.$container.addEventListener('pointermove', evt => {
      if (!this.isPointerDown) return;
      const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      const targetElement = this.scrollableElement;
      evt.preventDefault();

      this.pointerYDelta = evt.clientY - this.pointerYStart;
      this.handleFlatPlanPins();

      if (!isTouchDevice) return;

      console.log('-this.pointerYDelta', -this.pointerYDelta);

      if (targetElement === window) {
        // window.scrollBy(0, -this.pointerYDelta);
        requestAnimationFrame(() => {
          if (window.scrollY - this.pointerYDelta <= 0) return;
          window.scrollTo(0, this.startScrollTop - this.pointerYDelta);
        });
      } else {
        requestAnimationFrame(() => {
          if (targetElement.scrollTop - this.pointerYDelta <= 0) return;
          // targetElement.scrollTop = this.startScrollTop - this.pointerYDelta;
          targetElement.scrollTo({
            top: this.startScrollTop - this.pointerYDelta,
            behavior: 'instant',
          });
          // targetElement.scrollBy({ top: -this.pointerYDelta, behavior: 'instant'});
        });
      }
    });

    this.$container.addEventListener('pointerup', () => {
      this.isPointerDown = false;
    });

    this.$container
      .querySelector('.s3d-smarto-tours__floorplan-toggle')
      .addEventListener('click', () => {
        this.navBar.next({
          ...Object.entries(this.navBar.value).reduce((acc, [key, value]) => {
            acc[key] = false;
            return acc;
          }, {}),
          floorPlanVisible: !this.navBar.value.floorPlanVisible,
        });
      });
    this.$container.querySelector('[data-smarto-tours-nav]').addEventListener('click', () => {
      this.navBar.next({
        ...Object.entries(this.navBar.value).reduce((acc, [key, value]) => {
          acc[key] = false;
          return acc;
        }, {}),
        navMenuVisible: !this.navBar.value.navMenuVisible,
      });
    });
    this.scrollableElement.addEventListener('scroll', this.debouncedResize);
  }

  loadDefaultScene() {
    const assets = this.$scene.querySelector('a-assets');
    this.data.fields.forEach((el, index) => {
      if (this.defaultScene && this.defaultScene.title != el.title) {
        return '';
      }
      this.LOADED_SCENES[index] = el;
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.id = el.title;
      img.src = el.img.url;
      img.onload = () => {
        this.changeScene(`#${this.defaultScene.title}`);
        this.loadRestScenes();
        setTimeout(() => {
          this.$container.querySelector('[data-custom-loading-screen]').remove();
        }, 1500);
      };

      assets.appendChild(img);
    });
  }

  loadRestScenes() {
    const assets = this.$scene.querySelector('a-assets');
    const lazyLoadedScenes = this.data.fields.map((scene, index) => {
      if (this.LOADED_SCENES[index]) return '';
      const element = document.createElement('img');
      element.crossOrigin = 'anonymous';
      element.id = scene.title;
      element.src = scene.img.url;
      element.onload = () => {
        this.LOADED_SCENES[index] = scene;
      };
      return element;
    });

    lazyLoadedScenes.forEach(scene => {
      if (!scene) return;
      assets.appendChild(scene);
    });
  }

  initCustomFullscreenHandler() {
    if (AFRAME.utils.device.checkHeadsetConnected()) return;
    this.isCustomFullscreen = true;
    this.$container
      .querySelector('a-scene')
      .setAttribute(
        'xr-mode-ui',
        `enabled: ${AFRAME.utils.device.checkHeadsetConnected() ? 'true' : 'false'}`,
      );
    this.$container.addEventListener('click', evt => {
      const target = evt.target.closest('[data-smarto-tours-fullscreen]');
      if (!target) return;
      if (!document.fullscreenElement) {
        this.$container.requestFullscreen().catch(err => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
          );
        });
      } else {
        document.exitFullscreen();
      }
    });

    document.addEventListener('fullscreenchange', function() {
      if (document.fullscreenElement) {
        // Browser is in fullscreen mode
        this.$container.querySelector('[data-smarto-tours-fullscreen]').classList.add('active');
        // Perform actions specific to fullscreen
      } else {
        // Browser has exited fullscreen mode
        this.$container.querySelector('[data-smarto-tours-fullscreen]').classList.remove('active');
        // Perform actions specific to exiting fullscreen
      }
    });

    this.$container.querySelector(`[${this.OPTIONS_ATTRIBUTE}]`).innerHTML = `
            <div class="s3d-smarto-tours__nav-button s3d-smarto-tours__nav-button--fullscreen" title="${this.i18n.t(
              'SmartoTours.fullscreen',
            )}" data-smarto-tours-fullscreen>
                <svg class="s3d-smarto-tours__nav-button-icon--when-inactive" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6 5.5C5.72386 5.5 5.5 5.72386 5.5 6V9C5.5 9.27614 5.27614 9.5 5 9.5C4.72386 9.5 4.5 9.27614 4.5 9V6C4.5 5.17157 5.17157 4.5 6 4.5H9C9.27614 4.5 9.5 4.72386 9.5 5C9.5 5.27614 9.27614 5.5 9 5.5H6ZM14.5 5C14.5 4.72386 14.7239 4.5 15 4.5H18C18.8284 4.5 19.5 5.17157 19.5 6V9C19.5 9.27614 19.2761 9.5 19 9.5C18.7239 9.5 18.5 9.27614 18.5 9V6C18.5 5.72386 18.2761 5.5 18 5.5H15C14.7239 5.5 14.5 5.27614 14.5 5ZM5 14.5C5.27614 14.5 5.5 14.7239 5.5 15V18C5.5 18.2761 5.72386 18.5 6 18.5H9C9.27614 18.5 9.5 18.7239 9.5 19C9.5 19.2761 9.27614 19.5 9 19.5H6C5.17157 19.5 4.5 18.8284 4.5 18V15C4.5 14.7239 4.72386 14.5 5 14.5ZM19 14.5C19.2761 14.5 19.5 14.7239 19.5 15V18C19.5 18.8284 18.8284 19.5 18 19.5H15C14.7239 19.5 14.5 19.2761 14.5 19C14.5 18.7239 14.7239 18.5 15 18.5H18C18.2761 18.5 18.5 18.2761 18.5 18V15C18.5 14.7239 18.7239 14.5 19 14.5Z" fill="#EB5757"/>
                </svg>
                <svg class="s3d-smarto-tours__nav-button-icon--when-active" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 4.5C9.27614 4.5 9.5 4.72386 9.5 5V8C9.5 8.82843 8.82843 9.5 8 9.5H5C4.72386 9.5 4.5 9.27614 4.5 9C4.5 8.72386 4.72386 8.5 5 8.5H8C8.27614 8.5 8.5 8.27614 8.5 8V5C8.5 4.72386 8.72386 4.5 9 4.5ZM15 4.5C15.2761 4.5 15.5 4.72386 15.5 5V8C15.5 8.27614 15.7239 8.5 16 8.5H19C19.2761 8.5 19.5 8.72386 19.5 9C19.5 9.27614 19.2761 9.5 19 9.5H16C15.1716 9.5 14.5 8.82843 14.5 8V5C14.5 4.72386 14.7239 4.5 15 4.5ZM4.5 15C4.5 14.7239 4.72386 14.5 5 14.5H8C8.82843 14.5 9.5 15.1716 9.5 16V19C9.5 19.2761 9.27614 19.5 9 19.5C8.72386 19.5 8.5 19.2761 8.5 19V16C8.5 15.7239 8.27614 15.5 8 15.5H5C4.72386 15.5 4.5 15.2761 4.5 15ZM16 15.5C15.7239 15.5 15.5 15.7239 15.5 16V19C15.5 19.2761 15.2761 19.5 15 19.5C14.7239 19.5 14.5 19.2761 14.5 19V16C14.5 15.1716 15.1716 14.5 16 14.5H19C19.2761 14.5 19.5 14.7239 19.5 15C19.5 15.2761 19.2761 15.5 19 15.5H16Z" fill="#EB5757"/>
                </svg>


            </div>
        `;
  }

  switchNavButtons(sceneId) {
    this.$container.querySelectorAll('[data-aframe-src]').forEach(btn => {
      btn.classList.remove('ButtonIconLeft--secondary');
      btn.classList.remove('active');
      if (btn.getAttribute('data-aframe-src') === sceneId) {
        btn.classList.add('active');
        if (btn.classList.contains('flat-plan-pin')) return;
        btn.classList.add('ButtonIconLeft--secondary');
      }
    });
  }

  handleFlatPlanPins() {
    const flatPlanPins = this.$container.querySelectorAll('.flat-plan-pin.active');
    flatPlanPins.forEach(pin => {
      const $activeFlatPlanPin = pin;
      const angleOfActiveFlatPlanPin = $activeFlatPlanPin.dataset.angle
        ? +$activeFlatPlanPin.dataset.angle
        : 0;
      const angleOffsetForCurrentPin = gsap.utils.mapRange(
        -180,
        180,
        0,
        360,
        angleOfActiveFlatPlanPin,
      );

      const cameraEl = this.$container.querySelector('#cam');
      if (!cameraEl) return;

      let cameraYaw = cameraEl.getAttribute('rotation').y;

      cameraYaw = ((cameraYaw + 180) % 360) - 180;

      const panoramaYawMapRange = gsap.utils.mapRange(-180, 180, 0, 360, -cameraYaw);

      gsap.to($activeFlatPlanPin.querySelector('svg'), {
        rotate: panoramaYawMapRange + angleOffsetForCurrentPin - 180,
        duration: 0.1,
      });
    });
  }

  handleFlatPlanImage(sceneId) {
    const flatPlan = this.$container.querySelector('.flat-plan img');
    const currentScene = this.data.fields.find(el => `#${el.title}` === sceneId);

    if ([flatPlan, currentScene].some(el => !el)) return;

    const propertyLevel = currentScene.property_level || 1;
    const flatPlanDataForCurrentLevel = this.data.flat_level_photos[propertyLevel];
    flatPlan.src = flatPlanDataForCurrentLevel ? flatPlanDataForCurrentLevel.url : '';

    this.$container.querySelectorAll('[data-preview-pin-level]').forEach(pin => {
      if (pin.dataset.previewPinLevel == propertyLevel) {
        pin.style.display = '';
      } else {
        pin.style.display = 'none';
      }
    });

    this.$container.querySelectorAll('[data-flatplan-floor-button]').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-flatplan-floor-button') == propertyLevel) {
        btn.classList.add('active');
      }
    });
  }

  getTitleContainer() {
    return `
            <div ${this.TITLE_ATTRIBUTE}>
            </div>
        `;
  }

  getOptionsContainer() {
    return `
            <div class="s3d-smarto-tours__options" ${this.OPTIONS_ATTRIBUTE}>
            </div>
        `;
  }

  getScene(children = '') {
    return `
            <a-scene
                light="defaultLightsEnabled: false"
                data-smarto-tours-a-frame-scene
                embedded
                loading-screen="dotsColor: white; backgroundColor: black; enabled: true"
                inspector="url: https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js"
            >
                <div data-custom-loading-screen class="s3d-smarto-tours__loading-screen text-style-3-d-fonts-1920-h-1" slot="loading-screen">
                    <div class="spinner"></div>
                    <span class="loader"></span>
                    <p>Loading...</p>
                </div>
                <a-entity light="type: ambient; color: #fff"></a-entity>
                <a-assets>
                    <img crossorigin="anonymous" id="${
                      this.HOTSPOT_ASSETS_ID
                    }" src="/wp-content/themes/3d/assets/s3d/images/smarto-tours-pin.svg"/>

                </a-assets>
                <a-entity laser-controls="hand: right" raycaster="objects: .collidable; far: ${this
                  .SPHERE_RADIUS * 1.5}" laser-events></a-entity>

                <a-sphere
                    ${Object.entries(this.getSphereAttributes())
                      .map(([key, value]) => `${key}="${value}"`)
                      .join(',\n')}
                >
                </a-sphere>

                <!-- Camera + Cursor. -->
                ${this.getCamera()}
                ${children}
            </a-scene>
        `;
  }

  renderSceneHotSpots() {
    const aScene = this.$container.querySelector('a-scene');
    if (aScene) {
      aScene.querySelectorAll('.collidable').forEach(el => {
        el.parentNode.removeChild(el);
      });
      this.$container.querySelectorAll('[data-hotspot-preview-image]').forEach(img => img.remove());
    }
    this.data.fields.forEach(scene => {
      if (scene.title != this.currentSceneId) return;
      if (this.isCustomFullscreen) return;
      scene.image_pin_data.forEach(hotspot => {
        let hotspotEl = document.createElement('a-entity');
        const attributes = this.getHotspotAttributes(hotspot, scene);
        Object.keys(attributes).forEach(key => {
          hotspotEl.setAttribute(key, attributes[key]);
        });
        aScene.appendChild(hotspotEl);

        const camera = this.$camera;

        setTimeout(() => {
          hotspotEl.object3D.lookAt(camera.object3D.position);
          hotspotEl.insertAdjacentHTML(
            'afterend',
            this.createCurvedImageForHotspotPreview(hotspotEl),
          );
          setTimeout(() => {
            this.$container.querySelectorAll('[data-hotspot-preview-image]').forEach(img => {
              const tagName = img.tagName.toLowerCase();
              img.setAttribute('visible', false);
              // move a bit closer to camera
              const dir = new Vector3();
              dir.subVectors(camera.object3D.position, img.object3D.position).normalize();
              if (tagName == 'a-troika-text') {
                img.object3D.position.addScaledVector(dir, this.SPHERE_RADIUS * 0.05);
              }
              if (tagName == 'a-plane' && !img.hasAttribute('data-hotspot-preview-border')) {
                img.object3D.position.addScaledVector(dir, this.SPHERE_RADIUS * 0.04);
              }
              if (tagName == 'a-image') {
                img.object3D.position.addScaledVector(dir, this.SPHERE_RADIUS * 0.01);
              }
              img.object3D.lookAt(new Vector3().copy(camera.object3D.position));
              // img.setAttribute('visible', true);
            });
          }, 0);
        }, 100);
      });
    });
    document.querySelectorAll('.collidable').forEach(el => {
      el.addEventListener('click', evt => {
        this.changeScene(el.getAttribute('data-scene'), evt);
      });

      el.addEventListener('mouseenter', () => {
        this.$title.textContent = el.getAttribute('data-text') || '';
        this.$container
          .querySelectorAll(`[data-hotspot-preview-image="${el.getAttribute('data-scene')}"]`)
          .forEach(img => {
            img.setAttribute('visible', true);
          });
      });
      el.addEventListener('mouseleave', () => {
        this.$title.textContent = '';
        this.$container
          .querySelectorAll(`[data-hotspot-preview-image="${el.getAttribute('data-scene')}"]`)
          .forEach(img => {
            img.setAttribute('visible', false);
          });
      });
    });
    this.renderCssHotspots();
  }

  renderCssHotspots() {
    const cssContainer = this.$container.querySelector('.s3d-smarto-tours__css-hotspots-wrapper');
    if (!cssContainer) return;
    if (!this.isCustomFullscreen) return;
    const aScene = this.$scene;
    cssContainer.innerHTML = '';
    this.data.fields
      .filter(el => el.title === this.currentSceneId)
      .forEach(scene => {
        scene.image_pin_data.forEach(hotspot => {
          const imgSrc = this.data.fields.find(el => el.title === hotspot.text_key);
          const title = this.data.fields.find(el => el.title === hotspot.text_key);
          const safeId = `hs-${hotspot.text_key.replace(/\s+/g, '-').toLowerCase()}`;
          const changeSceneAttribute = `data-aframe-src="#${hotspot.text_key}"`;
          const isTouchDevice =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0;

          cssContainer.insertAdjacentHTML(
            'beforeend',
            `
                <div class="hotspot-label hidden" id="${safeId}" ${
              isTouchDevice ? '' : changeSceneAttribute
            }>
                    <div class="hotspot-label__title"></div>
                    <div class="hotspot-label__hover">
                        <span>${title.image_title}</span>
                        <img src="${imgSrc.img.url}" alt="">
                        ${
                          isTouchDevice
                            ? `
                            <div class="hotspot-label__button" ${changeSceneAttribute}>
                                <div>
                                    ${this.i18n.t('SmartoTours.Go to')}
                                </div>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2688 12.75L10.9528 19.487L12.0472 20.5129L19.5472 12.5129L20.028 12L19.5472 11.487L12.0472 3.48703L10.9528 4.51294L17.2688 11.25H4V12.75H17.2688Z" fill="var(--border-brand-800)"/>
                                </svg>
                            </div>
                        `
                            : ''
                        }
                    </div>
                </div>
                `,
          );

          const hotspotEl = document.createElement('a-entity');
          hotspotEl.setAttribute('id', `hotspot-anchor-${safeId}`);
          hotspotEl.setAttribute(
            'position',
            this.pannellumToAframe(hotspot.pitch + 20, hotspot.yaw - 90, this.SPHERE_RADIUS * 0.9),
          );
          aScene.appendChild(hotspotEl);

          // Без setTimeout — просто після append:
          hotspotEl.setAttribute('html-projector', `element: #${safeId}`);
        });
      });
  }

  changeScene(sceneId, target) {
    const sphere = this.$container.querySelector('a-sphere');

    const isSphereLoaded = this.LOADED_SCENES.some(el => el.title === sceneId.replace('#', ''));
    if (!isSphereLoaded) {
      Toastify({
        text: 'Scene is loading, please wait...',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
          background: 'rgba(255, 0, 0, 0.9)',
          color: '#fff',
          fontSize: '16px',
        },
      }).showToast();
      return;
    }

    if (this.currentSceneId === sceneId.replace('#', '')) return;
    const mesh = sphere.getObject3D('mesh');
    if (!mesh) return;

    const material = mesh.material;
    const newImg = this.$container.querySelector(sceneId);

    if (!material || !material.uniforms) {
      sphere.setAttribute('material', {
        shader: 'fade',
        src: sceneId,
        side: 'back',
        progress: 0,
      });
      return;
    }

    const newTexture = new THREE.Texture(newImg);
    newTexture.needsUpdate = true;

    material.uniforms.target.value = newTexture;

    const cameraPosition = this.$camera.object3D.position;

    const tl = gsap
      .timeline({
        paused: true,
      })
      .fromTo(
        material.uniforms.progress,
        { value: 0 },
        {
          value: 1,
          duration: 1,
          ease: 'power4.inOut',
          onUpdate: () => {
            // progress оновлюється автоматично через gsap
          },
          onComplete: () => {
            // після завершення переносимо target у src
            material.uniforms.src.value = newTexture;
            material.uniforms.progress.value = 0;
            console.log('this.$scene', this.$scene.object3D.children[3].children[0].children[0]);

            //conver pannellum js yaw to aframe rotation

            // this.$scene.object3D.children[3].children[0].children[0].rotation.y = currentScene.default_yaw * Math.PI / 180;
          },
        },
      );

    this.currentSceneId = sceneId.replace('#', '');
    this.switchNavButtons(sceneId);
    this.renderSceneHotSpots();
    this.handleFlatPlanPins();
    this.handleFlatPlanImage(sceneId);

    if (!this.checkVrMode()) {
      tl.play();

      if (target && target.closest('.hotspot-label')) {
      } else {
        const camera = this.$camera;
        const lookControl = camera.components['look-controls'];
        const currentScene = this.data.fields.find(el => `#${el.title}` === sceneId) || {};
        if (lookControl) {
          const targetYaw = MathUtils.degToRad(+currentScene.default_yaw || 0);
          gsap.to(lookControl.yawObject.rotation, {
            y: targetYaw,
            duration: 1,
            ease: 'power2.inOut',
          });
        }
      }
    } else {
      material.uniforms.src.value = newTexture;
      material.uniforms.progress.value = 0;
    }
  }

  setCameraYaw(yaw) {
    const rig = this.$container.querySelector('#rig');
    const cam = this.$container.querySelector('#cam');

    // Скидаємо або фіксуємо положення камери, якщо треба
    rig.setAttribute('position', '0 0 0');

    // Встановлюємо новий кут повороту (yaw → rotation.y)
    rig.setAttribute('rotation', `0 ${yaw} 0`);

    // Якщо камера має власні обертання — можна скинути
    cam.setAttribute('rotation', '0 0 0');
  }

  createCurvedImageForHotspotPreview(currentHotspot) {
    const hotspotPos = currentHotspot.object3D.position;
    const textLength = (currentHotspot.getAttribute('data-text') || '').length;

    const YOffset = hotspotPos.y + this.SPHERE_RADIUS / 10;

    const textAndBgYPosition = YOffset - this.SPHERE_RADIUS / 5 / 2 + this.SPHERE_RADIUS / 5 + 0.1;
    return `
            <a-image
                data-hotspot-preview-image="${currentHotspot.dataset.scene}"
                src="${currentHotspot.dataset.scene}"
                width="${this.SPHERE_RADIUS / 2.5 - 0.2}"
                height="${this.SPHERE_RADIUS / 5 - 0.2}"
                position="${hotspotPos.x} ${YOffset} ${hotspotPos.z}"
                look-at111="#cam4354353"
                material="side: front; offset: 0 0.04; repeat: 0.66 0.67"
                animation="property: scale; from: 0.85 0.85 0.85; to: 1 1 1; dur: 500; easing: easeInOutQuad; dir: alternate"
                visible="false"
                ></a-image>
            <a-plane
                data-hotspot-preview-image="${currentHotspot.dataset.scene}"
                data-hotspot-preview-border
                color="#fff"
                material="transparent: false"
                position="${hotspotPos.x} ${YOffset} ${hotspotPos.z}"
                width="${this.SPHERE_RADIUS / 2.5 + 1}"
                height="${this.SPHERE_RADIUS / 5 + 1}"
            ></a-plane>
            <a-troika-text
                data-hotspot-preview-image="${currentHotspot.dataset.scene}"
                position="${hotspotPos.x} ${textAndBgYPosition} ${hotspotPos.z}"
                align="center"
                color="#000"
                look-at="#cam"
                value="${currentHotspot.getAttribute('data-text') || ''}"
                font="/wp-content/themes/3d/assets/fonts/Inter/Inter-Regular.ttf"
                animation="property: scale; from: 0.85 0.85 0.85; to: 1 1 1; dur: 500; easing: easeInOutQuad; dir: alternate"
                visible="false"
                outline-width="0"
                outline-color="${'#000000'}"
                font-size="${floor(this.SPHERE_RADIUS / 30, 2)}"
            >
            </a-troika-text>
            <a-plane
                data-hotspot-preview-image="${currentHotspot.dataset.scene}"
                color="#ffffff"
                material="transparent: false"
                position="${hotspotPos.x} ${textAndBgYPosition} ${hotspotPos.z}"
                sswidth="${this.SPHERE_RADIUS / 3.5 - 0.3}"
                width="${(textLength * (this.SPHERE_RADIUS / 25)) / 1.8}"
                height="${this.SPHERE_RADIUS / 15 - 0.3}"
            >

            </a-plane>
        `;
  }

  pannellumToAframe(pitch, yaw, radius = 1) {
    let yawRad = (yaw * Math.PI) / 180;
    let pitchRad = (pitch * Math.PI) / 180;

    let x = radius * Math.sin(yawRad) * Math.cos(pitchRad);
    let y = radius * Math.sin(pitchRad) - 3.2;
    let z = -radius * Math.cos(yawRad) * Math.cos(pitchRad);

    return `${x} ${y} ${z}`;
  }
  getHotspotAttributes(hotspot, scene) {
    return {
      class: 'collidable',
      // 'gltf-model': `#${this.HOTSPOT_ASSETS_ID}`,
      clickable: '',
      'data-scene':
        hotspot.sceneId !== undefined && this.data.fields[hotspot.sceneId]
          ? `#${this.data.fields[hotspot.sceneId].title}`
          : '',
      geometry: `primitive: box; width: ${this.SPHERE_RADIUS / 15}; height: ${this.SPHERE_RADIUS /
        10}; depth: ${this.SPHERE_RADIUS / 30}; segmentsWidth: 16`,
      scale: '1 1 1',
      'data-text': hotspot.text,
      material: `src: #${this.HOTSPOT_ASSETS_ID}; side: front; transparent: true`,
      position: this.pannellumToAframe(
        hotspot.pitch + 20,
        hotspot.yaw - 90,
        this.SPHERE_RADIUS * 0.9,
      ),
      visible: true,
    };
  }
  getSphereAttributes() {
    return {
      'data-sphere': '',
      // src: `#${this.data.fields[0].title}`,
      radius: `${this.SPHERE_RADIUS}`,
      material: `shader: fade; src: #${this.data.fields[0].title}; target: #${this.data.fields[0].title}; side: back; progress: 0`,
      position: '0 1.6 0',
      scale: '-1 1 1',
      side: 'back',
      'segments-width': '64',
      'segments-height': '64',
    };
  }
  getTextAttributes(hotspot) {
    return {
      value: hotspot.text_key + '1',
      color: '#ffffff',
      align: 'center',
      geometry: 'primitive:plane',
      position: this.pannellumToAframe(
        hotspot.pitch + 20,
        hotspot.yaw - 90,
        this.SPHERE_RADIUS * 0.8,
      ),
      'look-at': '#cam',
    };
  }

  checkVrMode() {
    return this.$scene.is('vr-mode');
  }

  initShader() {
    if (AFRAME.sphereShader_inited) return;
    AFRAME.registerShader('fade', {
      schema: {
        src: { type: 'map', is: 'uniform' },
        target: { type: 'map', is: 'uniform' },
        progress: { type: 'number', is: 'uniform', default: 0.0 },
      },

      raw: false,
      fragmentShader: `
                varying vec2 vUV;
                uniform sampler2D src;
                uniform sampler2D target;
                uniform float progress;

                float rand(vec2 co) {
                    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
                }

                void main() {
                    // невеликий "шум" для спотворення
                    float strength = 0.1 * (1.0 - progress); // сила зменшується під кінець
                    vec2 distortedUV = vUV + vec2(
                        rand(vUV + progress) - 0.5,
                        rand(vUV * 2.0 - progress) - 0.5
                    ) * strength;

                    vec4 tex1 = texture2D(src, vUV);
                    vec4 tex2 = texture2D(target, distortedUV);

                    // плавний мікс
                    gl_FragColor = mix(tex1, tex2, progress);
                }
            `,
      vertexShader: `
                varying vec2 vUV;
                void main() {
                vUV = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
    });
    AFRAME.registerComponent('offset-to-camera', {
      schema: { offset: { type: 'number', default: 0.05 } }, // наскільки відсунути вперед
      init: function() {
        this.tick = AFRAME.utils.throttleTick(this.tick, 50, this); // оновлення не кожен кадр
      },
      tick: function() {
        const cam = this.el.sceneEl.camera;
        if (!cam) return;

        const objPos = new THREE.Vector3();
        const camPos = new THREE.Vector3();
        const dir = new THREE.Vector3();

        this.el.object3D.getWorldPosition(objPos);
        cam.getWorldPosition(camPos);

        dir.subVectors(camPos, objPos).normalize();

        // зміщуємо вперед до камери
        this.el.object3D.position.addScaledVector(dir, this.data.offset);
      },
    });

    AFRAME.sphereShader_inited = true;
  }

  registerLaserEventsComponent() {
    AFRAME.registerComponent('laser-events', {
      init: function() {
        // this.el посилається на <a-entity>
        this.el.addEventListener('triggerdown', function(evt) {
          console.log('Триггер натиснуто!', evt);
        });

        this.el.addEventListener('raycaster-intersection', function(evt) {
          this.$hotspots.forEach(el => {
            // el.remove();
          });
        });
      },
    });
  }

  registerHtmlProjectorComponent() {
    AFRAME.registerComponent('html-projector', {
      schema: { element: { type: 'selector' } },
      init() {
        this._vec3 = new THREE.Vector3();
        this._vec4 = new THREE.Vector4();
        this._cam = null;
        this._canvasSize = { w: 0, h: 0 };
        const sceneEl = this.el.sceneEl;

        // Дочекаємось камери і канвасу
        if (sceneEl.hasLoaded) {
          this._afterSceneLoaded();
        } else {
          sceneEl.addEventListener('loaded', () => this._afterSceneLoaded());
        }

        window.addEventListener('resize', () => this._updateCanvasSize());
      },
      _afterSceneLoaded() {
        const sceneEl = this.el.sceneEl;
        this._cam = sceneEl.camera;
        this._updateCanvasSize();
      },
      _updateCanvasSize() {
        const canvas = this.el.sceneEl && this.el.sceneEl.canvas;
        if (!canvas) return;
        this._canvasSize.w = canvas.clientWidth;
        this._canvasSize.h = canvas.clientHeight;
      },
      _isBehindCamera(worldPos) {
        // Переносимо в простір камери
        const cam = this._cam;
        if (!cam) return true;
        const m = cam.matrixWorldInverse;
        this._vec4.set(worldPos.x, worldPos.y, worldPos.z, 1);
        this._vec4.applyMatrix4(m);
        return this._vec4.z > 0; // Позитивне Z у просторі камери — позаду
      },
      tick() {
        const htmlEl = this.data.element;

        if (!htmlEl || !this._cam) return;

        this.el.object3D.getWorldPosition(this._vec3);

        if (this._isBehindCamera(this._vec3)) {
          htmlEl.classList.add('hidden');
          return;
        } else {
          htmlEl.classList.remove('hidden');
        }

        // Проєкція
        this._vec3.project(this._cam);
        const x = (this._vec3.x * 0.5 + 0.5) * this._canvasSize.w;
        const y = (-this._vec3.y * 0.5 + 0.5) * this._canvasSize.h;

        htmlEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      },
    });
  }
}

export { SMARTO_TOURS_CONTAINER_SELECTOR } from './smartoToursSelectors';
