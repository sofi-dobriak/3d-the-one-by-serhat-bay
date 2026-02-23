import axios from 'axios';

export default function renderFlatFlyby(link, flatId, flat, getFlat) {
  axios.get(link).then(el => {
    const container = document.querySelector('[data-flat-flyby-svg-container]');
    const parser = new DOMParser();
    const doc = parser.parseFromString(el.data, 'text/html');
    const svg = doc.querySelector('svg');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg
      .querySelectorAll('[data-type="infrastructure"], [data-type="flyby"]')
      .forEach(el => el.remove());
    svg.querySelectorAll(`polygon`).forEach(el => el.setAttribute('fill', 'none'));
    svg.querySelectorAll(`polygon[data-type="flat"]`).forEach(el => {
      el.classList.add('polygon__filter-select');
      el.dataset['_type'] = getFlat(el.dataset.id)['build_name'];
    });
    svg.querySelectorAll(`polygon[data-_type="${flat.build_name}"]`).forEach(el => {
      el.classList.add('active');
      // el.classList.remove('polygon__filter-select');
    });
    svg.querySelectorAll(`[data-id="${flatId}"]`).forEach(el => el.classList.add('active'));
    container.insertAdjacentElement('beforeend', svg);
    container.scrollTo({
      left: container.scrollWidth / 2 - window.innerWidth / 2,
      behavior: 'smooth',
    });
  });
}
