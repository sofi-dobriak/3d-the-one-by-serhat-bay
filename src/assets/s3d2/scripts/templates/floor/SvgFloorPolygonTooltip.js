export default function SvgFloorPolygonTooltip({
  x,
  y,
  title,
  description,
  isActive,
  isSold,
  dataId = null,
}) {
  const className = isActive ? 'SvgFloorPolygonTooltip--active' : '';
  let area;

  function truncateToSingleDecimal(number) {
    return Math.floor(number * 10) / 10;
  }

  if (description) {
    area = truncateToSingleDecimal(description);
  }

  return `
    <foreignObject x="${x}" y="${y}" width="64" height="64" class="SvgFloorPolygonTooltip-wrapper">
      <div class="SvgFloorPolygonTooltip ${className}">
        ${
          description && !isSold
            ? `<div class="SvgFloorPolygonTooltip__title" data-id="${dataId ?? ''}">${title}</div>`
            : ''
        }          
      </div>
    </foreignObject>
  `;
}
