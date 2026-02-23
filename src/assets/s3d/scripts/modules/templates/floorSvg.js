import s3d2_SvgFloorPolygonTooltip from '../../../../s3d2/scripts/templates/floor/s3d2_SvgFloorPolygonTooltip';
import SvgFloorPolygonTooltip from '../../../../s3d2/scripts/templates/floor/SvgFloorPolygonTooltip';
import center from 'svg-polygon-center';

const getCenterPolygon = polygon => {
  const points = normalizepolygonPoints(polygon);
  // return center(points);
  return calculateCentroid(points);
};

const createSoldIcon = ({ x, y }, imageWidth, imageHeight, wrapperSize) => {
  const size = 100;
  const width = (imageWidth / wrapperSize.width) * size;
  const height = (imageHeight / wrapperSize.height) * size;
  const updatedX = x - width / 2;
  const updatedY = y - height / 2;
  return `<use x=${updatedX} y=${updatedY} width="${+width}" height="${+height}" xlink:href="#closed"></use>`;
};

const createPlusIcon = ({ x, y }, imageWidth, imageHeight, wrapperSize) => {
  const size = 100;
  const width = (imageWidth / wrapperSize.width) * size;
  const height = (imageHeight / wrapperSize.height) * size;
  const updatedX = x - width / 2;
  const updatedY = y - height / 2;
  return `<use x=${updatedX} y=${updatedY} width="${+width}" height="${+height}" xlink:href="#plus"></use>`;
};

const createInfoIcon = (
  { x, y },
  imageWidth,
  imageHeight,
  wrapperSize,
  title,
  description,
  isActive,
  isSold,
  dataId,
) => {
  const size = 64;
  const width = (imageWidth / wrapperSize.width) * size;
  const height = (imageHeight / wrapperSize.height) * size;
  const updatedX = x - size / 2;
  const updatedY = y;
  const fontSize = 20;
  const padding = 5;
  return s3d2_SvgFloorPolygonTooltip({
    x: updatedX,
    y: updatedY,
    title: title,
    isActive,
    description,
    isSold,
    dataId,
  });
  return `
  <g style="pointer-events: none" class="test">
    <rect rx="8" ry="8" fill="#000000" x=${updatedX} y=${updatedY} height="${fontSize +
    padding * 2}px" width="100px"
      style=" transform: translateY(-${fontSize + padding - 2}px) translateX(-17px);
      transform-origin: center;
      transform-box: fill-box;"></rect>
    <text fill="#FFFFFF" style="font-size: ${fontSize}px; font-weight: bold"  x=${updatedX} y=${updatedY}>${title}</text>
  </g>
  `;
};

function createFloorSvg(
  i18n,
  pathImage,
  flats,
  sizeImage,
  activeFlatId,
  valueToRenderInPolygon,
  valueToRenderInPolygon2,
) {
  const imageDefault = `${window.defaultModulePath}/images/examples/no-image.png`;

  if (!sizeImage) {
    return `
    <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" class="s3d-floor__svg">
      <image src=${imageDefault} xlink:href=${imageDefault} x="0" y="0" height="100%" width="100%" ></image>
    </svg>`;
  }

  const { 0: imageWidth = 100, 1: imageHeight = 100 } = sizeImage;

  const fullPathImage = pathImage ? `${defaultProjectPath}/assets${pathImage}` : imageDefault;
  const dataAttr = [
    ['section', 'section'],
    ['area', 'area'],
    ['life-area', 'life_room'],
    ['rooms', 'rooms'],
    ['rooms_unit', 'rooms_unit'],
    ['type', 'type'],
    ['id', 'id'],
    ['price', 'price'],
    ['floor', 'floor'],
    ['number', 'number'],
    ['img', 'img_small'],
    ['sale', 'sale'],
  ];
  const numSoldKey = 0;
  const wrapperSize = {
    width: document.documentElement.offsetWidth,
    height: document.documentElement.offsetHeight,
  };

  const polygons = flats
    .map(flat => {
      if (!flat ) return '';
      const posCenterPoly = getCenterPolygon(
        flat.sortedFromServer ? flat.sortedFromServer : flat.sorts,
      );
      const isSold = flat.sale == numSoldKey;
      const soldIcon =
        isSold && createSoldIcon(posCenterPoly, imageWidth, imageHeight, wrapperSize);
      const infoPolygonTitle = createInfoIcon(
        posCenterPoly,
        imageWidth,
        imageHeight,
        wrapperSize,
        flat.area,
        isSold,
        flat.id,
      );
      const dataAttrFlat = dataAttr
        .map(([newName, objName]) => `data-${newName}="${flat[objName]}"`)
        .join(' ');
      const polygonClasses = `s3d-flat__polygon ${isSold ? '' : 'js-s3d-flat__polygon'} ${
        activeFlatId === flat.id ? 's3d-flat-active' : ''
      }`;
      const roomsCount = flat.rooms;

      return `<polygon class="${polygonClasses} ${roomsCount}" points=${
        flat.sortedFromServer ? flat.sortedFromServer : flat.sorts
      } ${dataAttrFlat} data-sold="false" data-tippy-element ></polygon>
      ${soldIcon || ''}
    `;
    })
    .join('');
  const polygonsInfo = flats
    .map(flat => {
      if (!flat) return '';
      const isSold = flat.sale == numSoldKey;
      // if (!flat['sorts'] || isSold) return '';
      const valueToRenderOnPolygon = valueToRenderInPolygon;
      const valueToRenderOnPolygon2 = valueToRenderInPolygon2;

      const flatValueToRender1 = flat[valueToRenderOnPolygon];
      const flatValueToRender2 = valueToRenderInPolygon2 && /i18n/.test(valueToRenderInPolygon2) ? i18n.t(valueToRenderInPolygon2.split('--')[1]) : flat[valueToRenderOnPolygon2];
      const posCenterPoly = getCenterPolygon(
        flat.sortedFromServer ? flat.sortedFromServer : flat.sorts,
      );
      const infoPolygonTitle = createInfoIcon(
        posCenterPoly,
        imageWidth,
        imageHeight,
        wrapperSize,
        flatValueToRender1,
        flatValueToRender2,
        activeFlatId === flat.id,
        isSold,
        flat.id,
      );
      return `
      ${infoPolygonTitle || ''}
    `;
    })
    .join('');
  const html = `
    <svg viewBox="0 0 ${imageWidth} ${imageHeight}" xmlns="http://www.w3.org/2000/svg" class="s3d-floor__svg" >
      <symbol id="closed" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32Z" fill="#DBE4EC"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M29.5551 25.4372C30.1878 24.91 31.0659 24.6 31.9994 24.6C32.9329 24.6 33.811 24.91 34.4437 25.4372C35.0733 25.9618 35.3994 26.6474 35.3994 27.3333V29.4H28.5994V27.3333C28.5994 26.6474 28.9256 25.9618 29.5551 25.4372ZM28.0002 30.6C27.9999 30.6 27.9997 30.6 27.9994 30.6C27.9992 30.6 27.9989 30.6 27.9986 30.6H25.5994V39.4H38.3994V30.6H36.0002C35.9999 30.6 35.9997 30.6 35.9994 30.6C35.9992 30.6 35.9989 30.6 35.9986 30.6H28.0002ZM36.5994 29.4V27.3333C36.5994 26.2512 36.0827 25.241 35.212 24.5154C34.3444 23.7924 33.1876 23.4 31.9994 23.4C30.8112 23.4 29.6544 23.7924 28.7869 24.5154C27.9161 25.241 27.3994 26.2512 27.3994 27.3333V29.4H24.9994C24.668 29.4 24.3994 29.6686 24.3994 30V40C24.3994 40.3314 24.668 40.6 24.9994 40.6H38.9994C39.3308 40.6 39.5994 40.3314 39.5994 40V30C39.5994 29.6686 39.3308 29.4 38.9994 29.4H36.5994Z" fill="#6C7A88"/>
      </symbol>

      <image src=${fullPathImage} xlink:href=${fullPathImage} x="0" y="0" height="100%" width="100%" ></image>
      ${polygons}
      ${polygonsInfo}
    </svg>`;
  return html;
}

function normalizepolygonPoints(points) {
  const splitedPoints = points.split(',');
  const normalized = [`${splitedPoints[0]}`];
  const lastElement = '' + splitedPoints.pop();

  for (let i = 1; i <= splitedPoints.length - 1; i += 2) {
    normalized.push(`${splitedPoints[i]} ${splitedPoints[i + 1]}`);
  }
  normalized.push(lastElement);
  return normalized.join(',');
}

function calculateCentroid(coordString) {
  const points = coordString
    .trim()
    .split(/\s+/)
    .map(pair => {
      const [x, y] = pair.split(',').map(Number);
      return { x, y };
    });

  // Замкнути полігон, якщо ще не замкнутий
  if (points[0].x !== points[points.length - 1].x || points[0].y !== points[points.length - 1].y) {
    points.push({ ...points[0] });
  }

  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const { x: x0, y: y0 } = points[i];
    const { x: x1, y: y1 } = points[i + 1];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }

  area *= 0.5;
  cx /= 6 * area;
  cy /= 6 * area;

  return { x: cx, y: cy };
}

export default createFloorSvg;
