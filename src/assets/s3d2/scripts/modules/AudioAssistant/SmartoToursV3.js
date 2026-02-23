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
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';
import { BehaviorSubject } from 'rxjs';
import { Vector3, MathUtils } from 'three';
import { isJson } from '../../../../s3d/scripts/modules/helpers/helpers';
import SmartoTourV3Assets from './SmartoToursV3/SmartoTourV3Assets';
import {
  checkTouchDevice,
  destroyAFrameScene,
  isMobileDevice,
} from './SmartoToursV3/helpers_SmartoToursV3';
import noUiSlider from 'nouislider';

class SmartoToursV3 extends SmartoTourV3Assets {
  constructor(config) {
    super();
    this.$container = config.$container;
    this.data = config.data;
    this.flat_level_photos = config.flat_level_photos || {};
    this.flat_plan = isJson(config.flat_plan) ? JSON.parse(config.flat_plan) : [];
    this.now = Date.now();
    this.SPHERE_RADIUS = 30;
    this.HOTSPOT_ASSETS_ID = 'hotspot-img';
    this.HOTSPOT_TEXTURE_ASSETS_ID = 'texture-hotspot-img';
    this.scrollableElement = config.scrollableElement || window;
    this.infoHotspotTranslations = config.infoHotspotTranslations || [];
    this.i18n = config.i18n || {
      t: key => key,
    };
    this.customFloorTitles = config.customFloorTitles || {};
    this.customNavFloorsOrders = config.customNavFloorsOrders || [];

    this.TITLE_ATTRIBUTE = 'data-smarto-tours-title-container';
    this.OPTIONS_ATTRIBUTE = 'data-smarto-tours-options-container';
    this.themeFolder = '/wp-content/themes/3d/';

    this.defaultScene =
      config.defaultSceneIndex && this.data[config.defaultSceneIndex]
        ? this.data[config.defaultSceneIndex]
        : this.data[0];

    if (this.getUrlParam('scene')) {
      const index = this.data.findIndex(el => el.tour_v2_premise_id == this.getUrlParam('scene'));
      if (index !== -1) this.defaultScene = this.data[index];
    }
    this.LOADED_SCENES = [];

    this.debouncedResize = debounce(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);

    this.navBar = new BehaviorSubject({
      floorPlanVisible: false,
      navMenuVisible: false,
      texturesMenuVisible: false,
    });

    this.navBar.subscribe(visible => {
      const flatPlan = this.$container.querySelector('.flatplan-wrapper');
      if (!flatPlan) return;
      flatPlan.classList.toggle('visible', visible.floorPlanVisible);

      const floorBtn = this.$container.querySelector('.s3d-smarto-tours__floorplan-toggle');
      if (floorBtn) floorBtn.classList.toggle('active', visible.floorPlanVisible);
    });
    this.navBar.subscribe(visible => {
      const navbar = this.$container.querySelector('.s3d-smarto-tours__navbar');
      if (!navbar) return;
      navbar.classList.toggle('visible', visible.navMenuVisible);
      //data-smarto-tours-nav

      const navBtn = this.$container.querySelector('[data-smarto-tours-nav]');
      if (navBtn) navBtn.classList.toggle('active', visible.navMenuVisible);
    });
    this.navBar.subscribe(visible => {
      const navbar = this.$container.querySelector('[data-textures-buttons]');
      if (!navbar) return;
      navbar.classList.toggle('visible', visible.texturesMenuVisible);
      //data-smarto-tours-nav
    });
    this.navBar.subscribe(visible => {
      const navbar = this.$container.querySelector('[data-textures-buttons]');
      if (navbar) navbar.classList.toggle('visible', visible.texturesMenuVisible);

      const texturesBtn = this.$container.querySelector('.s3d-smarto-tours__textures-toggle');
      if (texturesBtn) texturesBtn.classList.toggle('active', visible.texturesMenuVisible);
    });

    this.data.forEach(el => {
      const image_pin_data = el.image_pin_data;
      if (isJson(image_pin_data)) {
        el.image_pin_data = JSON.parse(image_pin_data);
      }
    });

    this.flat_plan_data = isJson(this.flat_plan) ? JSON.parse(this.flat_plan) : [];

    this.scene$ = new BehaviorSubject({
      isLoading: false,
      sceneId: this.defaultScene ? `${this.defaultScene.tour_v2_premise_id}` : null,
      data: {
        ...this.defaultScene,
      },
    });
  }

  async init() {
    await ensureAframeLoaded();

    if (!AFRAME.isComponentsRegistered) {
      this.registerHtmlProjectorComponent();
      // this.registerLaserEventsComponent();
      AFRAME.isComponentsRegistered = true;
    }

    this.$container.classList.add('s3d-smarto-tours');

    const uniqueByLevel = [
      ...new Map(this.data.map(item => [item.tour_v2_premise_level, item])).values(),
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
      const isTouchDevice = checkTouchDevice();
      const targetElement = this.scrollableElement;
      evt.preventDefault();

      this.pointerYDelta = evt.clientY - this.pointerYStart;
      this.handleFlatPlanPins();

      if (!isTouchDevice) return;

      if (targetElement === window) {
        requestAnimationFrame(() => {
          if (window.scrollY - this.pointerYDelta <= 0) return;
          window.scrollTo(0, this.startScrollTop - this.pointerYDelta);
        });
      } else {
        requestAnimationFrame(() => {
          if (targetElement.scrollTop - this.pointerYDelta <= 0) return;
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
    this.$container
      .querySelector('.s3d-smarto-tours__textures-toggle')
      .addEventListener('click', () => {
        this.navBar.next({
          ...Object.entries(this.navBar.value).reduce((acc, [key, value]) => {
            acc[key] = false;
            return acc;
          }, {}),
          texturesMenuVisible: !this.navBar.value.texturesMenuVisible,
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
    this.scene$.subscribe(({ sceneId, data }) => {
      this.$container.querySelector('[data-textures-buttons]').innerHTML = `
                ${
                  Array.isArray(data.tour_v2_premises_textures)
                    ? data.tour_v2_premises_textures
                        .map(textureGroup => this.getTextureGroupForNavMenu(textureGroup, data))
                        .join('')
                    : ''
                }
            `;
      this.$scene.querySelectorAll('[data-texture-sphere]').forEach(el => el.remove());
      const currentScene = this.data.find(el => `${el.tour_v2_premise_id}` === sceneId);
      if (
        !currentScene.loadedInnerAssets &&
        Array.isArray(currentScene.tour_v2_premises_textures)
      ) {
        currentScene.tour_v2_premises_textures.forEach(textureGroup => {
          if (!Array.isArray(textureGroup.tour_v2_single_texture_group_images)) return;
          textureGroup.tour_v2_single_texture_group_images.forEach(texture => {
            const img = document.createElement('img');
            img.crossOrigin = 'anonymous';
            img.id = texture.tour_v2_single_texture_group_images_id;
            img.src = texture.tour_v2_single_texture_group_images_img.url;
            this.$scene.querySelector('a-assets').appendChild(img);
          });
        });
        currentScene.loadedInnerAssets = true;
      }
      this.$container.querySelector(
        '.s3d-smarto-tours__textures-toggle',
      ).style.display = !currentScene.tour_v2_premises_textures ? 'none' : '';
      if (Array.isArray(currentScene.tour_v2_premises_textures)) {
        currentScene.tour_v2_premises_textures.forEach(textureGroup => {
          this.$scene.insertAdjacentHTML(
            'beforeend',
            this.getSphereForPremiseInnerTexture(textureGroup.tour_v2_single_texture_group_id),
          );
        });
      }

      gsap.fromTo(
        this.$camera,
        {
          attr: {
            zoom: !isNaN(+this.$camera.getAttribute('zoom'))
              ? +this.$camera.getAttribute('zoom')
              : 1,
          },
        },
        {
          attr: {
            zoom: get(currentScene, 'zoom', 100) / 100,
          },
        },
      );
      if (this.zoomSlider) {
        this.zoomSlider.noUiSlider.set(get(currentScene, 'zoom', 100));
      }
    });

    this.initZoomSlider();

    this.$container.addEventListener('click', evt => {
      const target = evt.target.closest('[data-texture-image]');
      if (!target) return;
      const textureGroupId = target.getAttribute('data-texture-group-id');
      const textureImageId = target.getAttribute('data-texture-image');
      const sceneId = target.getAttribute('data-aframe-src');
      const textureSphere = this.$scene.querySelector(`[data-texture-sphere="${textureGroupId}"]`);
      // const currentTextureId = textureSphere.getAttribute('material').src.id;
      this.removeVrModeHoverTextureGroupImages();
      if (this.is_in_vr) {
        if (textureImageId != 'default')
          textureSphere.setAttribute('material', `src: #${textureImageId}`);
        textureSphere.setAttribute('visible', textureImageId === 'default' ? 'false' : 'true');
        return;
      }

      if (textureImageId != 'default')
        textureSphere.setAttribute('material', `src: #${textureImageId}`);

      if (
        textureImageId != 'default' &&
        textureSphere.getAttribute('visible') === false &&
        !this.is_in_vr
      ) {
        console.log('timeline');

        gsap
          .timeline()
          .set(textureSphere, {
            attr: {
              visible: true,
            },
          })
          .fromTo(
            textureSphere,
            {
              attr: {
                opacity: 0,
              },
            },
            {
              attr: {
                opacity: 1,
              },
            },
            1,
          );
      } else if (
        textureImageId == 'default' &&
        textureSphere.getAttribute('visible') === true &&
        !this.is_in_vr
      ) {
        gsap
          .timeline()
          .fromTo(
            textureSphere,
            {
              attr: {
                opacity: 1,
              },
            },
            {
              attr: {
                opacity: 0,
              },
            },
            1,
          )
          .set(textureSphere, {
            attr: {
              visible: false,
            },
          });
      } else {
        textureSphere.setAttribute('visible', textureImageId === 'default' ? 'false' : 'true');
      }
    });

    this.$scene.addEventListener('enter-vr', () => {
      this.is_in_vr = true;
    });
    this.$scene.addEventListener('exit-vr', () => {
      this.is_in_vr = false;
    });
    this.initAccelerometer();

    this.initTouchDevicesHotspotHover();
  }

  loadDefaultScene() {
    const assets = this.$scene.querySelector('a-assets');
    this.data.forEach((el, index) => {
      if (this.defaultScene && this.defaultScene.tour_v2_premise_id != el.tour_v2_premise_id) {
        return '';
      }
      this.LOADED_SCENES[index] = el;
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.id = el.tour_v2_premise_id;
      img.src = el.tour_v2_premise_img.url;
      img.onload = () => {
        this.changeScene(`#${this.defaultScene.tour_v2_premise_id}`);
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
    const lazyLoadedScenes = this.data.map((scene, index) => {
      if (this.LOADED_SCENES[index]) return '';
      const element = document.createElement('img');
      element.crossOrigin = 'anonymous';
      element.id = scene.tour_v2_premise_id;
      element.src = scene.tour_v2_premise_img.url;
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

    document.addEventListener('fullscreenchange', () => {
      this.$container
        .querySelector('[data-smarto-tours-fullscreen]')
        .classList.toggle('active', !!document.fullscreenElement);
    });

    this.$container.querySelector(
      `[${this.OPTIONS_ATTRIBUTE}]`,
    ).innerHTML = this.getFullscreenButton();
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

      const cameraEl = this.$container.querySelector('#cam-v3');
      if (!cameraEl) return;

      let cameraYaw = cameraEl.getAttribute('rotation').y;

      cameraYaw = ((cameraYaw + 180) % 360) - 180;

      const panoramaYawMapRange = gsap.utils.mapRange(-180, 180, 0, 360, -cameraYaw);

      gsap.to($activeFlatPlanPin.querySelector('svg'), {
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        rotate: panoramaYawMapRange + angleOffsetForCurrentPin - 180,
        duration: 0,
      });
    });
  }

  handleFlatPlanImage(sceneId) {
    const flatPlan = this.$container.querySelector('.flat-plan img');
    const currentScene = this.data.find(el => `#${el.tour_v2_premise_id}` === sceneId);

    if ([flatPlan, currentScene].some(el => !el)) return;

    const propertyLevel = currentScene.tour_v2_premise_level || 1;
    const flatPlanDataForCurrentLevel = this.flat_level_photos[propertyLevel];
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

  renderSceneHotSpots() {
    this.removeCurrentHotSpots();
    this.renderVrModeHotspots(this.$scene);
    this.renderCssHotspots();
  }

  removeCurrentHotSpots() {
    this.$container.querySelectorAll('.collidable, .collidable-texture-group').forEach(el => {
      el.parentNode.removeChild(el);
    });
    this.$container.querySelectorAll('[data-hotspot-preview-image]').forEach(img => img.remove());
    this.removeVrModeHoverTextureGroupImages();
  }

  removeCssHotSpots() {
    this.$container.querySelector('.s3d-smarto-tours__css-hotspots-wrapper').innerHTML = '';
    this.$container.querySelectorAll('[html-projector]').forEach(el => el.remove());
  }

  removeVrModeHoverTextureGroupImages() {
    this.$container
      .querySelectorAll('[data-vr-texture-group-hover]')
      .forEach(group => group.remove());
  }

  renderVrModeHotspots(aScene) {
    this.data.forEach(scene => {
      if (scene.tour_v2_premise_id != this.currentSceneId) return;
      if (this.isCustomFullscreen) return;
      // if (!scene.image_pin_data) return;

      scene.tour_v2_premise_hotspots.forEach(async hotspot => {
        let hotspotEl = document.createElement('a-entity');
        const attributes = this.getHotspotAttributes(hotspot, scene);
        Object.keys(attributes).forEach(key => {
          hotspotEl.setAttribute(key, attributes[key]);
        });
        aScene.appendChild(hotspotEl);

        const camera = this.$camera;

        await this.sleep(100);

        hotspotEl.object3D.lookAt(camera.object3D.position);
        hotspotEl.insertAdjacentHTML('afterend', this.createCurvedImageForHotspotPreview(hotspot));

        await this.sleep(0);
        document.querySelectorAll('[data-hotspot-preview-image]').forEach(img => {
          const tagName = img.tagName.toLowerCase();
          img.setAttribute('visible', false);
          // move a bit closer to camera
          const dir = new THREE.Vector3();
          dir.subVectors(camera.object3D.position, img.object3D.position).normalize();
          if (tagName == 'a-troika-text') {
            img.object3D.position.addScaledVector(dir, this.SPHERE_RADIUS * 0.1);
          }
          if (tagName == 'a-plane' && !img.hasAttribute('data-hotspot-preview-border')) {
            img.object3D.position.addScaledVector(dir, this.SPHERE_RADIUS * 0.09);
          }
          if (tagName == 'a-image') {
            img.object3D.position.addScaledVector(dir, this.SPHERE_RADIUS * 0.08);
          }
          img.object3D.lookAt(new THREE.Vector3().copy(camera.object3D.position));
          // img.setAttribute('visible', true);
        });
        document.querySelectorAll('.collidable-texture-group').forEach(textureGroupPin => {
          const dir = new THREE.Vector3();
          dir.subVectors(camera.object3D.position, textureGroupPin.object3D.position).normalize();
          textureGroupPin.object3D.position.addScaledVector(dir, this.SPHERE_RADIUS * 0.1);
          textureGroupPin.object3D.lookAt(new THREE.Vector3().copy(camera.object3D.position));
        });
      });
    });

    document.querySelectorAll('.collidable').forEach(el => {
      el.addEventListener('click', evt => {
        this.changeScene(el.getAttribute('data-scene'), evt);
      });

      el.addEventListener('mouseenter', () => {
        this.$title.textContent = el.getAttribute('data-text') || '';
        document
          .querySelectorAll(`[data-hotspot-preview-image="${el.getAttribute('data-scene')}"]`)
          .forEach(img => {
            img.setAttribute('visible', true);
          });
      });
      el.addEventListener('mouseleave', () => {
        this.$title.textContent = '';
        document
          .querySelectorAll(`[data-hotspot-preview-image="${el.getAttribute('data-scene')}"]`)
          .forEach(img => {
            img.setAttribute('visible', false);
          });
      });
    });
    document.querySelectorAll('.collidable-texture-group').forEach(textureGroupPin => {
      textureGroupPin.addEventListener('click', evt => {
        if (evt.target.closest('[data-vr-texture-group-hover]')) return;
        this.renderVrModeHoverTextureGroupImages(textureGroupPin);
      });

      textureGroupPin.addEventListener('mouseenter', () => {
        // this.$title.textContent = textureGroupPin.getAttribute('data-text') || '';
        // document.querySelectorAll(`[data-hotspot-preview-image="${textureGroupPin.getAttribute('data-scene')}"]`).forEach(img => {
        //     img.setAttribute('visible', true);
        // });
      });
      textureGroupPin.addEventListener('mouseleave', () => {
        // this.$title.textContent = '';
        // document.querySelectorAll(`[data-hotspot-preview-image="${textureGroupPin.getAttribute('data-scene')}"]`).forEach(img => {
        //     img.setAttribute('visible', false);
        // });
      });
    });
  }

  renderVrModeHoverTextureGroupImages(textureGroupPin) {
    const textureGroupId = textureGroupPin.getAttribute('data-texture-group-id');
    const { x, y, z } = textureGroupPin.object3D.position;

    const positionCloserToCamera = new THREE.Vector3();
    const camera = this.$camera;
    const dir = new THREE.Vector3();
    dir.subVectors(camera.object3D.position, textureGroupPin.object3D.position).normalize();
    positionCloserToCamera
      .copy(textureGroupPin.object3D.position)
      .addScaledVector(dir, this.SPHERE_RADIUS * 0.1);

    const currentScene = this.data.find(scene => {
      if (!Array.isArray(scene.tour_v2_premises_textures)) return false;
      const textures = scene.tour_v2_premises_textures.find(
        tex => tex.tour_v2_single_texture_group_id === textureGroupId,
      );
      return textures;
    });

    const textureGroup = currentScene.tour_v2_premises_textures.find(
      tex => tex.tour_v2_single_texture_group_id === textureGroupId,
    );

    const textureGroupItemsPositions = this.vrTextureGroupItemsCoords;

    const vrTextureGroupHover = `
            <a-entity
                position="${positionCloserToCamera.x} ${positionCloserToCamera.y} ${
      positionCloserToCamera.z
    }"
                rotation="0 0 0"
                data-vr-texture-group-hover
            >
                ${this.getTextureGroupHoverImageItem({
                  x: textureGroupItemsPositions[0].x,
                  y: textureGroupItemsPositions[0].y,
                  textureGroupId,
                  textureImageId: 'default',
                  src: textureGroup.tour_v2_single_texture_group_default_preview
                    ? textureGroup.tour_v2_single_texture_group_default_preview
                    : '',
                })}
                ${
                  Array.isArray(textureGroup.tour_v2_single_texture_group_images)
                    ? textureGroup.tour_v2_single_texture_group_images
                        .map(
                          (texGroup, index) => `
                    ${this.getTextureGroupHoverImageItem({
                      x: textureGroupItemsPositions[index + 1].x,
                      y: textureGroupItemsPositions[index + 1].y,
                      textureGroupId,
                      textureImageId: texGroup.tour_v2_single_texture_group_images_id,
                      src: texGroup.tour_v2_single_texture_group_images_preview
                        ? texGroup.tour_v2_single_texture_group_images_preview
                        : '',
                    })}}
                    ${
                      texGroup.tour_v2_single_texture_group_images_preview
                        ? `
                        <img
                            id="${textureGroup.tour_v2_single_texture_group_id}-${texGroup.tour_v2_single_texture_group_images_id}"
                            src="${texGroup.tour_v2_single_texture_group_images_preview}"
                        >
                        `
                        : ''
                    }
                `,
                        )
                        .join('')
                    : ''
                }
            </a-entity>
        `;
    textureGroupPin.insertAdjacentHTML('afterend', vrTextureGroupHover);
    setTimeout(() => {
      this.$container.querySelectorAll('[data-vr-texture-group-hover]>*:not(img)').forEach(el => {
        const camera = this.$camera;
        el.object3D.lookAt(camera.object3D.position);
      });
    }, 0);
  }

  renderCssHotspots() {
    const cssContainer = this.$container.querySelector('.s3d-smarto-tours__css-hotspots-wrapper');
    if (!cssContainer) return;
    if (!this.isCustomFullscreen) return;
    const aScene = this.$scene;
    // cssContainer.innerHTML = '';
    this.removeCssHotSpots();
    const hotspotTemplatesMap = {
      texture: this.getTextureGroupCss.bind(this),
      scene: this.getSceneCssHotspot.bind(this),
      info: this.getSceneCssInfoHotspot.bind(this),
    };

    this.data
      .filter(el => el.tour_v2_premise_id === this.currentSceneId)
      .forEach(scene => {
        if (!scene.tour_v2_premise_hotspots || !scene.tour_v2_premise_hotspots.length) return;
        scene.tour_v2_premise_hotspots.forEach((hotspot, index) => {
          const imgSrc = this.data.find(
            el => el.tour_v2_premise_id === hotspot.source_scene_id,
          ) || { tour_v2_premise_img: { url: '' } };
          const title =
            this.data.find(el => el.tour_v2_premise_id === hotspot.source_scene_id) || {};
          const safeId = uniqueId();
          const changeSceneAttribute = `data-aframe-src="#${hotspot.hotspot_id}"`;
          const isTouchDevice = checkTouchDevice();
          if (!hotspotTemplatesMap[hotspot.type]) {
            console.warn(`Unknown hotspot type: ${hotspot.type}`);
            return;
          }
          cssContainer.insertAdjacentHTML(
            'beforeend',
            hotspotTemplatesMap[hotspot.type]({
              hotspot,
              safeId,
              title,
              imgSrc,
              isTouchDevice,
              changeSceneAttribute,
              title_key: hotspot.title_key,
              index,
            }),
          );

          const hotspotEl = document.createElement('a-entity');
          hotspotEl.setAttribute('id', `hotspot-anchor-${safeId}`);
          hotspotEl.setAttribute('position', this.sphericalToCartesian(hotspot.theta, hotspot.phi));
          aScene.appendChild(hotspotEl);

          // Без setTimeout — просто після append:
          hotspotEl.setAttribute('html-projector', `element: #${safeId}`);
        });
      });
  }

  changeScene(sceneId, target) {
    const sphere = this.$container.querySelector('a-sphere');

    const isSphereLoaded = this.LOADED_SCENES.some(
      el => el.tour_v2_premise_id === sceneId.replace('#', ''),
    );
    if (!isSphereLoaded) return this.showLoadWarningMessage();

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
          onUpdate: () => {},
          onComplete: () => {
            material.uniforms.src.value = newTexture;
            material.uniforms.progress.value = 0;
          },
        },
      );

    this.currentSceneId = sceneId.replace('#', '');
    this.switchNavButtons(sceneId);
    this.renderSceneHotSpots();
    this.handleFlatPlanPins();
    this.handleFlatPlanImage(sceneId);
    this.handleVideoSphereOnChange(sceneId);

    this.insertUrlParam();

    if (!this.checkVrMode()) {
      // шейдер ефект переходу не працює у ВР режимі в окулярах
      tl.play();

      if (target && target.closest && target.closest('.hotspot-label')) {
      } else {
        const camera = this.$camera;
        const lookControl = camera.components['look-controls'];
        const currentScene = this.data.find(el => `#${el.tour_v2_premise_id}` === sceneId) || {};

        if (lookControl) {
          const targetYaw = THREE.MathUtils.degToRad(+currentScene.default_yaw || 0);
          gsap.to(lookControl.yawObject.rotation, {
            y: targetYaw,
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
              if (currentScene.autoplay_speed && +currentScene.autoplay_speed !== 0) {
                this.startAutoRotation(currentScene.autoplay_speed);
              }
            },
          });
        }
      }
    } else {
      material.uniforms.src.value = newTexture;
      material.uniforms.progress.value = 0;
    }

    this.scene$.next({
      sceneId: this.currentSceneId,
      data: this.data.find(el => `${el.tour_v2_premise_id}` === this.currentSceneId),
    });
    window.dispatchEvent(new Event('smarto-tours-scene-changed'));
  }

  handleVideoSphereOnChange(sceneId) {
    const currentScene = this.data.find(el => `#${el.tour_v2_premise_id}` === sceneId) || {};
    const videoSphere = this.$videoSphere;
    if (!currentScene.tour_v2_premise_video) {
      videoSphere.setAttribute('visible', false);
      this.showTextureHotspots();
      if (videoSphere && videoSphere.components.material.data.src) {
        videoSphere.components.material.data.src.pause();
      }
      return;
    }
    const videoAssetId = `video-${currentScene.tour_v2_premise_id}`;
    let videoAsset = this.$scene.querySelector(`#${videoAssetId}`);
    if (!videoAsset) {
      this.$assets.insertAdjacentHTML(
        'beforeend',
        `<video id="${videoAssetId}" autoplay loop="true" muted="true" crossorigin="anonymous" src="${currentScene.tour_v2_premise_video}"></video>`,
      );
      videoAsset = this.$scene.querySelector(`#${videoAssetId}`);
      videoAsset.addEventListener('loadeddata', () => {
        videoSphere.setAttribute('visible', true);
        this.hideTextureHotspots();
        this.playVideoSphere(videoAssetId);
        console.warn(`[SmartoToursV3] texture switch is off for ${currentScene.tour_v2_premise_title} scene, because video is loaded`);
      }, { once: true });
      return;
    }
    this.hideTextureHotspots();
    this.playVideoSphere(videoAssetId);
    console.warn(`[SmartoToursV3] texture switch is off for ${currentScene.tour_v2_premise_title} scene, because video is loaded`);
  }

  showTextureHotspots() {
    this.$container.querySelectorAll('[data-scene-id*="texture"], .s3d-smarto-tours__textures-toggle, [data-textures-buttons]').forEach(el => {
      el.style.visibility = '';
    });
    this.$container.querySelectorAll('.collidable-texture-group').forEach(el => {
      el.setAttribute('visible', true);
    });
  }
  
  hideTextureHotspots() {
    this.$container.querySelectorAll('[data-scene-id*="texture"], .s3d-smarto-tours__textures-toggle, [data-textures-buttons]').forEach(el => {
      el.style.visibility = 'hidden';
    });
    this.$container.querySelectorAll('.collidable-texture-group').forEach(el => {
      el.setAttribute('visible', false);
    });
  }

  playVideoSphere(videoAssetId) {
    const videoSphere = this.$videoSphere;
    videoSphere.setAttribute('material', `shader: fade; src: #${videoAssetId}; side: back; progress: 0`);
    videoSphere.components.material.data.src.currentTime = 0;
    videoSphere.components.material.data.src.play();
    videoSphere.setAttribute('visible', true);
  }
  
  startAutoRotation(speed) {
    const camera = this.$camera;
    const lookControl = camera.components['look-controls'];

    const tick = () => {
      lookControl.yawObject.rotation.y = lookControl.yawObject.rotation.y - +speed * 0.001;
      this.autoRotateId = requestAnimationFrame(tick);
      this.handleFlatPlanPins();
    };

    this.autoRotateId = requestAnimationFrame(tick);
    this.$container.addEventListener(
      'pointerdown',
      () => {
        this.stopAutoRotation();
      },
      { once: true },
    );
  }

  stopAutoRotation() {
    window.cancelAnimationFrame(this.autoRotateId);
  }

  setCameraYaw(yaw) {
    const rig = this.$container.querySelector('#rig-v3');
    const cam = this.$container.querySelector('#cam-v3');

    rig.setAttribute('position', '0 0 0');

    rig.setAttribute('rotation', `0 ${yaw} 0`);

    cam.setAttribute('rotation', '0 0 0');
  }

  createCurvedImageForHotspotPreview(hotspot) {
    const phi = hotspot.phi;
    const theta = hotspot.theta;

    const { x, y, z } = this.sphericalToCartesian(theta, phi, this.SPHERE_RADIUS);

    if (hotspot.type !== 'scene') return '';

    const currentScene =
      this.data.find(el => el.tour_v2_premise_id === hotspot.source_scene_id) || {};

    const text = currentScene.tour_v2_premise_title;
    const textLength = text.length;

    const YOffset = y + this.SPHERE_RADIUS / 10;
    const textAndBgYPosition = YOffset - this.SPHERE_RADIUS / 5 / 2 + this.SPHERE_RADIUS / 5 + 0.1;
    return this.getLayoutOfCurvedImageForHotspotPreview({
      hotspot,
      x,
      YOffset,
      z,
      textAndBgYPosition,
      textLength,
      currentScene,
    });
  }

  getHotspotAttributes(hotspot, scene) {
    const source_scene =
      this.data.find(el => el.tour_v2_premise_id == hotspot.source_scene_id) || {};

    const src =
      hotspot.type == 'scene' ? `#${this.HOTSPOT_ASSETS_ID}` : `#${this.HOTSPOT_TEXTURE_ASSETS_ID}`;

    if (hotspot.type == 'texture') {
      return {
        class: 'collidable-texture-group',
        clickable: '',
        geometry: `primitive: box; width: ${this.SPHERE_RADIUS / 15}; height: ${this.SPHERE_RADIUS /
          15}; depth: ${this.SPHERE_RADIUS / 30}; segmentsWidth: 16`,
        scale: '1 1 1',
        material: `src: ${src}; side: front; transparent: true`,
        position: this.sphericalToCartesian(hotspot.theta, hotspot.phi, this.SPHERE_RADIUS * 0.95),
        'data-texture-group-id': hotspot.hotspot_id.replace('texture-', ''),
        visible: true,
      };
    }

    return {
      class: 'collidable',
      // 'gltf-model': `#${this.HOTSPOT_ASSETS_ID}`,
      clickable: '',
      'data-scene':
        hotspot.source_scene_id !== undefined && source_scene
          ? `#${source_scene.tour_v2_premise_id}`
          : '',
      geometry: `primitive: box; width: ${this.SPHERE_RADIUS / 15}; height: ${this.SPHERE_RADIUS /
        10}; depth: ${this.SPHERE_RADIUS / 30}; segmentsWidth: 16`,
      scale: '1 1 1',
      'data-text': hotspot.text || 'fefe',
      material: `src: ${src}; side: front; transparent: true`,
      position: this.sphericalToCartesian(hotspot.theta, hotspot.phi, this.SPHERE_RADIUS * 0.95),
      visible: true,
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
      fragmentShader: this.fragmentShaderForChangeScene(),
      vertexShader: this.vertexShaderForChangeScene(),
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

  sphericalToCartesian(theta, phi) {
    const x = this.SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
    const y = this.SPHERE_RADIUS * Math.cos(phi);
    const z = this.SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);

    return { x, y, z };
  }

  insertUrlParam() {
    const url = new URL(window.location);
    url.searchParams.set('scene', this.currentSceneId);
    window.history.replaceState({}, '', url);
  }

  getUrlParam() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('scene');
  }

  destroy() {
    this.navBar.complete();
    this.scene$.complete();
    destroyAFrameScene(this.$scene);
    this.autoRotateId && this.stopAutoRotation();
  }

  initAccelerometer() {
    this.toggleAccelerometer = this.$container.querySelector(
      '.s3d-smarto-tours__accelerometer-toggle',
    );
    if (!isMobileDevice()) {
      this.toggleAccelerometer.style.display = 'none';
    } else {
      this.checkDeviceOrientationSupport();
    }
  }

  initTouchDevicesHotspotHover() {
    const isTouchDevice = checkTouchDevice();

    if (isTouchDevice) {
      this.$container.addEventListener('pointerdown', evt => {
        const target = evt.target.closest('[data-hotspot-index]');
        this.$container
          .querySelectorAll('[data-hotspot-index]')
          .forEach(el => el.classList.remove('active'));
        if (!target) return;
        target.classList.add('active');
      });
    }
  }

  toggleDeviceOrientation() {
    this.isAccelerometerActive = !this.isAccelerometerActive;

    if (this.isAccelerometerActive) {
      this.$camera.setAttribute('look-controls', {
        magicWindowTrackingEnabled: true,
        touchEnabled: true,
        mouseEnabled: true,
      });
      this.toggleAccelerometer.querySelector('.vr-option-text').textContent = this.i18n.t(
        'SmartoTours.motion_view',
      );
      this.$container.querySelector('[data-accelerometer-toggle]').checked = true;
      Toastify({
        text: this.i18n.t('SmartoTours.use_phone_motion'),
        duration: 3000,
        close: false,
        gravity: 'top',
        position: 'center',
        style: {
          background: 'var(--color-brand-800)',
          color: '#fff',
          fontSize: '16px',
        },
      }).showToast();
    } else {
      this.$camera.setAttribute('look-controls', {
        magicWindowTrackingEnabled: false,
        touchEnabled: true,
        mouseEnabled: true,
      });
      // toggleAccelerometer.classList.remove('active');
      this.toggleAccelerometer.querySelector('.vr-option-text').textContent = this.i18n.t(
        'SmartoTours.motion_view',
      );
      this.$container.querySelector('[data-accelerometer-toggle]').checked = false;
    }
  }
  checkDeviceOrientationSupport() {
    const toggleAccelerometer = this.toggleAccelerometer;
    let isAccelerometerActive = this.isAccelerometerActive;
    const that = this;
    if (window.DeviceOrientationEvent) {
      // iOS 13+ requires permission request
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        toggleAccelerometer.querySelector('.vr-option-text').textContent = that.i18n.t(
          'SmartoTours.motion_view',
        );
        toggleAccelerometer.classList.add('request');
        toggleAccelerometer.classList.remove('active');

        toggleAccelerometer.addEventListener('click', function() {
          if (!toggleAccelerometer.hasPermissionRequested) {
            DeviceOrientationEvent.requestPermission()
              .then(response => {
                if (response === 'granted') {
                  toggleAccelerometer.querySelector('.vr-option-text').textContent = that.i18n.t(
                    'SmartoTours.motion_view',
                  );
                  toggleAccelerometer.classList.add('active');
                  toggleAccelerometer.classList.remove('request');
                  this.isAccelerometerActive = true;
                } else {
                  toggleAccelerometer.querySelector('.vr-option-text').textContent = 'Відхилено';
                  toggleAccelerometer.classList.remove('active');
                  toggleAccelerometer.classList.remove('request');
                  this.isAccelerometerActive = false;
                }
                toggleAccelerometer.hasPermissionRequested = true;
                that.toggleDeviceOrientation();
              })
              .catch(error => {
                console.error('Motion permission error:', error);
                toggleAccelerometer.querySelector('.vr-option-text').textContent = 'Помилка';
                toggleAccelerometer.classList.remove('request');
                toggleAccelerometer.classList.remove('active');
                that.toggleDeviceOrientation();
              });
          } else {
            that.toggleDeviceOrientation();
          }
        });
      } else {
        toggleAccelerometer.addEventListener('click', this.toggleDeviceOrientation.bind(this));
        toggleAccelerometer.querySelector('.vr-option-text').textContent = this.i18n.t(
          'SmartoTours.motion_view',
        );
      }
    } else {
      toggleAccelerometer.querySelector('.vr-option-text').textContent = 'Недоступно';
      toggleAccelerometer.disabled = true;
      toggleAccelerometer.classList.remove('active');
      this.isAccelerometerActive = false;
    }
  }
  initZoomSlider() {
    this.zoomSlider = this.$container.querySelector(
      '.s3d-smarto-tours__zoom-slider [data-zoom-slider]',
    );

    noUiSlider.create(this.zoomSlider, {
      range: {
        min: 50,
        max: 150,
      },
      step: 1,
      start: 100,
      connect: true,
      direction: 'rtl',
      orientation: 'vertical',
      tooltips: [
        {
          to: function(value) {
            return value + ' %';
          },
        },
      ],
    });

    this.zoomSlider.style.height = '150px';
    this.zoomSlider.noUiSlider.on('change', (e, a) => {
      const zoom = !isNaN(e[0]) ? e[0] : 100;
      const camera = this.$camera;
      camera.setAttribute('camera', 'zoom', zoom / 100);
    });
  }
}

export default SmartoToursV3;

export const SMARTO_TOURS_V3_CONTAINER_SELECTOR = '[data-3d_tour_v3_container]';
