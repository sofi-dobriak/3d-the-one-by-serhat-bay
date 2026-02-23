export default function createFlybyVillaPage(flat) {
  const villaHtml = `<div class="s3d-villa__flyby-wrapper">
          <div class="s3d-villa__flyby" data-flat-flyby-svg-container>
            <img data-genplan-image-container src="${
              flat.flybyImageHref ? flat.flybyImageHref : '#'
            }">
          </div>
        </div>`;

  return villaHtml;
}
