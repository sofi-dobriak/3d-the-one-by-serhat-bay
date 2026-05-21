function getMarkup(i18n) {
  const label = i18n.t('manifest.label');
  const lines = i18n.t('manifest.lines', { returnObjects: true });
  const total = lines.length;

  const markup = lines
    .map((text, i, arr) => {
      if (!text) return '<br>';
      const nonEmpty = arr.filter(Boolean);
      const nonEmptyIndex = nonEmpty.indexOf(text);
      const isStrong = nonEmptyIndex >= nonEmpty.length - 2;
      return `<p class="manifesto-text__line${
        isStrong ? ' manifesto-text--strong' : ''
      }">${text}</p>`;
    })
    .join('');

  return `
    <div class="manifesto-backdrop" id="manifesto-backdrop">
      <div class="manifesto-modal" role="dialog" aria-modal="true" aria-labelledby="manifesto-title">
        <button class="manifesto-close" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>

        <div class="manifesto-content">
          <h2 class="manifesto-title">${label}</h2>

          <div class="manifesto-divider">
            <span class="manifesto-divider__line"></span>
            <span class="manifesto-divider__dot"></span>
            <span class="manifesto-divider__line"></span>
          </div>

          <div class="manifesto-text">${markup}</div>

          <div class="manifesto-footer">
          <button class="manifesto-discover" aria-label="Discover">
              <span class="manifesto-footer__line"></span>
              <span class="manifesto-discover__label">${i18n.t('discover_btn')}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
                <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function openManifestoModal(i18n, onClose) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = getMarkup(i18n);

  const backdrop = wrapper.firstElementChild;
  document.body.appendChild(backdrop);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => backdrop.classList.add('manifesto-backdrop--in'));
  });

  const close = () => {
    backdrop.classList.add('manifesto-backdrop--out');
    backdrop.addEventListener(
      'animationend',
      () => {
        backdrop.remove();
        if (onClose) onClose();
      },
      { once: true },
    );
  };

  backdrop.querySelector('.manifesto-discover').addEventListener('click', close);
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) close();
  });
  document.addEventListener(
    'keydown',
    e => {
      if (e.key === 'Escape') close();
    },
    { once: true },
  );
}
