export default function renderFaqCard(question, answer) {
  return `
    <div class="s3d-villa__faq-card" data-faq-card data-faq-toggle>
      <div class="s3d-villa__faq-card-inner">
        <div class="s3d-villa__faq-card__question-wrap">
          <div class="s3d-villa__faq-card__question">
            ${question}
          </div>
          <div class="s3d-villa__faq-card__question-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="12" x2="18" y2="12" stroke="black"/>
              <line x1="12" y1="18" x2="12" y2="6" stroke="black"/>
            </svg>
          </div>
        </div>
        <div class="s3d-villa__faq-card__answer">
          ${answer}
        </div>
      </div>
    </div>
  `;
}
