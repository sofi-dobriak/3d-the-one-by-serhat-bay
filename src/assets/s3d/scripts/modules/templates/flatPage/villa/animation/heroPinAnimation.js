import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let animationCleanup = null;

function initAnimations() {
  const scrollTriggers = [];
  let refreshCount = 0;
  const MAX_REFRESHES = 2;

  ScrollTrigger.getAll().forEach(st => st.kill());

  const scrollContainer = document.querySelector('.s3d-villa') || window;
  const flybyElement = document.querySelector('.s3d-villa__flyby-wrapper');
  const flybyLastScreen = document.querySelector('[last-screen-animation]');

  if (flybyElement && flybyLastScreen) {
    const flybyTimeline = gsap.timeline();
    flybyTimeline.fromTo(flybyElement, { y: -210 }, { y: 0, ease: 'sine.inOut' });

    const trigger = ScrollTrigger.create({
      trigger: '[last-screen-animation]',
      start: 'bottom bottom',
      end: '+=100%',
      animation: flybyTimeline,
      scroller: scrollContainer,
      scrub: true,
    });

    scrollTriggers.push(trigger);

    setTimeout(() => {
      if (refreshCount < MAX_REFRESHES) {
        ScrollTrigger.refresh();
        refreshCount++;
        console.log(`ScrollTrigger refresh ${refreshCount}/${MAX_REFRESHES}`);
      }
    }, 1000);
  } else {
    console.warn('Required elements for flyby animation not found:', {
      flybyWrapper: !!flybyElement,
      flybyText: !!flybyText,
    });
  }

  const heroElement = document.querySelector('.s3d-villa-hero');
  const heroImageElement = document.querySelector('.s3d-villa-hero__img');
  const flybyText = document.querySelector('.s3d-villa-hero__info');

  if (heroElement && heroImageElement) {
    const heroTimeline = gsap
      .timeline()
      .to(heroImageElement, {
        scale: 1.05,
        y: -100,
        duration: 1.2,
        opacity: 0.1,
        ease: 'sine.inOut',
      })
      .to(
        flybyText,
        {
          yPercent: -50,
          opacity: 0.1,
          ease: 'sine.inOut',
        },
        '<',
      );

    const trigger = ScrollTrigger.create({
      trigger: heroElement,
      start: 'top top',
      end: '+=100%',
      scrub: 1,
      scroller: scrollContainer,
      animation: heroTimeline,
    });

    scrollTriggers.push(trigger);
  } else {
    console.warn('Required elements for hero animation not found:', {
      heroElement: !!heroElement,
      heroImageElement: !!heroImageElement,
    });
  }

  ScrollTrigger.refresh();

  return () => {
    scrollTriggers.forEach(trigger => trigger.kill());
  };
}

window.addEventListener('updateFsm', evt => {
  const data = evt.detail || {};

  if (data.type === 'flat') {
    console.log('Flat page detected, initializing hero pin animation');

    if (animationCleanup) {
      animationCleanup();
    }

    setTimeout(() => {
      animationCleanup = initAnimations();
    }, 100);
  }
});

export default initAnimations;
