function menuOpen(menu) {
  menu.classList.add('active');
}

function menuClose(menu) {
  menu.addEventListener('animationend', () => {

    menu.classList.remove('active');
    menu.classList.remove('slide-out-right');
  }, { once: true });
  menu.classList.add('slide-out-right');
}

export function menuInit() {

}
document.body.addEventListener('click', event => {
  const openButton = event.target.closest('[data-open-menu]');
  const closeButton = event.target.closest('[data-menu-close]');
  const menu = document.querySelector('[data-menu]');
  // console.log('openButton', openButton);
  // console.log('closeButton', closeButton);
  if (openButton) {
    menuOpen(menu);
    openButton.classList.add('menu-opened');
  }

  if (closeButton) {
    menuClose(menu);
    const openedButton = document.querySelector('.menu-opened');
    if (openedButton) {
      openedButton.classList.remove('menu-opened');
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(menuInit, 3000);
});