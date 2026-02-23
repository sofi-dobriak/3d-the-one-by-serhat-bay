import get from 'lodash/get';
import floor from 'lodash/floor';

export default class SmartoTourV3Assets {
  constructor() {}

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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

  get $videoSphere() {
    return this.$container.querySelector('a-videosphere');
  }

  get $assets() {
    return this.$container.querySelector('a-assets');
  }

  get vrTextureGroupItemsCoords() {
    return [
      { x: 0, y: 0 },
      { x: 0, y: 2 },
      { x: 0, y: -2 },
      { x: 2, y: 0 },
      { x: -2, y: 0 },
      { x: 2, y: 2 },
      { x: 2, y: -2 },
      { x: -2, y: 2 },
      { x: -2, y: -2 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
      { x: -4, y: 0 },
    ];
  }

  getNavButtons() {
    return `
            <div class="s3d-smarto-tours__navbar">
                ${this.data
                  .map(
                    el =>
                      `<button class="s3d-smarto-tours__navbar__button" type="button" data-aframe-src="#${el.tour_v2_premise_id}"><span>${el.tour_v2_premise_title}</span></button>`,
                  )
                  .join('')}
            </div>
        `;
  }

  getCamera() {
    return `
            <a-entity id="rig-v3" position="0 0 0">
                <a-camera
                    id="cam-v3"
                    wasd-controls-enabled="false"
                    look-controls="reverseMouseDrag: true; magicWindowTrackingEnabled: false;"
                    cursor__mouse="rayOrigin: mouse;"
                    raycaster="objects: .collidable, .collidable-texture-group, [html-projector];">
                </a-camera>
            </a-entity>
        `;
  }
  getFlatGenplan(flat_plan_data = [], tourData, flat_level_photos = {}, flat_plan = '') {
    const url = get(Object.values(flat_level_photos), '[0].url', false);

    if (!url) return '';

    return `
            <div class="flat-plan" data-smarto-tours-flatplan>
                <img src="${url}" alt="" data-smarto-tours-flatplan-image/>
                    ${flat_plan
                      .map((data, index) => {
                        const { xPercent, yPercent, scene, id, currentSceneId, pointOfView } = data;
                        const sceneForThisLink = tourData.find(
                          tour => tour.tour_v2_premise_id == currentSceneId,
                        );

                        if (!sceneForThisLink) return '';
                        return `
                            <div class="flat-plan-pin"
                                data-angle="${pointOfView}" style="left: ${xPercent}%; top: ${yPercent}%"
                                data-key="${scene}"
                                data-aframe-src="#${sceneForThisLink.tour_v2_premise_id}"
                                data-preview-pin-level="${sceneForThisLink.tour_v2_premise_level}"
                                data-pin-id="${currentSceneId}"
                                data-flat-plan-pin-index="${index}"
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
                <div class="s3d-smarto-tours__nav-button s3d-smarto-tours__textures-toggle" title="Variants">
                  <svg class="s3d-smarto-tours__nav-button-icon--when-inactive" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M17.5 3.5H18.5V5.5H20.5V6.5H18.5V8.5H17.5V6.5H4V5.5H17.5V3.5ZM7.5 9.5H8.5V11.5H20.5V12.5H8.5V14.5H7.5V12.5H4V11.5H7.5V9.5ZM17.5 15.5H18.5V17.5H20.5V18.5H18.5V20.5H17.5V18.5H4V17.5H17.5V15.5Z" fill="var(--s3d2-color-icon-gray-900)"/>
                  </svg>
                  <svg class="s3d-smarto-tours__nav-button-icon--when-active" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00008 7.29286L8.35363 7.64642L12.5001 11.7929L16.6465 7.64642L17.0001 7.29286L17.7072 7.99997L17.3536 8.35352L13.2072 12.5L17.3536 16.6464L17.7072 17L17.0001 17.7071L16.6465 17.3535L12.5001 13.2071L8.35363 17.3535L8.00008 17.7071L7.29297 17L7.64652 16.6464L11.793 12.5L7.64652 8.35352L7.29297 7.99997L8.00008 7.29286Z" fill="var(--s3d2-color-icon-gray-900)"></path>
                  </svg>
                </div>
                <div class="s3d-smarto-tours__nav-button s3d-smarto-tours__floorplan-toggle" title="${this.i18n.t(
                  'SmartoTours.floor_show_or_hide',
                )}">
                    <svg class="s3d-smarto-tours__nav-button-icon--when-inactive" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M2.5 21.5L21.5 21.5L21.5 2.5L10.6816 2.5L10.6816 4.79981L11.6816 4.79981L11.6816 3.5L20.5 3.5L20.5 11.21L15.5459 11.21L15.5459 12.21L20.5 12.21L20.5 20.5L11.6816 20.5L11.6816 15.7744L10.6816 15.7744L10.6816 20.5L3.5 20.5L3.5 12.21L11.6816 12.21L11.6816 9.59961L10.6816 9.59961L10.6816 11.21L2.5 11.21L2.5 21.5Z" fill="var(--s3d2-color-icon-gray-900)"/>
                    </svg>
                    <svg class="s3d-smarto-tours__nav-button-icon--when-active" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00008 7.29286L8.35363 7.64642L12.5001 11.7929L16.6465 7.64642L17.0001 7.29286L17.7072 7.99997L17.3536 8.35352L13.2072 12.5L17.3536 16.6464L17.7072 17L17.0001 17.7071L16.6465 17.3535L12.5001 13.2071L8.35363 17.3535L8.00008 17.7071L7.29297 17L7.64652 16.6464L11.793 12.5L7.64652 8.35352L7.29297 7.99997L8.00008 7.29286Z" fill="var(--s3d2-color-icon-gray-900)"></path>
                  </svg>
                </div>
                <div class="s3d-smarto-tours__nav-button" data-smarto-tours-nav title="${this.i18n.t(
                  'SmartoTours.menu',
                )}">
                  <svg class="s3d-smarto-tours__nav-button-icon--when-inactive" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M19.7471 15.752L19.7471 16.752L4.25195 16.752L4.25195 15.752L19.7471 15.752ZM19.7471 11.499L19.7471 12.499L4.25195 12.499L4.25195 11.499L19.7471 11.499ZM13.5352 7.24609L13.5352 8.24609L4.25195 8.24609L4.25195 7.24609L13.5352 7.24609Z" fill="var(--s3d2-color-icon-gray-900)"/>
                  </svg>
                  <svg class="s3d-smarto-tours__nav-button-icon--when-active" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00008 7.29286L8.35363 7.64642L12.5001 11.7929L16.6465 7.64642L17.0001 7.29286L17.7072 7.99997L17.3536 8.35352L13.2072 12.5L17.3536 16.6464L17.7072 17L17.0001 17.7071L16.6465 17.3535L12.5001 13.2071L8.35363 17.3535L8.00008 17.7071L7.29297 17L7.64652 16.6464L11.793 12.5L7.64652 8.35352L7.29297 7.99997L8.00008 7.29286Z" fill="var(--s3d2-color-icon-gray-900)"></path>
                  </svg>
                </div>
            </div>
            ${this.getNavButtons()}
            ${this.getScene(`
                <div class="s3d-smarto-tours__css-hotspots-wrapper">
                </div>
            `)}
            <div class="s3d-smarto-tours__accelerometer-toggle">
                <button class="s3d2-ButtonIconLeft s3d2-ButtonIconLeft--secondary" title="${this.i18n.t(
                  'SmartoTours.motion_view',
                )}">
                    <span class="vr-option-text"></span>
                    <div class="checkbox-wrapper-6" style="margin-left: var(--space-2);">
                        <input name="" class="tgl tgl-light" data-accelerometer-toggle type="checkbox">
                        <label class="tgl-btn" for="data-hightlight-svg-elements"></label>
                    </div>
                </button>

            </div>
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
                          levelData.tour_v2_premise_level,
                          `${this.i18n.t('SmartoTours.floor')} ${levelData.tour_v2_premise_level}`,
                        );
                        const order = get(this.customNavFloorsOrders, index, null);
                        return `<div ${
                          order ? `style="order: ${order}"` : ''
                        } class="flat-plan-level-button" data-flatplan-floor-button="${
                          levelData.tour_v2_premise_level
                        }" data-aframe-src="#${levelData.tour_v2_premise_id}">
                                ${title}
                            </div>
                        `;
                      })
                      .join('')}
                </div>
                ${this.getFlatGenplan(
                  this.flat_plan_data,
                  this.data,
                  this.flat_level_photos,
                  this.flat_plan,
                )}
            </div>
            <div data-textures-buttons class="s3d-smarto-tours__textures">
            </div>
            <div class="s3d-smarto-tours__zoom-slider">
                <div class="s3d-smarto-tours__zoom-slider-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 20L14.9497 14.9497M14.9497 14.9497C16.2165 13.683 17 11.933 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C11.933 17 13.683 16.2165 14.9497 14.9497ZM7 10H13M10 7V13" stroke="var(--s3d2-color-text-gray-900)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </div>
                <div data-zoom-slider></div>
            </div>
        `;
  }

  findClosestScrollableParent(element) {
    let parent = element.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY;
      const overflowX = style.overflowX;

      if (
        overflowY === 'auto' ||
        overflowY === 'scroll' ||
        overflowX === 'auto' ||
        overflowX === 'scroll' ||
        parent.scrollHeight > parent.clientHeight ||
        parent.scrollWidth > parent.clientWidth
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window;
  }
  showLoadWarningMessage() {
    Toastify({
      text: 'Scene is loading, please wait...',
      duration: 3000,
      close: false,
      gravity: 'top',
      position: 'right',
      style: {
        background: 'var(--color-brand-800)',
        color: '#fff',
        fontSize: '16px',
      },
    }).showToast();
  }

  getSphereForPremiseInnerTexture(id) {
    return `
            <a-sphere
                data-texture-sphere="${id}"
                radius="${this.SPHERE_RADIUS - 0.1}"
                scale="-1 1 1"
                position="0 1.6 0"
                rotation="0 0 0"
                visible="false"

                segments-width='64',
                segments-height='64',
                material="transparent: true; shader: flat; side: back;"
            ></a-sphere>
        `;
  }

  getSceneCssHotspot({
    hotspot,
    safeId,
    title,
    imgSrc,
    isTouchDevice,
    changeSceneAttribute,
    index,
  }) {
    return `
            <div data-scene-id="${
              hotspot.source_scene_id
            }" data-hotspot-index="${index}" class="hotspot-label hidden" id="${safeId}" ${
      isTouchDevice ? '' : changeSceneAttribute
    }>
                    <div class="hotspot-label__title"></div>
                    <div class="hotspot-label__hover">
                        <span>${title.tour_v2_premise_title}</span>
                        <img src="${imgSrc.tour_v2_premise_img.url}" alt="">
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
        `;
  }

  getSceneCssInfoHotspot({
    hotspot,
    safeId,
    isTouchDevice,
    changeSceneAttribute,
    title_key,
    index,
  }) {
    return `
            <div data-scene-id="${
              hotspot.source_scene_id
            }" data-hotspot-index="${index}" class="hotspot-label hotspot-label--info hidden" id="${safeId}" ${
      isTouchDevice ? '' : changeSceneAttribute
    }>
                    <div class="hotspot-label__title ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="var(--color-brand-800)" stroke-width="1.5"/>
                            <path d="M12 17V11" stroke="var(--color-brand-800)" stroke-width="1.5" stroke-linecap="round"/>
                            <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill="var(--color-brand-800)"/>
                        </svg>
                    </div>
                    <div class="hotspot-label__hover">
                        <span>${this.getInfoHotspotTranslation(title_key)}</span>
                </div>
            </div>
        `;
  }

  getTextureGroupCss({
    hotspot,
    safeId,
    title,
    imgSrc,
    isTouchDevice,
    changeSceneAttribute,
    index,
  }) {
    const currentScene = this.data.find(el => {
      if (!Array.isArray(el.tour_v2_premises_textures)) return false;
      const textures = el.tour_v2_premises_textures.find(
        tex => tex.tour_v2_single_texture_group_id === hotspot.hotspot_id.replace('texture-', ''),
      );
      return textures;
    });
    const currentTextureGroup = currentScene
      ? currentScene.tour_v2_premises_textures.find(
          tex => tex.tour_v2_single_texture_group_id === hotspot.hotspot_id.replace('texture-', ''),
        )
      : null;

    if (!currentTextureGroup) {
      console.warn(`No texture found: ${hotspot.hotspot_id} ${currentScene}`);
      return '';
    }

    return `
            <div data-scene-id="${
              hotspot.source_scene_id
            }" data-hotspot-index="${index}"  class="menu-container" id="${safeId}">
                <button class="center-button">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g transform="translate(-1200.000000, 0.000000)">
                                <g id="settings_2_line" transform="translate(1200.000000, 0.000000)">
                                    <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero"></path>
                                    <path d="M18,4 C18,3.44772 17.5523,3 17,3 C16.4477,3 16,3.44772 16,4 L16,5 L4,5 C3.44772,5 3,5.44772 3,6 C3,6.55228 3.44772,7 4,7 L16,7 L16,8 C16,8.55228 16.4477,9 17,9 C17.5523,9 18,8.55228 18,8 L18,7 L20,7 C20.5523,7 21,6.55228 21,6 C21,5.44772 20.5523,5 20,5 L18,5 L18,4 Z M4,11 C3.44772,11 3,11.4477 3,12 C3,12.5523 3.44772,13 4,13 L6,13 L6,14 C6,14.5523 6.44772,15 7,15 C7.55228,15 8,14.5523 8,14 L8,13 L20,13 C20.5523,13 21,12.5523 21,12 C21,11.4477 20.5523,11 20,11 L8,11 L8,10 C8,9.44772 7.55228,9 7,9 C6.44772,9 6,9.44772 6,10 L6,11 L4,11 Z M3,18 C3,17.4477 3.44772,17 4,17 L16,17 L16,16 C16,15.4477 16.4477,15 17,15 C17.5523,15 18,15.4477 18,16 L18,17 L20,17 C20.5523,17 21,17.4477 21,18 C21,18.5523 20.5523,19 20,19 L18,19 L18,20 C18,20.5523 17.5523,21 17,21 C16.4477,21 16,20.5523 16,20 L16,19 L4,19 C3.44772,19 3,18.5523 3,18 Z" fill="#09244B"></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </button>
                <div
                    data-texture-image="default"
                    data-texture-group-id="${currentTextureGroup.tour_v2_single_texture_group_id}"
                    class="option-item material-1"
                    style="background: url(${
                      currentTextureGroup.tour_v2_single_texture_group_default_preview
                    }) no-repeat center center; background-size: cover;"
                >
                    <span class="option-label">
                        ${
                          currentTextureGroup.tour_v2_single_texture_group_title
                            ? currentTextureGroup.tour_v2_single_texture_group_title
                            : 'Default'
                        }
                    </span>

                </div>
                ${
                  currentTextureGroup &&
                  Array.isArray(currentTextureGroup.tour_v2_single_texture_group_images)
                    ? currentTextureGroup.tour_v2_single_texture_group_images
                        .map(
                          (texture, index) => `
                    <div
                        data-texture-image="${texture.tour_v2_single_texture_group_images_id}"
                        data-texture-group-id="${
                          currentTextureGroup.tour_v2_single_texture_group_id
                        }"
                        class="option-item material-${index + 2}"
                        style="background: url(${
                          texture.tour_v2_single_texture_group_images_preview
                        }) no-repeat center center; background-size: cover;"
                    >
                        <span class="option-label">
                            ${texture.tour_v2_single_texture_group_images_title}
                        </span>

                    </div>
                `,
                        )
                        .join('')
                    : ''
                }
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
                device-orientation-permission-ui="enabled: false"
            >
                <div data-custom-loading-screen class="s3d-smarto-tours__loading-screen text-style-3-d-fonts-1920-h-1" slot="loading-screen">
                    <div class="spinner"></div>
                    <span class="loader"></span>
                    <p>Loading...</p>
                </div>
                <a-entity light="type: ambient; color: #fff"></a-entity>
                <a-assets>
                    <img crossorigin="anonymous" id="${this.HOTSPOT_ASSETS_ID}" src="${
      this.themeFolder
    }assets/s3d/images/smarto-tours-v3/smarto-tours-pin.svg"/>
                    <img crossorigin="anonymous" id="${this.HOTSPOT_TEXTURE_ASSETS_ID}" src="${
      this.themeFolder
    }assets/s3d/images/smarto-tours-v3/smarto-text ure-group-pin-preview.svg"/>

                </a-assets>
                <a-entity id="smarto-v3-right-laser-controller" laser-controls="hand: right" raycaster="objects: .collidable, .collidable-texture-group; far: ${this
                  .SPHERE_RADIUS * 1.5}" laser-events></a-entity>
                <a-entity id="smarto-v3-left-laser-controller" laser-controls="hand: left" raycaster="objects: .collidable, .collidable-texture-group; far: ${this
                  .SPHERE_RADIUS * 1.5}" laser-events></a-entity>

                <a-sphere
                    ${Object.entries(this.getSphereAttributes())
                      .map(([key, value]) => `${key}="${value}"`)
                      .join(',\n')}
                >
                </a-sphere>
                <a-videosphere 
                  src="#antarctica"
                  muted="true"
                  autoplay="true"
                  loop="true"
                  ${Object.entries(this.getSphereAttributes())
                      .map(([key, value]) => `${key}="${value}"`)
                      .join(',\n')}
                  visible="false"
                ></a-videosphere>

                <!-- Camera + Cursor. -->
                ${this.getCamera()}
                ${children}
            </a-scene>
        `;
  }

  getFullscreenButton() {
    return `
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

  getTextureGroupForNavMenu(textureGroup, data) {
    return `
                <div
                    data-texture="${textureGroup.tour_v2_single_texture_group_id}"
                    data-aframe-src="#${data.tour_v2_premise_id}"
                    class="s3d-smarto-tours__texture-group-title"
                >
                    ${textureGroup.tour_v2_single_texture_group_name}
                </div>
                <ul>
                    <li>
                        <button
                            class="s3d-smarto-tours__texture-button"
                            data-texture-image="default"
                            data-texture-group-id="${textureGroup.tour_v2_single_texture_group_id}"
                            data-aframe-src="#${data.tour_v2_premise_id}"
                            type="button"
                        >
                            <span>${
                              textureGroup.tour_v2_single_texture_group_title
                                ? textureGroup.tour_v2_single_texture_group_title
                                : 'Default'
                            }</span>
                            ${
                              textureGroup.tour_v2_single_texture_group_default_preview
                                ? `
                                <img src="${textureGroup.tour_v2_single_texture_group_default_preview}"/>
                            `
                                : ''
                            }
                        </button>
                    </li>
                    ${
                      Array.isArray(textureGroup.tour_v2_single_texture_group_images)
                        ? textureGroup.tour_v2_single_texture_group_images
                            .map(
                              texture => `
                        <li>
                            <button
                                class="s3d-smarto-tours__texture-button"
                                data-texture-image="${
                                  texture.tour_v2_single_texture_group_images_id
                                }"
                                data-texture-group-id="${
                                  textureGroup.tour_v2_single_texture_group_id
                                }"
                                data-aframe-src="#${data.tour_v2_premise_id}"
                                type="button"
                            >
                                <span>${texture.tour_v2_single_texture_group_images_title}</span>
                                ${
                                  texture.tour_v2_single_texture_group_images_preview
                                    ? `
                                    <img src="${texture.tour_v2_single_texture_group_images_preview}"/>
                                `
                                    : ''
                                }
                            </button>
                        </li>
                    `,
                            )
                            .join('')
                        : ''
                    }
                </ul>
        `;
  }

  getTextureGroupHoverImageItem({ x, y, textureImageId, textureGroupId, src }) {
    /*
            data-texture-image="${texGroup.tour_v2_single_texture_group_images_id}"
            data-texture-group-id="${textureGroupId}"
        */
    return `
            <a-image
                position="0 ${x} ${y}"
                rotation="0 0 0"
                width="1.5"
                height="1.5"
                src="${src}"
                data-texture-image="${textureImageId}"
                data-texture-group-id="${textureGroupId}"
                geometry="primitive: circle; radius: 0.75"
                material="side: front"
                class="collidable"
            ></a-image>
            <a-ring
                position="0 ${x} ${y}"
                rotation="0 0 0"
                radius-inner="0.75"
                radius-outer="0.88"
                material="side: double; color: white;"
                class="collidable"
            ></a-ring>
        `;
  }

  fragmentShaderForChangeScene() {
    return `
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
        `;
  }

  vertexShaderForChangeScene() {
    return `
            varying vec2 vUV;
            void main() {
            vUV = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
  }

  getSphereAttributes() {
    return {
      'data-sphere': '',
      // src: `#${this.data[0].tour_v2_premise_id}`,
      radius: `${this.SPHERE_RADIUS}`,
      material: `shader: fade; src: #${this.data[0].tour_v2_premise_id}; target: #${this.data[0].tour_v2_premise_id}; side: back; progress: 0`,
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
      position: this.sphericalToCartesian(hotspot.theta, hotspot.phi, this.SPHERE_RADIUS * 0.8),
      'look-at': '#cam-v3',
    };
  }

  getLayoutOfCurvedImageForHotspotPreview({
    hotspot,
    x,
    YOffset,
    z,
    textAndBgYPosition,
    textLength,
    currentScene,
  }) {
    return `
            <a-image
                data-hotspot-preview-image="#${hotspot.source_scene_id}"
                src="#${hotspot.source_scene_id}"
                width="${this.SPHERE_RADIUS / 2.5 - 0.2}"
                height="${this.SPHERE_RADIUS / 5 - 0.2}"
                position="${x} ${YOffset} ${z}"
                look-at="#cam-v3"
                material="side: front; offset: 0 0.04; repeat: 0.66 0.67"
                animation="property: scale; from: 0.85 0.85 0.85; to: 1 1 1; dur: 500; easing: easeInOutQuad; dir: alternate"
                visible="false"
            ></a-image>

            <a-plane
                data-hotspot-preview-image="#${hotspot.source_scene_id}"
                data-hotspot-preview-border
                color="#000"
                material="transparent: false"
                position="${x} ${YOffset} ${z}"
                width="${this.SPHERE_RADIUS}"
                height="${this.SPHERE_RADIUS / 5 + 1}"
            ></a-plane>

            <a-troika-text
                data-hotspot-preview-image="#${hotspot.source_scene_id}"
                position="${x} ${textAndBgYPosition} ${z}"
                align="center"
                color="#000"
                look-at="#cam-v3"
                value="${currentScene.tour_v2_premise_title}"
                animation="property: scale; from: 0.85 0.85 0.85; to: 1 1 1; dur: 500; easing: easeInOutQuad; dir: alternate"
                visible="false"
                outline-width="0"
                outline-color="#000"
                font-size="${floor(this.SPHERE_RADIUS / 30, 2)}"
            ></a-troika-text>

            <a-plane
                data-hotspot-preview-image="#${hotspot.source_scene_id}"
                color="#ffffff"
                material="transparent: false"
                position="${x} ${textAndBgYPosition} ${z}"
                width="${(textLength * (this.SPHERE_RADIUS / 25)) / 1.8}"
                height="${this.SPHERE_RADIUS / 15 - 0.3}"
            ></a-plane>
        `;
  }

  getInfoHotspotTranslation(key) {
    if (!Array.isArray(this.infoHotspotTranslations)) return key;
    const translationObj = this.infoHotspotTranslations.find(el => el.info_hotspot_key === key);
    if (!translationObj) return key;
    return translationObj.info_hotspot_text || key;
  }
}
