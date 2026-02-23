export default function s3d2_SvgFloorPolygonTooltip({
  x,
  y,
  title,
  description,
  isActive,
  isSold,
  dataId = null,
}) {
  const className = isActive ? 's3d2_SvgFloorPolygonTooltip--active' : '';
  let area;

  function truncateToSingleDecimal(number) {
    return Math.floor(number * 10) / 10;
  }

  if (description) {
    area = truncateToSingleDecimal(description);
  }

  return `
    <foreignObject x="${x}" y="${y}" width="64" height="64" class="s3d2_SvgFloorPolygonTooltip-wrapper">
      <div class="s3d2_SvgFloorPolygonTooltip ${className}">
        ${
          description && !isSold
            ? `<div class="s3d2_SvgFloorPolygonTooltip__title" data-id="${dataId ?? ''}">
                <div>${title}</div>
                <div>${description}</div>
            </div>`
            : ''
        }          
      </div>
    </foreignObject>
  `;
}