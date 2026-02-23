import s3d2_InfoHoverTips from '../../../../../s3d2/scripts/templates/common/s3d2_InfoHoverTips';
import mapboxgl from 'mapbox-gl';

export default class MapboxBlock {
  constructor({ mountTo, accessToken, center, markers = [], i18n, zoom = 17 }) {
    this.root = typeof mountTo === 'string' ? document.querySelector(mountTo) : mountTo;

    if (!this.root) throw new Error('Mount element not found');
    mapboxgl.accessToken = accessToken;
    this.center = center;
    this.markers = markers;
    this.zoom = zoom;
    this.render(i18n);
    this.initMap();
  }

  render(i18n) {
    this.root.innerHTML = `
      <section class="mapbox-block">

        <div class="payment__title-icon-container">
          <h1 class="payment__title-icon-container__title">${i18n.t('Flat.location.title')}</h1>
          ${s3d2_InfoHoverTips({
            classNameContent: 'mapbox-info-block',
            content: i18n.t('Flat.location.tips'),
          })}
        </div>
        <p class="mapbox-block__subtitle">${i18n.t('Flat.location.subtitle')}</p>
        <div class="mapbox-block__map-container">
        <div class="map-controls">
          <div class="map-button" id="dawn">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <circle cx="19" cy="19" r="18.5" fill="white" />
                <path d="M29.9414 29.9673L7.44141 29.9673" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M24.717 29.9669C24.717 26.8095 22.1574 24.25 19.0001 24.25C15.8427 24.25 13.2832 26.8095 13.2832 29.9669"
                  stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.998 17.9084V20.3202" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M18.998 12.7725L18.998 6.53246" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22.1094 8.33984L19.0723 5.95312" stroke="#4264FB" stroke-width="2" stroke-linecap="round" />
                <path d="M15.8867 8.33984L18.9238 5.95312" stroke="#4264FB" stroke-width="2" stroke-linecap="round" />
                <path d="M10.4746 21.4402L12.1786 23.1458" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M27.5245 21.4402L25.8184 23.1458" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
              </g>
            </svg>
          </div>
          <div class="map-button" id="day">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <circle cx="19" cy="19.0002" r="18.5" fill="white" />
                <path
                  d="M19 24.5467C22.0635 24.5467 24.5469 22.0632 24.5469 18.9998C24.5469 15.9363 22.0635 13.4529 19 13.4529C15.9366 13.4529 13.4531 15.9363 13.4531 18.9998C13.4531 22.0632 15.9366 24.5467 19 24.5467Z"
                  stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19 7.30005V9.6401" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M10.7285 10.7268L12.3819 12.3817" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.30078 18.9998H9.64083" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M10.7285 27.2725L12.3834 25.6182" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19 30.6999V28.3589" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M27.2726 27.2725L25.6172 25.6182" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M30.6994 19.0002H28.3594" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M27.2726 10.7268L25.6172 12.3817" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
              </g>
            </svg>
          </div>
          <div class="map-button" id="dusk">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <circle cx="19" cy="19" r="18.5" fill="white" />
                <path
                  d="M24.4979 28.9589C24.4979 25.923 22.0368 23.4619 19.0009 23.4619C15.965 23.4619 13.5039 25.923 13.5039 28.9589"
                  stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19 17.3643V19.6833" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M10.8008 20.7603L12.4393 22.4003" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M30.25 28.9592L7.75 28.9592" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M27.1991 20.7603L25.5586 22.4003" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.998 5.90894L18.998 12.1489" stroke="#4264FB" stroke-width="2" stroke-miterlimit="10"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.8887 10.3416L18.9258 12.7283" stroke="#4264FB" stroke-width="2" stroke-linecap="round" />
                <path d="M22.1113 10.3416L19.0742 12.7283" stroke="#4264FB" stroke-width="2" stroke-linecap="round" />
              </g>
            </svg>
          </div>
          <div class="map-button" id="night">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g>
                <circle cx="19" cy="19" r="18.5" fill="white" />
                <path
                  d="M18.53 27.9489C14.9462 28.7919 11.3593 27.5714 9.01172 25.0631C10.617 25.5423 12.3651 25.6235 14.1138 25.2139C19.4467 23.9597 22.7537 18.6189 21.4996 13.2864C21.0884 11.5378 20.2364 10.01 19.0919 8.78589C22.3837 9.77013 25.0744 12.4361 25.9173 16.0214C27.1705 21.3549 23.864 26.6947 18.53 27.9489Z"
                  stroke="#4264FB" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
              </g>
            </svg>
          </div>
        </div>
        <div class="mapbox-block__map"></div>
        </div>
      </section>
    `;

    this.mapContainer = this.root.querySelector('.mapbox-block__map');
  }

  initMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/standard',
      center: this.center,
      zoom: this.zoom,
      antialias: true,
      pitch: 45,
      bearing: -20,
      hash: true,
      antialias: true,
      scrollZoom: false,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.addMarkers();
      this.fitToMarkers();

      //    this.map.addLayer({
      //     'id': 'add-3d-buildings',
      //     'source': 'composite',
      //     'source-layer': 'building',

      //     'type': 'fill-extrusion',
      //     'minzoom': 15,
      //     'paint': {
      //         'fill-extrusion-color': '#aaa',

      //         // Використовуємо інтерполяцію для плавної появи висоти
      //         'fill-extrusion-height': [
      //             'interpolate',
      //             ['linear'],
      //             ['zoom'],
      //             15,
      //             0,
      //             15.5,
      //             ['get', 'height']
      //         ],
      //         'fill-extrusion-base': [
      //             'interpolate',
      //             ['linear'],
      //             ['zoom'],
      //             15,
      //             0,
      //             15.5,
      //             ['get', 'min_height']
      //         ],

      //     }

      // });
    });

    this.map.on('load', () => {
      const defaultLightPreset = this.map.getConfigProperty('basemap', 'lightPreset') || 'day';
      let activeButton = document.getElementById(defaultLightPreset);
      activeButton.classList.add('selected');
      document.querySelectorAll('.map-button').forEach(button => {
        button.addEventListener('click', () => {
          this.map.setConfigProperty('basemap', 'lightPreset', button.id);
          if (activeButton) activeButton.classList.remove('selected');
          button.classList.add('selected');
          activeButton = button;
        });
      });
    });
  }

  addMarkers() {
    if (!this.markers.length) return;
    this.markers.forEach(({ lng, lat, title }) => {
      const popup = title ? new mapboxgl.Popup({ offset: 25 }).setText(title) : null;

      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  fitToMarkers() {
    if (!this.markers.length) return;
    const bounds = new mapboxgl.LngLatBounds();
    this.markers.forEach(({ lng, lat }) => bounds.extend([lng, lat]));
    // this.map.fitBounds(bounds, {
    //   padding: 80,
    //   maxZoom: 16,
    //   duration: 1000,
    // });
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
