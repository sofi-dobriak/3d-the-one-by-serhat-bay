function getMarkup(i18n) {
  const label = i18n.t('manifest.label');
  const lines = i18n.t('manifest.lines', { returnObjects: true });
  const total = lines.length;

  const markup = lines
    .map((text, i) => {
      const isStrong = i >= total - 2;
      return `<p class="manifesto-text__line${
        isStrong ? ' manifesto-text--strong' : ''
      }">${text}</p>`;
    })
    .join('');

  return `
    <div class="manifesto-backdrop" id="manifesto-backdrop">
      <div class="manifesto-modal" role="dialog" aria-modal="true" aria-labelledby="manifesto-title">
        <div class="manifesto-header">
          <p class="manifesto-label" id="manifesto-title">${label}</p>
          <button class="manifesto-close" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="manifesto-text">${markup}</div>
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

  backdrop.querySelector('.manifesto-close').addEventListener('click', close);
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
