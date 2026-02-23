export default function $villaUpArrow() {
  return `
    <div class="s3d2-villa__up-arrow" onclick="this.parentElement.scrollTo({top: 0, behavior: 'smooth'})">
      <span>UP</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0129 6.18323L19.1709 12.8939L19.8548 12.1643L11.8548 4.66435L11.5129 4.34375L11.1709 4.66435L3.1709 12.1643L3.85484 12.8939L11.0129 6.18323L11.0129 20.0291L12.0129 20.0291L12.0129 6.18323Z" fill="none"/>
      </svg>
    </div>
  `;
}
