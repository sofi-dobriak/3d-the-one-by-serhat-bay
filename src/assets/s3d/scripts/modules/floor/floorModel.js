import find from 'lodash/find';
import { htmlZoom } from '../../../../s3d2/scripts/features/html-zoom';
import createFloor from '../templates/floorPage/floor';
import createFloorSvg from '../templates/floorSvg';
import EventEmitter from '../eventEmitter/EventEmitter';
import { preloader } from '../general/General';
import getFloor from '../getFloor';
import sendError from '../sendError';
import { BehaviorSubject } from 'rxjs';
import { deviceType } from 'detect-it';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import Toastify from 'toastify-js';
import Floor_s3d2 from '../../../../s3d2/scripts/templates/floor/s3d2-floor-page';

const ErrorCallbackUpdateLocation = (i18n, hostname, keyMessage, type = '', newLocation) => err => {
  sendError(i18n, hostname, keyMessage, type, err);
  // errorPopup.setType('withTranslate');
  // errorPopup.open(keyMessage, () => {
  //   location.href = newLocation;
  // });
};
const { origin, pathname, search } = location;

class Floor extends EventEmitter {
  constructor(data, i18n) {
    super();
    this.type = data.type;
    this.getFlat = data.getFlat;
    this.generalWrapId = data.generalWrapId;
    this.createWrap();
    this.wrapper = document.querySelector(`.js-s3d__wrapper__${this.type}`);
    this.history = data.history;
    this.updateFsm = data.updateFsm;
    this.configProject = data.settings;
    this.preloader = preloader;
    this.floorList$ = data.floorList$;
    this.infoBox = data.infoBox;
    this.i18n = i18n;
    this.changeFloorData = {
      prev: data.settings.floor,
      next: data.settings.floor,
    };

    this.cacheFloor = data.cacheFloor || (() => {});

    this.updateLastVisitedFloor = data.updateLastVisitedFloor;
    this.show_prices = data.show_prices;
    this.changeZoomButtonsState = this.changeZoomButtonsState.bind(this);
    this.debouncedChangeZoomButtonsState = debounce(this.changeZoomButtonsState, 300);
    this.floor_page_settings = data.floor_page_settings;
    this.getFlat = data.getFlat;

    this.hideOverlayHandler();
    this.filterHandler();
    this.handleInfoBoxOverlay();
  }

  handleInfoBoxOverlay() {
    this.infoBox.state$.subscribe(value => {
      if (deviceType === 'mouseOnly') return;
      const floor = this.wrapper.querySelector('.s3d-floor');
      if (floor) floor.classList.toggle('with-overlay', value === 'hover');
    });

    this.wrapper.addEventListener('click', event => {
      const target = event.target.closest('[data-floor-overlay]');
      if (event.target.closest('polygon')) return;
      if (!target) return;
      this.infoBox.changeState('static');
    });
  }

  toggleOverlay(isNeedToHide) {
    this.wrapper.querySelectorAll('polygon, g').forEach(elem => {
      elem.style.display = isNeedToHide ? 'none' : '';
    });
  }

  init() {
    this.update();
  }

  async update(config) {
    this.configProject = config ?? this.configProject;

    const isThisFloorCached = this.floorList$.value.some(
      floor =>
        floor.cached &&
        floor.build === this.configProject.build &&
        floor.section === this.configProject.section &&
        floor.floor === this.configProject.floor,
    );

    const floorData = isThisFloorCached
      ? this.floorList$.value.find(
          floor =>
            floor.cached &&
            floor.build === this.configProject.build &&
            floor.section === this.configProject.section &&
            floor.floor === this.configProject.floor,
        ).async_data
      : await getFloor(this.configProject);

    if (!isThisFloorCached && this.cacheFloor) {
      this.cacheFloor(this.configProject, floorData);
    }

    if (!floorData) {
      ErrorCallbackUpdateLocation(
        this.i18n,
        location.href,
        'Floor data is not received',
        'high',
        `${origin}${pathname}`,
      )({
        requestData: this.configProject,
        response: floorData,
        data: {
          message: 'Floor data is not received, redirected to the main page',
          build: this.configProject.build,
          section: this.configProject.section,
          floor: this.configProject.floor,
        },
      });
      this.onError();
      return;
    }
    if (!floorData.url || !floorData.flatsIds) {
      ErrorCallbackUpdateLocation(
        this.i18n,
        location.href,
        'Floor data is not received',
        'high',
        `${origin}${pathname}`,
      )({
        requestData: 'test',
        response: floorData,
        data: {
          message: 'Floor data is broken, redirected to the main page',
          build: this.configProject.build,
          section: this.configProject.section,
          floor: this.configProject.floor,
        },
      });
      this.onError();
      return;
    }

    this.setPlaneInPage(floorData);

    this.updateLastVisitedFloor(this.configProject);
    const floorsOfThisBuild = this.floorList$.value
      .filter(floor => {
        return (
          floor.build === this.configProject.build && floor.section === this.configProject.section
        );
      })
      .sort(function(a, b) {
        return a.floor - b.floor;
      });

    this.emit('renderFloorList', {
      data: floorsOfThisBuild,
      active: this.configProject.floor,
    });

    setTimeout(() => {
      this.preloader.turnOff(document.querySelector('.js-s3d__select[data-type="floor"]'));
      this.preloader.hide();
    }, 600);

    this.emit('flatRoomsFilter', this.configProject);
    this.toggleOverlay(this.hideOverlay$.value);

    this.handleFloorZoom();
    this.defineFiltersOnChangeFloor();
    document.querySelector('[data-type="rooms-all"]').checked =
      this.bedroomsFilter$.value.size === 0;
  }

  changeZoomButtonsState(instance) {
    console.log('changeZoomButtonsState', this);
    const isMaxZoom = instance.content.currentScale === instance.content.maxScale;
    const isMinZoom = instance.content.currentScale === instance.content.minScale;
    this.wrapper.querySelectorAll('[data-floor-zoom-button-up]').forEach(button => {
      button.disabled = isMaxZoom;
    });
    this.wrapper.querySelectorAll('[data-floor-zoom-button-down]').forEach(button => {
      button.disabled = isMinZoom;
    });
  }

  handleFloorZoom() {
    if (this.floorZoom) this.floorZoom.destroy();
    this.floorZoom = htmlZoom(this.wrapper, '[data-svg-floor-zoom]', {
      rescale: this.debouncedChangeZoomButtonsState,
    });

    console.log('this.floorZoom ', this.floorZoom);

    if (!this.initedZoomHandlers) {
      this.wrapper.addEventListener('click', event => {
        const target = event.target.closest('[data-floor-zoom-button-up]');
        if (!target) return;
        console.log(this.floorZoom);
        this.getFloorZoom().zoomUp();
      });
      this.wrapper.addEventListener('click', event => {
        const target = event.target.closest('[data-floor-zoom-button-down]');
        if (!target) return;
        this.getFloorZoom().zoomDown();
      });
      this.initedZoomHandlers = true;
    }
  }

  getFloorZoom() {
    return this.floorZoom;
  }

  createWrap() {
    const wrap = createMarkup('div', { class: `s3d__wrap js-s3d__wrapper__${this.type}` });
    document.querySelector(this.generalWrapId).insertAdjacentElement('beforeend', wrap);
  }

  touchPolygonMobileHandler(target) {
    // event.preventDefault();
    const config = {
      ...target.dataset,
      type: 'flat',
    };
    this.infoBox.changeState('hover', config);
  }

  updateInfoboxPosition(event) {
    if (!event) {
      this.infoBox.changeState('static');
      return;
    }
    this.infoBox.updatePosition(event);
  }

  selectFlat(id) {
    this.updateFsm({
      type: 'flat',
      id,
    });
  }

  checkChangeFloor() {
    const {
      build: currentBuild,
      section: currentSection,
      floor: currentFloor,
    } = this.configProject;
    const listFloors = this.floorList$.value
      .filter(data => data.build === currentBuild && data.section === currentSection)
      .map(data => window.parseInt(data.floor))
      .sort(function(a, b) {
        return a - b;
      });

    const index = listFloors.indexOf(currentFloor);
    const changeFloorData = {
      prev: listFloors[index - 1],
      next: listFloors[index + 1],
    };
    if (index === 0) {
      changeFloorData.prev = null;
    }
    if (index === listFloors.length - 1) {
      changeFloorData.next = null;
    }
    this.changeFloorData = changeFloorData;

    this.emit('renderCurrentFloor', this.configProject);
    this.emit('renderFloorChangeButtons', this.changeFloorData);
  }

  changeFloorHandler(direction) {
    const nextFloor = this.changeFloorData[direction];
    this.configProject = {
      ...this.configProject,
      floor: nextFloor,
    };
    this.update();
  }

  preparationFlats(flatsIds) {
    return flatsIds.map(id => this.getFlat(id));
  }

  preparationFloor() {
    const floors = this.floorList$.value;
    const { floor, build, section } = this.configProject;
    return find(floors, { floor, build, section });
  }

  setPlaneInPage(response) {
    const { url, flatsIds, size: sizeImage } = response;

    const preparedFlats = this.preparationFlats(flatsIds).map(flat => {
      if (!flat) return;
      const flatId = flat.id || undefined;
      if (flatId === undefined) return { ...flat };
      if (!response.cords) return { ...flat };
      return { ...flat, sortedFromServer: response.cords ? response.cords[flat.id] : flat.sorts };
    });
    const preparedFloor = this.preparationFloor();
        const floorsOfThisBuild = this.floorList$.value
      .filter(floor => {
        return (
          floor.build === this.configProject.build && floor.section === this.configProject.section
        );
      })
      .sort(function(a, b) {
        return a.floor - b.floor;
      });
    const floorHtml = Floor_s3d2({
      i18n: this.i18n,
      floorList: floorsOfThisBuild,
      activeFloor: this.configProject.floor,
      hideOverlay: this.hideOverlay$.value,
      showPrices: this.show_prices,
      getFlat: this.getFlat,
    });

    const flatValueToRenderInPoygon = get(
      this,
      'floor_page_settings.polygonValueToRender1',
      undefined,
    );
    const flatValueToRenderInPoygon2 = get(
      this,
      'floor_page_settings.polygonValueToRender2',
      undefined,
    );

    const floorSvgHtml = createFloorSvg(
      this.i18n,
      url,
      preparedFlats,
      sizeImage,
      undefined,
      flatValueToRenderInPoygon,
      flatValueToRenderInPoygon2,
    );
     this.emit('setFloor', floorHtml);
    this.emit('removeFloorSvg');
    this.emit('setFloorSvg', floorSvgHtml);
    setTimeout(() => {
   

      const floorPageEl = document.querySelector('.js-s3d-floor');
      if (floorPageEl) {
        const middleOfScroll = floorPageEl.scrollWidth / 2 - floorPageEl.clientWidth / 2;
        floorPageEl.scrollTo(middleOfScroll, 0, { behavior: 'smooth' });
      }
    }, 1250);

    this.checkChangeFloor();
  }

  updateHoverDataFlat(elem) {
    this.emit('updateHoverDataFlat');
  }

  bedroomsFilter(elem) {
    this.emit('bedroomsFilter');
  }

  filterHandler() {
    this.bedroomsFilter$ = new BehaviorSubject(new Set());

    document.body.addEventListener('change', event => {
      const target = event.target.closest('[data-type*="rooms"]');
      if (!target) return;
      if (target.value === 'all') {
        this.bedroomsFilter$.next(new Set());
        document.body
          .querySelectorAll('[data-type*="rooms"]')
          .forEach(item => (item.checked = item === target));
        return;
      }
      if (!target.checked) {
        this.bedroomsFilter$.next(
          new Set(
            [...this.bedroomsFilter$.value].filter(item => {
              return item !== target.value;
            }),
          ),
        );
        return;
      }
      document.querySelector('[data-type="rooms-all"]').checked = false;
      this.bedroomsFilter$.next(new Set([...this.bedroomsFilter$.value]).add(target.value));
    });
    this.bedroomsFilter$.subscribe(value => {
      this.emit('bedroomsFilter', value);
    });
  }

  defineFiltersOnChangeFloor() {
    this.wrapper.querySelectorAll('[data-type*="rooms"]').forEach(item => {
      if (item.value === 'all') {
        item.checked = false;
        return;
      }
      if (this.bedroomsFilter$.value.has(item.value)) {
        item.checked = true;
      }
    });
    this.emit('bedroomsFilter', this.bedroomsFilter$.value);
  }

  hideOverlayHandler() {
    this.hideOverlay$ = new BehaviorSubject(false);
    this.hideOverlay$.subscribe(value => {
      this.toggleOverlay(value);
    });

    document.body.addEventListener('change', event => {
      const target = event.target.closest('[data-highlight-floor-svg-elements]');
      if (!target) return;
      this.hideOverlay$.next(target.checked);
    });
  }

  toggleAnimationCircle(dataId) {
    document
      .querySelectorAll(`.s3d2_SvgFloorPolygonTooltip__title[data-id="${dataId}"]`)
      .forEach(item => item.classList.toggle('active'));
  }

  onError() {
    Toastify({
      text: this.i18n.t('Floor.error'),
      position: 'center',
      duration: 5000,
      className: 'error',
    }).showToast();
    setTimeout(() => {
      this.updateFsm({
        type: 'plannings',
      });
    }, 2000);
  }
}
export default Floor;
