import CheckboxWithLabel from '../../../../../s3d2/scripts/templates/components/filter/CheckboxWithLabel';

export default function $floorFilter(i18n, roomsCountList = new Set()) {
  return `

   <div class="s3d-floor__tabs-wrapper">
    <div class="s3d-floor__info-container__title text-style-3-d-fonts-1920-body-regular text-gray-700">${i18n.t(
      'Floor.number_rooms',
    )}</div>
     <!--<div class="s3d-floor__tabs-title-mob">${i18n.t('Floor.filter.title-mob')}</div>-->
      ${CheckboxWithLabel({
        name: 'rooms-all',
        value: 'all',
        title: i18n.t('Floor.filter.all'),
        checked: true,
        attributes: ' style="display: none" ',
      })}
      ${
        roomsCountList.has(1) || roomsCountList.size == 0
          ? CheckboxWithLabel({
              name: 'rooms-1',
              value: 1,
              title: i18n.t('Floor.filter.1'),
            })
          : ''
      }
      ${
        roomsCountList.has(2) || roomsCountList.size == 0
          ? CheckboxWithLabel({
              name: 'rooms-2',
              value: 2,
              title: i18n.t('Floor.filter.2'),
            })
          : ''
      }
      ${
        roomsCountList.has(3) || roomsCountList.size == 0
          ? CheckboxWithLabel({
              name: 'rooms-3',
              value: 3,
              title: i18n.t('Floor.filter.3'),
            })
          : ''
      }
      ${
        roomsCountList.has(4) || roomsCountList.size == 0
          ? CheckboxWithLabel({
              name: 'rooms-4',
              value: 4,
              title: i18n.t('Floor.filter.4'),
            })
          : ''
      }
      ${
        roomsCountList.has(5) || roomsCountList.size == 0
          ? CheckboxWithLabel({
              name: 'rooms-5',
              value: 5,
              title: i18n.t('Floor.filter.5'),
            })
          : ''
      }

    </div>
  `;
}
