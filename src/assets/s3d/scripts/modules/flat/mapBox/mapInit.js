let currentMap = null;

export const initLazyMap = ({ selector, accessToken, center, markers, i18n }) => {
  const el = document.querySelector(selector);
  
  if (!el) return;

  const observer = new IntersectionObserver(
    entries => {
      if (!entries[0].isIntersecting) return;
      
      observer.disconnect();

      import('./MapboxBlock').then(({ default: MapboxBlock }) => {
        if (currentMap) currentMap.destroy();
       
        currentMap = new MapboxBlock({
          mountTo: selector,
          accessToken,
          center,
          markers,
          i18n,
        });
      });
    },
    {
      rootMargin: '200px',
    },
  );

  observer.observe(el);
};
