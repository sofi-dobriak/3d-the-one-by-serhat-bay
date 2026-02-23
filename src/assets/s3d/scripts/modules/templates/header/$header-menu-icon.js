export default function $headerMenuIcon(menuSelector) {
  return `
    <div class="s3d__menu" ${menuSelector}>
      <div class="s3d__menu-elem-wrapper">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
}
