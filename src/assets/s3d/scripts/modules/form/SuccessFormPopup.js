import BigButton from '../../../../s3d2/scripts/templates/common/BigButton.js';
import s3d2_BigButton from '../../../../s3d2/scripts/templates/common/s3d2_BigButton.js';
import s3d2spriteIcon from '../../../../s3d2/scripts/templates/spriteIcon.js';
import dispatchTrigger from '../helpers/triggers.js';

export default class SuccessFormPopup {
  constructor(props) {
    this._id = `popup${(Math.random() * 1000).toFixed(0)}`;
    this.modalManager = props.modalManager;
    this.inited = false;
    this.config = props.config;
    this.i18n = props.i18n;
    this.closeAttr = 'data-popup-close';
    this.container = props.container || document.body;
    this.successPopupOpenBound = this.successPopupOpen.bind(this);
    this.successPopupCloseBound = this.successPopupClose.bind(this);
    this.successPopupOnOverlayClickCloseBound = this.successPopupOnOverlayClickClose.bind(this);
    this.init();
  }

  init() {
    if (!this.inited) {
      this.container.insertAdjacentHTML('beforeend', this.getTemplate());
      const self = this;
      window.addEventListener('form-open', this.successPopupOpenBound);
      window.addEventListener('click', this.successPopupCloseBound);
      window.addEventListener('click', this.successPopupOnOverlayClickCloseBound);
      this.confettifull = new Confettiful(this.get$Content());
      this.inited = true;
    }
  }

  successPopupOpen(evt) {
    this.open();
  }

  successPopupClose(evt) {
    console.log('SuccessFormPopup', evt.target.closest(`[${this.closeAttr}]`));
    if (evt.target.closest(`[${this.closeAttr}]`) === null) return;
    this.close();
  }

  successPopupOnOverlayClickClose(evt) {
    if (evt.target.classList.contains('SuccessFormPopup')) this.close();
  }

  close() {
    this.confettifull.stop();
    window.removeEventListener('click', this.successPopupOnOverlayClickCloseBound);
    window.removeEventListener('click', this.successPopupCloseBound);
    window.removeEventListener('form-open', this.successPopupOpenBound);
    document.querySelector(`#${this._id}`).remove();
  }

  open() {
    document.querySelector(`#${this._id}`).style.visibility = 'visible';
    document.querySelector(`#${this._id}`).style.opacity = '1';
    this.confettifull.start();
    dispatchTrigger('success-popup-open', {
      url: window.location.href,
    });
    if (this.modalManager) this.modalManager.open(this._id);
  }

  get$Content() {
    return document.querySelector(`#${this._id} .SuccessFormPopup__content`);
  }

  getTemplate() {
    return `
        <div class="SuccessFormPopup" id="${this._id}">
          <div class="SuccessFormPopup__content">
            <div class="SuccessFormPopup__close" ${this.closeAttr}>
              ${s3d2spriteIcon('close')}
            </div>
            <div class="SuccessFormPopup__title">
              ${this.i18n.t('SuccessFormPopup.title')}
            </div>
            ${s3d2_BigButton(
              'SuccessFormPopup__button',
              this.closeAttr,
              this.i18n.t('SuccessFormPopup.button'),
              null,
            )}
            <div class="SuccessFormPopup__text">
              ${this.i18n.t('SuccessFormPopup.text')}
            </div>
            <div class="SuccessFormPopup__bg">
              <img src="/wp-content/themes/3d/assets/images-wp/logo.png" alt="">
            </div>
          </div>
        </div>
    `;
  }

  get$Form() {
    return document.querySelector(`#${this._id}`);
  }
}

const Confettiful = function(el) {
  this.el = el;
  this.containerEl = null;

  this.confettiFrequency = 3;
  this.confettiColors = ['#fce18a', '#ff726d', '#b48def', '#f4306d'];
  this.confettiAnimations = ['slow', 'medium', 'fast'];

  this._setupElements();
  // this._renderConfetti();
};

Confettiful.prototype._setupElements = function() {
  const containerEl = document.createElement('div');
  const elPosition = this.el.style.position;

  if (elPosition !== 'relative' || elPosition !== 'absolute') {
    this.el.style.position = 'relative';
  }

  containerEl.classList.add('confetti-container');

  this.el.appendChild(containerEl);

  this.containerEl = containerEl;
};

Confettiful.prototype._renderConfetti = function() {
  this.confettiInterval = setInterval(() => {
    const confettiEl = document.createElement('div');
    const confettiSize = Math.floor(Math.random() * 3) + 7 + 'px';
    const confettiBackground = this.confettiColors[
      Math.floor(Math.random() * this.confettiColors.length)
    ];
    const confettiLeft = Math.floor(Math.random() * this.el.offsetWidth) + 'px';
    const confettiAnimation = this.confettiAnimations[
      Math.floor(Math.random() * this.confettiAnimations.length)
    ];

    confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
    confettiEl.style.left = confettiLeft;
    confettiEl.style.width = confettiSize;
    confettiEl.style.height = confettiSize;
    confettiEl.style.backgroundColor = confettiBackground;

    confettiEl.removeTimeout = setTimeout(function() {
      confettiEl.parentNode.removeChild(confettiEl);
    }, 3000);

    this.containerEl.appendChild(confettiEl);
  }, 100);
};

Confettiful.prototype.stop = function() {
  clearInterval(this.confettiInterval);

  const confettiEl = document.querySelectorAll('.confetti');

  for (let i = 0; i < confettiEl.length; i++) {
    clearTimeout(confettiEl[i].removeTimeout);
    confettiEl[i].parentNode.removeChild(confettiEl[i]);
  }
};

Confettiful.prototype.start = function() {
  this._renderConfetti();
};

Confettiful.prototype.destroy = function() {
  this.stop();
  this.containerEl.parentNode.removeChild(this.containerEl);
};

// window.confettiful = new Confettiful(document.querySelector('.js-container'));
