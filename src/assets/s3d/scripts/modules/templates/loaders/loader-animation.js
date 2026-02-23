// document.addEventListener('DOMContentLoaded', () => {
//   window.onload = function () {
//     window.setTimeout(() => {
//       document.querySelector('.js-fs-preloader').classList.add('loading');
//     }, 1200);
//   };
// })

window.addEventListener('load-svg-structure', () => {
  setTimeout(() => {
    const preloader = document.querySelector('.js-fs-preloader');
    if (preloader) preloader.classList.add('loading');
  }, 1000);
});

// $(document).ready( function() {
//   $(".fs-preloader-persent-main").circularProgress({
//     persent: 0,
//   }).circularProgress('animate', 100, 200);
// });
//
// $(window).on('load', function() {
//   var $preloader = $('.js-fs-preloader');
//   $preloader.delay(2000).fadeOut('slow');
// });
