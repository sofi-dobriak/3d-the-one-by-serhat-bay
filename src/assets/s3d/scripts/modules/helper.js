import $ from 'jquery';
import size from 'lodash/size';
import gsap from 'gsap/gsap-core';
import HelperNode from './templates/helper';
import { driver } from 'driver.js';
import dispatchTrigger from './helpers/triggers';
import s3d2spriteIcon from '../../../s3d2/scripts/templates/spriteIcon';
import { isFullScreenAvailable } from '../../../s3d2/scripts/helpers/helpers_s3d2';

class HelperGif {
  constructor(i18n, countSlides = 4, onFaq) {
    this.currentWindow = 0;
    this.countSlides = countSlides;
    this.onFaq = onFaq;
    this.i18n = i18n;
    this.animation = gsap.timeline({ duration: 0, ease: 'Power4.easeInOut' });
  }

  async init() {
    if (document.querySelector('.js-s3d__helper-gif-wrap')) return;
    document.querySelector('body').insertAdjacentHTML('beforeend', HelperNode());
    this.wrap = document.querySelector('.js-s3d__helper-gif-wrap');
    $('.js-s3d__helper-gif__close').on('click', () => {
      this.hiddenHelper();
    });
    $('.js-s3d__helper-gif__link').on('click', () => {
      this.currentWindow++;
      if (this.currentWindow >= this.countSlides) {
        this.hiddenHelper();
        return;
      }
      this.update(this.currentWindow);
    });

    const openHelper = $('.js-s3d-ctr__helper');
    if (size(openHelper) > 0) {
      openHelper.on('click', () => {
        this.currentWindow = 0;
        console.log('show me FAQ');
        this.newFaq();
        // this.update(this.currentWindow);
        // dispatchTrigger('faq-button-click', {
        //   url: window.location.href
        // })
        // setTimeout(() => {
        //   this.showHelper();
        // }, 300);
      });
    }
    if (window.localStorage.getItem('info')) return;
    this.updateContent(0, () => {
      // this.triggerGif(this.currentWindow);
    });
    this.wrap.querySelector('[data-all_count]').innerHTML = this.countSlides;
    setTimeout(() => {
      // this.showHelper();
    }, 300);
  }

  newFaq() {
    const steps = [
      {
        element: '.SpinNav',
        popover: {
          title: this.i18n.t('tutorial.step_nav'),
          description: this.i18n.t('tutorial.step_nav_description'),
        },
        onHighlightStarted: () => {
          gsap
            .timeline({
              repeat: 3,
            })
            .to('.SpinNav button', { duration: 0.3, scale: 1.2, ease: 'Power1.easeIn' })
            .to('.SpinNav button', {
              duration: 0.3,
              scale: 1,
              ease: 'Power1.easeIn',
              clearProps: 'all',
            });
        },
      },
      {
        element: document.documentElement.classList.contains('desktop')
          ? '.FlybyController'
          : '.MobileFlybyController',
        popover: {
          title: this.i18n.t('tutorial.step_interact'),
          description: this.i18n.t('tutorial.step_interact_description'),
        },
        onHighlightStarted: () => {
          const element = document.documentElement.classList.contains('desktop')
            ? '.FlybyController'
            : '.MobileFlybyController';
          gsap
            .timeline({
              repeat: 3,
            })
            .to(element, { duration: 0.3, scale: 1.1, ease: 'Power1.easeIn' })
            .to(element, { duration: 0.3, scale: 1, ease: 'Power1.easeIn', clearProps: 'all' });
        },
      },
      {
        element: document.documentElement.classList.contains('desktop')
          ? '.ButtonIconLeft.js-s3d-ctr__filter'
          : '.MobileFlybyController .js-s3d-ctr__filter',
        popover: {
          title: this.i18n.t('tutorial.ster_filter'),
          description: this.i18n.t('tutorial.ster_filter_description'),
          side: document.documentElement.classList.contains('desktop') ? undefined : 'top',
          align: document.documentElement.classList.contains('desktop') ? undefined : 'end',
          offset: document.documentElement.classList.contains('desktop') ? undefined : 10,
        },
        onHighlightStarted: () => {
          const element = document.documentElement.classList.contains('desktop')
            ? '.ButtonIconLeft.js-s3d-ctr__filter'
            : '.MobileFlybyController .js-s3d-ctr__filter';
          gsap
            .timeline({
              repeat: 3,
            })
            .to(element, { duration: 0.3, scale: 1.1, ease: 'Power1.easeIn' })
            .to(element, { duration: 0.3, scale: 1, ease: 'Power1.easeIn', clearProps: 'all' });
        },
      },
      {
        element: '.header__right .s3d__favourite-container.js-s3d__favourite-open',
        popover: {
          title: this.i18n.t('tutorial.step_compare'),
          description: this.i18n.t('tutorial.step_compare_description'),
        },
        onHighlightStarted: () => {
          const element = '.header__right .s3d__favourite-container.js-s3d__favourite-open';
          gsap
            .timeline({
              repeat: 3,
            })
            .to(element, { duration: 0.3, scale: 1.1, ease: 'Power1.easeIn' })
            .to(element, { duration: 0.3, scale: 1, ease: 'Power1.easeIn', clearProps: 'all' });
        },
      },
      {
        element: '.header__right [data-s3d-share]',
        popover: {
          title: this.i18n.t('tutorial.step_share'),
          description: this.i18n.t('tutorial.step_share_description'),
        },
        onHighlightStarted: () => {
          const element = '.header__right [data-s3d-share]';
          gsap
            .timeline({
              repeat: 3,
            })
            .to(element, { duration: 0.3, scale: 1.1, ease: 'Power1.easeIn' })
            .to(element, { duration: 0.3, scale: 1, ease: 'Power1.easeIn', clearProps: 'all' });
        },
      },
    ];

    if (isFullScreenAvailable()) {
      steps.push({
        element: '.header__right [data-fullscreen-mode]',
        popover: {
          title: this.i18n.t('tutorial.step_fullscreen'),
          description: this.i18n.t('tutorial.step_fullscreen_description'),
        },
        onHighlightStarted: () => {
          const element = '.header__right [data-fullscreen-mode]';
          gsap
            .timeline({
              repeat: 3,
            })
            .to(element, { duration: 0.3, scale: 1.1, ease: 'Power1.easeIn' })
            .to(element, { duration: 0.3, scale: 1, ease: 'Power1.easeIn', clearProps: 'all' });
        },
      });
    }

    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'close'],
      allowClose: false,
      progressText: '{{current}}/{{total}}',
      doneBtnText: this.i18n.t('Helper.gotIt'),
      closeBtnText: this.i18n.t('Helper.close'),
      nextBtnText: this.i18n.t('Helper.next'),
      onCloseClick: () => {
        console.log('Close Button Clicked');
        // Implement your own functionality here
        driverObj.destroy();
      },
      onPopoverRender: ($popover, data) => {
        $popover.title.insertAdjacentElement('afterbegin', $popover.progress);
        $popover.closeButton.insertAdjacentHTML(
          'beforeend',
          `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99995 7.29297L8.35351 7.64652L12.5 11.793L16.6464 7.64652L17 7.29297L17.7071 8.00008L17.3535 8.35363L13.2071 12.5001L17.3535 16.6465L17.7071 17.0001L17 17.7072L16.6464 17.3536L12.5 13.2072L8.35351 17.3536L7.99995 17.7072L7.29285 17.0001L7.6464 16.6465L11.7928 12.5001L7.6464 8.35363L7.29285 8.00008L7.99995 7.29297Z" fill="#1A1E21"/>
          </svg>`,
        );

        // Для додання стрілок на кнопках навігації

        // if ($popover.nextButton) {
        //   $popover.nextButton.insertAdjacentHTML(
        //     'beforeend',
        //     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 8px;">
        //   <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        // </svg>`,
        //   );
        // }

        // if ($popover.prevButton) {
        //   $popover.prevButton.insertAdjacentHTML(
        //     'afterbegin',
        //     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
        //   <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        // </svg>`,
        //   );
        // }
        console.log('onPopoverRender', $popover, data);
      },
      steps,
    });
    driverObj.drive();
    dispatchTrigger('faq-open', {
      url: window.location.href,
    });
  }

  update(numberSlide) {
    this.updateContent(numberSlide, () => {
      this.triggerGif(this.currentWindow, 'hide');
      this.triggerGif(this.currentWindow + 1);
    });
  }

  showHelper() {
    this.wrap.classList.add('s3d-active');
  }

  hiddenHelper() {
    this.wrap.classList.remove('s3d-active');
    window.localStorage.setItem('info', true);
    this.triggerGif(this.currentWindow, 'hide');
  }

  updateContent(numberSlide, cb) {
    const helper = document.querySelector('.js-s3d__helper-gif');
    helper.dataset.step = this.currentWindow;
    const titleContainer = this.wrap.querySelector('[data-type="title"]');
    const closeContainer = this.wrap.querySelector('[data-type="close"]');
    const groupContainer = this.wrap.querySelector('.s3d__helper-gif__group');
    const countCurrentContainer = this.wrap.querySelector('[data-current_count]');
    const countAllContainer = this.wrap.querySelector('[data-all_count]');
    this.animation
      .fromTo(titleContainer, { opacity: 1 }, { opacity: 0 })
      .fromTo(closeContainer, { opacity: 1 }, { opacity: 0 }, '<')
      .fromTo(groupContainer, { opacity: 1 }, { opacity: 0 }, '<')
      .then(() => {
        titleContainer.innerHTML = this.i18n.t(`Helper.slide-${numberSlide}--title`);
        closeContainer.innerHTML = this.i18n.t('Helper.close');
        countCurrentContainer.innerHTML = this.currentWindow + 1;
        countAllContainer.innerHTML = this.countSlides;
        cb();
        this.animation
          .fromTo(titleContainer, { opacity: 0 }, { opacity: 1 })
          .fromTo(closeContainer, { opacity: 0 }, { opacity: 1 }, '<')
          .fromTo(groupContainer, { opacity: 0 }, { opacity: 1 }, '<');
      }, '>');
  }

  triggerGif(num, type = 'show') {
    const numId = num > 0 ? num : 1;
    const container = document.getElementById(`animated-svg-${numId}`);
    const animate = gsap.timeline({ direction: 1.8, ease: 'Power4.easeInOut' });
    const prevAlpha = type === 'hide' ? 1 : 0;
    const pastAlpha = type === 'hide' ? 0 : 1;
    animate.fromTo(container, { autoAlpha: prevAlpha }, { autoAlpha: pastAlpha });
    setTimeout(() => {
      container.contentDocument.querySelector('svg').dispatchEvent(new Event('click'));
    }, 1500);
  }
}

function findTopLeftBounds(pointsAttr) {
  const pointsArr = pointsAttr.split(' ');
  let leftmost = parseFloat(pointsArr[0].split(',')[0]);
  let topmost = parseFloat(pointsArr[0].split(',')[1]);

  for (let i = 1; i < pointsArr.length; i++) {
    const point = pointsArr[i].split(',');
    const x = parseFloat(point[0]);
    const y = parseFloat(point[1]);

    if (x < leftmost) {
      leftmost = x;
    }

    if (y < topmost) {
      topmost = y;
    }
  }

  return {
    top: topmost,
    leftmost: leftmost,
  };
}

export default HelperGif;
