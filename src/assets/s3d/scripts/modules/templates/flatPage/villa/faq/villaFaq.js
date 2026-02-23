export default class Accordion {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) throw new Error('Accordion container not found');
    this.singleOpen = options.singleOpen || false;
    this.init();
  }

  init() {
    this.container.addEventListener('click', this.toggleAccordion.bind(this));
  }

  toggleAccordion(event) {
    const toggleButton = event.target.closest('[data-faq-toggle]');
    if (!toggleButton) return;

    const faqCard = toggleButton.closest('[data-faq-card]');
    if (!faqCard) return;
    if (event.target.closest('.s3d-villa__faq-card__answer')) return;

    const isOpen = faqCard.hasAttribute('data-open');

    if (this.singleOpen) {
      this.closeAllExcept(faqCard);
    }

    if (isOpen) {
      this.closeCard(faqCard);
    } else {
      this.openCard(faqCard);
    }
  }

  openCard(card) {
    card.setAttribute('data-open', 'true');
    const answer = card.querySelector('.s3d-villa__faq-card__answer');
    if (answer) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  }

  closeCard(card) {
    card.removeAttribute('data-open');
    const answer = card.querySelector('.s3d-villa__faq-card__answer');
    if (answer) {
      answer.style.maxHeight = null;
    }
  }

  closeAllExcept(exceptionCard) {
    const openCards = this.container.querySelectorAll('[data-faq-card][data-open]');
    openCards.forEach(card => {
      if (card !== exceptionCard) {
        this.closeCard(card);
      }
    });
  }
}
