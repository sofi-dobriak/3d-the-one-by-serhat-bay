# 3D MODEL Version 2


Меню:
  - **Загальне**:
    - [Bundle requirements](#Bundle-requirements)
    - [Що необхідно для налаштування роботи модуля на сервері](#Що-необхідно-для-налаштування-роботи-модуля-на-сервері)
    - [Налаштування збірки](#Налаштування-збірки)
    - [Вибір валюти](#Вибір-валюти)
    - [Номер телефону](#Номер-телефону)
    - [Налаштування мов](#Налаштування-мов)
    - [Налаштування обльотів](#Налаштування-обльотів)
    - [Кастомні налаштування](#Кастомні-налаштування)
    - [Стилізація модулю](#Стилізація-модулю)
    - [Логотип в шапці сайту](#Логотип-в-шапці-сайту)
    - [Кастомний селектор для кнопки меню в хедері](#Кастомний-селектор-для-кнопки-меню-в-хедері)
    - [Форма зворотнього з'вязку](#Форма-зворотнього-з'вязку)
    - [Управління відображенням елементів на різних сторінках](#Управління-відображенням-елементів-на-різних-сторінках)
    - [Триггеры для аналитики](#триггеры-для-аналитики)
    - [Сповіщення](#сповіщення)
    - [Підсвітка кварти/обльотів/інфраструктури](#підсвітка-квартиобльотівінфраструктури)
    - [Відображення цін](#відображення-цін)
    - [Виводити tooltip на елементах](#виводити-tooltip-на-елементах)
    - [Розташування на карті](#Розташування-на-карті)
    - [Аудіо асистент](#Аудіо-асистент)
  - **Налаштування сторінки "Обліт"**
    - [Підсвітка на генплані кількості квартир для кожного обльоту](#Підсвітка-на-генплані-кількості-квартир-для-кожного-обльоту)
    - [Кастомні налаштування інфобоксів](#Кастомні-налаштування-інфобоксів)
    - [Налаштування інформації про інфраструктуру](#налаштування-інформації-про-інфраструктуру)
    - [Підписи цін та кількості квартир на обльотах](#Підписи-цін-та-кількості-квартир-на-обльотах)
    - [Підписи сроку здачі на обльотах](#Підписи-сроку-здачі-на-обльотах)
    - [Підсвітка на генплані кількості квартир для кожного обльоту](#підсвітка-на-генплані-кількості-квартир-для-кожного-обльоту)
    - [Паралакс на обльотах](#Паралакс-на-обльотах)
    - [Хмари на обльотах](#Хмари-на-обльотах)
    - [Відео ключові кадри](#Відео-ключові-кадри)
  - **Налаштування сторінки "Поверх"**
    - [Налаштування плану поверху](#Налаштування-плану-поверху)
  - **Налаштування сторінки "Квартира"**
    - [Хід будівництва на сторінці квартири](#Хід-будівництва-на-сторінці-квартири)
    - [FAQ на сторінці квартири](#FAQ-на-сторінці-квартири)
    - [Фінансові умови на сторінці квартири](#Фінансові-умови-на-сторінці-квартири)
    - [Документація на сторінці квартири](#Документація-на-сторінці-квартири)
    - [Налаштування плану поверху](#Налаштування-плану-поверху)
    - [Історія зміни ціни](#Історія-зміни-ціни)
    - [Інформація про менеджера](#Інформація-про-менеджера)
    - [Посилання на соціальні мережі](#Посилання-на-соціальні-мережі)
    - [Контактна інформація](#Контактна-інформація)
    - [Список переваг у блоку контактів](#Список-переваг-у-блоку-контактів)
    - [Тип блоку контактів](#Тип-блоку-контактів)
    - [Розташування на карті](#Розташування-на-карті)
  - **Налаштування Фільтру**
    - [Отображение результатов бокового фильтра (Варианты: карточка, таблица)](#отображение-результатов-бокового-фильтра-варианты-карточка-таблица)
    - [$s3dFlybySideChooser](#s3dflybysidechooser)


## Bundle requirements

- Node.js - v18
- npm - v9.8


## Налаштування збірки

Команди для запуску

| Команда  | Опис  |
| ------------ | ------------ |
| **gulp**  | запуск збірки для локальної роботи  |
| **gulp \_styles**  |  збірка стилів у production mode  |
| **gulp \_scripts**  | Збірка скриптів у production mode  |
| **gulp scripts_styles_production**  | Збірка скриптів та стилів одночасно у production mode  |

**Після внесення змін у модуль розміщати на сервері стилі та скрипти у production mode!**

**Важливо - команду gulp prod не використовувати !**

Даний модуль розрахований для розміщення у темі WordPress. Для налаштування необхідно дізнатись назву теми WordPress(прикл. - '3d'), де буде модуль і вказати цю назву у:

- [gulpfile.js](gulpfile.js) - 2 строка - `projectName`
- [index-app.js](src/assets/s3d/scripts/index-app.js) - змінна `window.nameProject`

## Що необхідно для налаштування роботи модуля на сервері

1. На сторінці де буде розміщуватись модуль, має бути така стартова розмітка:

```html
  <div class="js-s3d__slideModule s3d__slideModule scroll">
      <div class="s3d__flyby-container" id="js-s3d__wrapper"></div>
  </div>
```

2. Перенесені всі файли які збираються локально у папці /wp-content/themes/[назва теми]/assets/s3d/`
3. Перенесена папка із підключеними шрифтами -  /wp-content/themes/[назва теми]/assets/fonts/`
4. Перенесена розмітка svg зі спрайтами на сторінку з модулем - /wp-content/themes/[назва теми]/index.html
5. Перенесені стилі та скрипти у production mode
6. Мають бути підключені такі файли:

```html
  <link rel="stylesheet" href="/wp-content/themes/[назва теми]/assets/s3d/styles/s3d.min.css">
  <link rel="stylesheet" href="/wp-content/themes/[назва теми]/assets/s3d/styles/s3d2.min.css">
  <script defer src="/wp-content/themes/[назва теми]/assets/s3d/scripts/vendors.bundle.js"></script>
  <script defer src="/wp-content/themes/[назва теми]/assets/s3d/scripts/index.bundle.js"></script>
```

7. Підключене з'єднання з девбейзом для отримання даних про квартири та обльоти

	- 7.1 /wp-admin/admin-ajax.php - **action "getFlats"**
	- 7.2 /wp-admin/admin-ajax.php - **action "getStructureSvg"**
	- 7.3 /wp-admin/admin-ajax.php - **action "getFloor"**

8. На сервері розміщенні фото обльотів відповідно до налаштувань в settings.json

8. На сервері розміщенні фото обльотів відповідно до налаштувань в settings.json
9. Імпортовані на WordPress фото квартир, галереї квартир та фото поверхів із девбейзу 


___

## Вибір валюти

#### Без перемикача валюти
  settings.json ----> currency_label
  Якщо параметр не вказаний - виводиться значок валюти з файлів перекладу (currency_label)


#### З перемикачем валюти
Також у settings.json є можливість встановити перемикач між **2-ма** валютами.

```js
  "currency_list": [
    {
      "label": "$",
      "value": "USD"
    },
    {
      "label": "₴",
      "value": "UAH"
    }
  ]
```

**Важливо!** Якщо вказаний список валют, у налаштуваннях має бути вказані початкові параметри валюти:

```js
  "currency_label": "$",
  "currency_value": "USD",
```

**У адресній строці буде вказуватись активна валюта**
**У запиті на список квартир буде передаватись код валюти**
**На бекенд стороні перевірити щоб значення валюти передавалось у обробник(template-function-3d.php->getFlats), який отримує список квартир**

Для вимкнення перемикача валют - залишити пустий массив currency_list

___


## Номер телефону


#### Важливо!

Якщо вказаний номер телефону, він виводиться в шапці сайту і на сторінці квартири

settings.json

```js
  "show_phoneNumber": "+380 50 123 45 67"
```

## Налаштування мов

settings.json

Коди мов через "/",

Випадайка мови не виводиться якщо вказано лише одну мову

```js
  "languages": "uk/en/ru/uz"
```


##  Компас
#### Параметр, который отвечает за положение компаса:
> frameWithNorthDirection 
>> Выставляется для каждого облета отдельно
#### Значение этого параметра: 
> Кадр, который смотрит на север
>> Нужно визуально определить в секвенции номер кадра, который смотри на север
#### Важно!
> Нельзя менять параметры, котрые влияют на размер компасса
___
## Изображения
+ `sd_imageUrl` - путь в облету плохого качества
+ `image_format`- формат изображений (по умолчанию jpg)
___
## Popup
При нажатии на елемент с классом ```js-s3d-flat__3d-tour``` откроется попап с айфремом (ссылка - атрибут href нажатого елемента)
___
## Демо режим
При добавлении в **html || body** теги аттрибута ```data-demo_view```  остается возможность только крутить облет (если клиент хочет вставить 3д через айфрейм).

Когда 3д добавлена на WP - для вставки в демо режиме добавить GET параметр ```demo=true```
___



##### Налаштування інформації про інфраструктуру

в settings.json ---> "pinsInfo"

```
"pinsInfo": {
  "parking" : {
    "iframe": "https://google.com", //посилання яке відкриється у айфреймі при кліку
    "type": "zone", // [ zone(підсвічує обведену зону), pin(не підсвічує обведену зону), text(Виводить як текст, полігон має мати тільки дві точки) ] // 
    "title": {
      "en": "Parking", //назва піна
      "uk": "Паркінг"
    },
    "img": "images/infrastructure/footbal-field.jpg", // Зображення в інфобоксі
    "description": {
      "en": "Parking description", //назва піна
      "uk": "Паркінг опис"
    },
    "images_for_slider": [
      "/wp-content/themes/3d/assets/images-wp/amenity-center/MH_RS_Amenity Center_View 01.jpg",
      "/wp-content/themes/3d/assets/images-wp/amenity-center/MH_RS_Amenity Center_View 02.jpg"
    ], // При натисненні на пін відкривається слайдер з вказаними фото
    "position": "top_left", //позиція іконки [center(default) || top_left || bottom_left ||  bottom_right || top_right ]  
    "filter_type": "sport" // назва категорії для фільтрації та підсвічування короткого текстового опису 
  }
}

```

**Якщо в розмітці є полігон інфраструктури, якого немає в pinsInfo - Виводиться просто зона з підписом із i18n**

Для додавання кастомної іконки для піна:
  В папку ./src/assets/s3d/images/markers додати svg, вказати у конфігурації піна filter_type - {назва svg}


#### Підсвітка на генплані кількості квартир для кожного обльоту 

###### Важливо, за замовчуванням недоступні квартири не враховуються 



[файл з кодом ](./src/assets/s3d/scripts/modules/slider/sliderView.js) - метод **showFlatCountOnBuild**

```css
  :root {
      --flyby-flats-count-bg: yellow; //колір фону 
      --flyby-flats-count-color: blue; //колір шрифта
  }
```

```javascript
// Для відображення на полігоні обльоту кількості квартир треба сформувати об'єкт з ключами, які показують обльот на якому цей будинок відображений
    
/*
  Приклад: перший та другий будинок відображаються на першому зовнішньому обльоті
  третій будинок відображається на другому внутрішньому обльоті

  тоді для правильного відображення має бути об'єкт

  {
    '1-2': 'flyby--1--outside',
    '3': 'flyby--2--inside'
  }

*/
const flybyAndBuildNamesMap = {
  // "3-2-4-5-7-8-6-9-10-11-12-1": 'flyby--1--outside',
  // "20-21-22-14-15-13-19-18-17-16-23-24-25-26": 'flyby--2--outside',
  // "34-35-36-27-28-29-30-31-32-33-40-39-38-37": 'flyby--3--outside',
};

```

## Підзаголовок фільтру 

######	В settings.json вказати (можна на різних мовах):
```
  "filter": {
    "subtitle": {
      "en": "Filter by size, floors, bedrooms, and bathrooms"
    }
  },
```

## Отображение результатов бокового фильтра (Варианты: карточка, таблица)
######	В settings.json указать:
```
  "filter": {
    "viewType": one of ['card', 'list'],
  },
```

## Параметры чекбоксов для фильтра (автоматически формирует весь список параметров, которые есть в массиве квартир)
######	В settings.json указать:
```
  "filter": {
    "viewType": one of ['card', 'list'],
    "ranges": [
        "title_i18n": "Filter.range.floor",
        "title_postfix_i18n": "Filter.range.area_unit",
        "title_prefix_i18n": false,
        "delimit_thousands": true, //розділяти тисячі пробілом
        "name": "floor", // назва параметру з об'єкта квартири по якому буде фільтрувати
        "type": "range"
    ],
    "checkboxes": [
      {
        "title": "Filter.list.rooms", //переменная перевода из i18n для общей подписи
        "type": "checkbox", // так и оставить
        "id": "typeV", // id параметра фільтрації (якщо потрібно створити дві групи за однаковим параметром фільтраціі - вказати різні id)
        "wide": true, // широкий чекбокс(поки не працює, не внесені стилі)
        "needTranslation": false, // брать ли переменную из i18n (в случае если параметр не цифра)
        "translationNS": "", //где находятся в обьекте переводов подписи для каждого ключа параметра
        "ignoreParams": { // параметри квартири, при яких не треба відображати чекбокс (опціонально)
          "параметр квартири": [значення]  // якщо це числове значення, вказувати як Number (не String !)
        },
        "innerParamsFilter": { // параметри квартири, при яких треба відображати чекбокс (опціонально)
          "build_name": ["Villas"] // якщо це числове значення, вказувати як Number (не String !)
        },
        "paramaterByWhatWillBeFilter": "rooms", //название параметра из обьекта квартир, по которому будет фильтровать
        "viewType": "checkbox_with_label" // надпис і чекбокс будуть окремо, якщо false - буде просто кнопка без чекбоксу
      },
    ]
  },
```
___
## Галерея на плане квартиры
###### В приходящих параметрах квартиры указать 
    gallery: [Массив ссылок на изображения]
___
## Слайдер
###### Появление при нажатии на полигон в облете
##### Указать полигону:
    data-type="slider_popup" data-id="[ID]"
##### В settings.json: 
	{
		"sliderPopup": {
			"[ID]": {
				"[подпись к фото]": "[ссылка на фото]"
			}
		}
	}
___


___
## Триггеры для аналитики
|  **Название** |  **Триггер**   |
| ------------ | ------------ |
| Переход на страницу апартамента | visit-appartment-page | 
| Нажатия кнопки "Связаться с менеджером" | callback-click | 
| Открытие фильтра  |  open-filter | 
| Ошибка модуля | module-error | 
| Переключение "день/ночь" | day-night-view |  
| переход на облет | visit-flyby-page |  
| Переход на страницу планировки | visit-plannings-page |  
| Переход на страницу этажи | visit-floor-page | 
| Переключение в фильтре "карточка/список" | filter-view-type-change |  
| Переход на квартиру с облета |  | 
| Переход на квартиру с страницы "Планировки" |  |  
| Отправка формы обратной связи | succesFormSend |  
| Нажатие кнопки "Обучение"  |  faq-button-click |  
| Переход на страницу "Избранное" | visit-favourites-page |  
| Добавление квартиры в избранное | add-object-to-favourites | 
| Удаление из избранного | delete-object-from-favourites |  
| По фильтрам клиента не найдено объектов | filter-flats-not-found | 
| Открытие ВР  тура на странице квартиры  |  vr-popup-open | 
| Открытие ссылки инфраструктуры на облете | click-infrastructure-pin |  
| Переключение вида 2д/3д на странице планировки |  |  
| Нажатие кнопки ПДФ  |  pdf-file-download | 
| Переход на страницу "этаж" из квартиры | visit-floor-page-from-flat-page |  
| Переход на страницу "этаж" из облета |  |  
| Переход на любую страницу 3д  |  visit-page | 
| загружен облет (в параметрах передается время загрузки)  |  flybyLoading | 
___


## Данные для мониторинга времени загрузки облета (flybyLoading)

```
  {
    timePlain: /*Время загрузки*/,
    url: /*Адрес*/,
    flybyId: /*название облета*/,
    flybySize: /*Размер облета*/,
    deviceType: /*Тип устройства ['desktop', 'tablet', 'mobile']*/,
    date: /* Дата загрузки */,
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    browser: /* Информация о браузере */,
  }
```


## Пример кода для перехвата событий
```js
	window.addEventListener(/*триггер*/, (event) => {
		const eventDetails = event.detail; // Данные этого триггера (объект)
	})
```


## Features

#### Сповіщення 

Бібліотека - [Toastify](https://www.npmjs.com/package/toastify-js)


# Managers 

[Link](./src/assets/s3d/scripts/managers)


# $s3dFlybySideChooser

Створює випадайку для переключення між внутрішнім/зовнішнім обльотами

GitHub Copilot: [component location](./src/assets/s3d/scripts/modules/templates/controller/$s3dFlybySideChooser.js)

Для відключення прописати у src/static/settings.json 

```js

  "hide_s3dFlybySideChooser": true

```

# Підсвітка кварти/обльотів/інфраструктури

app.model.js - handler ---> **handleHighlightFlybySvgElements**

Для управління підсвіткою в інших частинах модуля є стейт **highlightFlybySvgElements$**

[View](./src/assets/s3d/scripts/modules/templates/controller/$highlightSvgElements.js)

# Управління відображенням елементів на різних сторінках


hideElementsOnPages --> [View](./src/assets/s3d/scripts/modules/templates/controller/$hideElementsOnPages.js)

hideElementsAttribute([]strings) - Додати цю функцію до елементів, які потрібно приховати на вказаних сторінках

Приклад:

```js
import { hideElementsAttribute } from "../../../features/hideElementsOnPages";

function button(i18n) {
	return `
		<button ${hideElementsAttribute(['plannings', 'flyby_1_outside'])}>
			i18n.t('button')
    </button>
		`;
}
/*  Приховує цю кнопку на сторінці планувань та 1му зовнішньому обльоті */
```

showElementsOnPage --> [View](./src/assets/s3d/scripts/modules/templates/controller/$showElementsOnPage.js)

showElementsOnPageAttribute([]strings)- Додати цю функцію до елементів, які потрібно показувати тільки на вказаних сторінках

```js
import { showElementsOnPageAttribute } from "../../../features/showElementsOnPage";

function button(i18n) {
	return `
		<button ${showElementsOnPageAttribute(['plannings', 'flyby_1_outside'])}>
			i18n.t('button')
    </button>
		`;
}
/*  Показує цю кнопку тільки на сторінці планувань та 1му зовнішньому обльоті */
```


# Кастомні налаштування

  Можна зберігати кастомні налаштування на сервері без їх змін у репозиторії

  Для цього скопіювати ./src/static/settings.json в /wp-content/themes/[назва теми]/assets/s3d/settings.json


# Список властивостей для одної квартири, які мають приходити з бека:

|  Ключ | Приклад  | Опис |
| :------------ | :------------ | :------------ |
| currency_label | USD |  |
| id | 26219 |  |
| **gallery[]** |  | масив з адресами зображень |
| gallery[0] | Full URL |  |
| build | 2 | номер будинку |
| section | 8 | номер секції |
| sec_id | 8 | айді секції |
| floor | 2 | поверх |
| rooms | 1 | кількість кімнат |
| level | 4 | кількість рівнів |
| type | 1В | тип квартири |
| _type | 1В | тип квартири |
| number | 26637 | номер квартири |
| sale | 1 | статус квартири |
| compas | 50 | градус нахилу компасу (0-360) |
| action_price | 0 | акційна ціна |
| visible | 1 | видимість квартири |
| area | 43.99 | загальна площа |
| life_room | 16.81 | житлова площа |
| price | 350 000 | ціна |
| _price | 350000 |  ціна в числовому форматі |
| type_object | 1 | тип об'єкту(квартира, паркінг, комерція) |
| price_m2 |  |  ціна за м2 |
| _price_m2 |  | ціна за м2 в числовому форматі |
| img_big | Full URL | Фото планування |
| img_small | Relative URL | Зменшене фото планування |
| **flat_levels_photo**{} |  | Фото рівнів квартири |
| **1**{} |  | номер рівня |
| without | Full URL | фото рівня 2d |
| with | Full URL | фото рівня 3d |
| **properties**{} |  | Список приміщень квартири |
| **3**{} |  |  |
| id | 82 |  |
| property_id | 3 |  |
| property_flat | 14.5 | площа приміщення |
| property_level | 4 | рівень на якому знаходиться приміщення |
| properties_order | 0 |  |
| property_name | Bedroom 2 | назва приміщення |
| property_type | 1 |  |
| properties_field_order | 0 |  |
| **images**{} |  |  |
| **without**{} |  |  |
| 2d | /img/projects/36/2/section_7-9_kv1V.png |  |
| 3d_tour |  | посилання на 3d тур |
| sorts | 1012,546,1013,502,976,303,976 | координати svg розмітки |
| price_history | Масив об'єктів | Массив з історією цін |
| video | String | Посилання на промо відео |
| view_from_window_link | String | ДЛЯ КВАРТИР ТІЛЬКИ - Посилання на види з вікон |
| promo_price | Number | Акційна ціна за квартиру |
| promo_price_m2 | Number | Акційна ціна m2 за квартиру |
| discount | Number | Знижка у % |
| bathrooms | Number | характеристика для вілл |
| bedrooms | Number | характеристика для вілл |
| garages | Number | характеристика для вілл |
| pool | Number | характеристика для вілл |
| project_deadline | String | Строк сдачі для відображення на картці/інфобоксі |



**price_history example:**

```json
[
    {
      "date": "2023-12-29 15:26:43",
      "currency": {
        "label": "$",
        "id": "USD",
        "symb": "$",
        "name": "Доллар США",
        "id_form": 4
      },
      "price_uah": 5524114.54,
      "price_usd": 146610,
      "price_m2_uah": 169555.39,
      "price_m2_usd": 4500
    },
    {
      "date": "2023-06-29 15:26:43",
      "currency": {
        "label": "$",
        "id": "USD",
        "symb": "$",
        "name": "Доллар США",
        "id_form": 4
      },
      "price_uah": 2524114.54,
      "price_usd": 146610,
      "price_m2_uah": 169555.39,
      "price_m2_usd": 4500
    },
    {
      "date": "2022-09-23 16:18:30",
      "currency": {
        "label": "грн",
        "id": "UAH",
        "symb": "₴",
        "name": "Гривна",
        "id_form": 0
      },
      "price_uah": 360114,
      "price_usd": 9557.43,
      "price_m2_uah": 11053.22,
      "price_m2_usd": 293.35
    }
  ]
```

# Форма зворотнього з'вязку

У settings.json:

```javascript
"form": {
	/*Приорітетні країни для вибору у полі "Телефон"*/
    "prefered_countries": ["ua", "us"]
  }
```

У формі зворотнього зв'язку відправляються додаткові дані:

```json
  {
    "url": "url сторінки",
    "page": "Тип сторінки",
    "id": "Тільки на сторінці приміщення - Ідентифікатор",
    "build": "Тільки на сторінці поверху - Номер будинку",
    "floor": "Тільки на сторінці поверху - Номер поверху",
    "section": "Тільки на сторінці поверху - Номер секції"
  }
```


# Підписи цін та кількості квартир на обльотах

settings.json: 

ключ - **номер обльоту**, значення - **масив з номерами будинків квартир**

Приклад: 
```javascript
  "assotiated_flat_builds_with_flybys": {
    "1-outside": ["1","2"],
    "2-inside": ["3", "4", "5"]
  }
```
При таких налаштування на підписі 1-го зовнішнього обльоту будуть світитися квартири з будинків 1, 2.
На підписі 2-го внутрішнього обльоту будуть світитися квартири з будинків 3,4,5


# Підписи сроку здачі на обльотах

settings.json: 

ключ - **номер обльоту**, значення - **текст (без перекладу!)**

Приклад: 
```javascript
  "flyby_finish_dates": {
    "1-outside": "IV 2025",
    "2-outside": "III 2026",
    "3-inside": "[[2]]" 
    /*
    Якщо вказати такий формат, тоді значення буде братися з об'єкту квартири по вказаному номеру будинку з ключем project_deadline, якщо з девбейза не приходить дане значенння у квартирі, краще вказати текстове значення
    */
  }
```


# Розташування на карті

settings.json ----> project_google_map_location
Посилання на айфрейм гугл карти

Для формування посилання на необхідній локації треба натиснути:

1. Поділитися
2. Вставити карту
3. У Сформованому коді айфрема скопіювати атрибут src

# Налаштування плану поверху

Значення із характеристики квартири яке буде виводитись

settings.json
```js
  {
    "floor": {
      "polygonValueToRender1": "type" // or false
      "polygonValueToRender2": "area" // or false
    }
  }
```
При формуванні плану поверху буде виводитись характеристики квартири по ключу **flat['type']** та **flat['area']**
Обов'язково перевірити чи приходить даний параметр з сервера


# Документація на сторінці квартири

Для відключення запиту на сервер, в settings.json прописати:

```js
  "hideDocumentation": true
```

/wp-admin/admin-ajax.php - action "getDocumentation"

Приклад необхідної відповіді: 

```json
[
  {
    "date": "2024-07-29 15:26:43",
    "img": "/wp-content/themes/3d/assets/s3d/images/examples/doc-example.jpg",
    "url": "/wp-content/themes/3d/assets/s3d/images/examples/doc-example.jpg",
    "title": "Правила та умови закупівлі",
    "description": "Цей документ містить інформацію про порядок купівлі квартири, необхідні документи, розмір початкового внеску, умови оплати та інші важливі деталі, пов'язані з придбанням нерухомості."
  },
]
```


# Фінансові умови на сторінці квартири

Для відключення запиту на сервер, в settings.json прописати:

```js
  "hideFinancialTerms": true
```

/wp-admin/admin-ajax.php - action "getFinancialTerms"

Приклад необхідної відповіді: 

```json
[
  {
    "title": "Installment plan",
    "description": "When purchasing real estate on installment terms, you make an initial payment of at least 30% of the total cost, and the remainder is paid in installments until the end of the term. Details about installment payments and calculating the size of the initial payment can be obtained from our managers.",
    "iconsUrls": [
      "https://devbase.pro/wp-content/themes/devbase/assets/images/logo.svg",
      "http://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg"
    ]
  },
]
```

# Хід будівництва на сторінці квартири

Для відключення запиту на сервер, в settings.json прописати:

```js
  "hideConstructionProgress": true
```

/wp-admin/admin-ajax.php - action "getConstructionProgress"

Приклад необхідної відповіді: 

```json
  {
    "date": "2024-07-29 15:26:43",
    "text": "As of today, the first two buildings of the apart-hotel are already in operation, welcoming guests and generating passive income for the owners. Construction works for the third building are currently underway.  The monolithic frame has already been poured to 80 percent. External walls have been completed to 50%. Internal walls and partitions have been installed to 15%. Staircases and platforms have been poured up to the level of the eighth floor. Installation of PVC windows has begun in the building. Thanks to coordinated and organized work, construction is progressing rapidly, significantly ahead of the scheduled construction works.",
    "video": "https://www.youtube.com/watch?v=9bZkp7q19f0",
    "gallery": [
      "https://smarto.agency/wp-content/themes/smartoagency/assets/images/jpg/ozon-preview.jpg",
      "https://smarto.agency/wp-content/themes/smartoagency/assets/images/jpg/ozon-preview.jpg",
      "https://smarto.agency/wp-content/themes/smartoagency/assets/images/jpg/ozon-preview.jpg"
    ]
  }
```


# FAQ на сторінці квартири

settings.json ---> flat Object: 

```js
"faq_questions": [
  {
    "ignore": {
      "build": [1]
    },
    "question": {
      "en": "What is the price of the flat?", // якщо мова не вказана, виводиться пуста строка
      "uk": "Яка ціна квартири?"
    },
    "answer": {
      "en": "The price of the flat is {{currency_label}} [[price]]",
      "uk": "Ціна квартири - {{currency_label}} [[price]]"
    }
  }
]
```

До кожного питання можна додати масив з властивостями квартири, при яких питання не буде відображатись

```js
  "ignore": {
    "build_name": ["Villas"],
    "floor": [1,2,3]
  }
```


| спеціальна строка  | опис |
| ------------ | ------------ |
| {{currency_label}} | назва змінної із i18n  |
| [[price]]  |  значення змінної з об`єкта квартири |







# Кастомні налаштування інфобоксів

**settings.json:**

```json

  "infoBoxes": {
    "general_flyby_button_titles": {
      "faq": "Можливі підписи для кнопок у інфобоксі обльоту : queue ,villa, house",
      "1_outside": "queue",
      "3_outside": "villa",
      "1_inside": "house"
    }
  }

```


# Логотип в шапці сайту

**settings.json:**

```json

  "header": {
    "logo": "/wp-content/themes/3d/assets/s3d/images/icon/smarto.svg"
  }

```
# Кастомний селектор для кнопки меню в хедері

**settings.json:**

```json

  "header": {
    "menu_selector": "data-custom-menu-selector" // для використання дефолтного меню вказати data-open-menu, якщо не треба виводити кнопку меню - видалити або виставити false
  }

```

# Стилізація модулю

  В цьому файлі можна визначити глобальні змінні для модулю.

  [Theme vars](src/assets/s3d/styles/globals/theme_vars.scss)

  Також можна підключити окремий файл зі стилями для модулю за допомогою WordPress, скопіювати з файлу [Theme vars](src/assets/s3d/styles/globals/theme_vars.scss) і перебити дефолтні змінні.

  Приклад:

  custom_module_wp_styles.css

  ```scss
    :root {
      --border-space-1: 0px; //в стандартній темі була 4px
      --color-brand-800: blue; //в стандартній темі був #005450
    }
  ```



## Паралакс на обльотах

  Для включення паралаксу на обльотах потрібно в settings.json вказати

  ```js
  "enableParalax": true
  ```

  Для відключення паралаксу на обльотах потрібно в settings.json вказати

  ```js
  "enableParalax": false
  ```
## Хмари на обльотах

  Для включення хмар на обльотах потрібно в settings.json вказати

  ```js
  "enableClouds": true
  ```

  Для відключення хмар на обльотах потрібно в settings.json вказати

  ```js
  "enableClouds": false
  ```

## Відображення цін

  ```js
  "show_prices": true
  ```

  Важливо! Це пріоритетне налаштування, якщо воно вказано, то відображення цін буде відповідно до нього, незалежно від інших налаштувань

## Виводити tooltip на елементах
  Приклад

  ```js
    function $button() {
      return `<button data-tooltip="Tooltip text">
        click me
      </button>`
    }
  ```

## Відео ключові кадри
  Замість зображень можна виставляти відео для ключових кадрів.
  Для відображення потрібно вказати в налаштуваннях обльоту в settings.json

  ```js
    "video_keyframes": {
      "номер ключового кадру": "посилання на відео",
      "9": "https://o2.smarto.com.ua/dmcc-test-video.mp4", // Абсолютне посилання
      "номер ключового кадру": "/assets/s3d/video_sample.mp4", // <------ АБО Відносне посилання починати будувати від теми Вордпресу (як в прикладі)
    }
  ```
  
## Налаштування обльотів

  Для показу обльотів на 3д модулі необхідно виставити їх кількість та параметри у settings.json
  Обльоти можуть бути двох видів: 
  - Генплан - налаштовується окремим об'єктом
  - Flyby_[номер обльоту]_[тип обльоту] - налаштовується окремим об'єктом

Приклад налаштування генплану:
```javascript
  "genplan": "об'єкт з параметрами"
```


Приклад схеми налаштування обльотів:

```javascript
  "flyby": {
    "номер_обльоту": {
      "тип_обльоту(outside || inside)": {
        "об'єкт з параметрами": "значення"
      }
    }
  }
```

Приклад: 

```javascript
{
  "flyby": {
    "1": {
      "outside": {
        "id": "flyby_1_outside", // id обльоту
        "generalWrapId": "#js-s3d__wrapper", // не змінювати це значення
        "imageUrl": "images/flyby/ALPHA/alpha_day/", // шлях до зображень, шлях будується від папки /wp-content/themes/[назвати теми вордпресу]/assets/s3d/
        "sd_imageUrl": "images/flyby/ALPHA/alpha_day/", // не обов'язковий параметр, шлях до зображень для планшетної та мобільної версії
        "imageUrlDark": "images/flyby/masterplanDark/", // шлях до зображень для нічного режиму (не обов'язковий параметр), видалити якщо немає нічного режиму
        "defaultTheme": "dark", // тема за замовчуванням "light || dark", 
        "enableParalax": true, // включення паралаксу
        "enableClouds": true, // включення руху хмар
        "verticalAlign": "center", // вертикальне вирівнювання ключового кадру "top || center || bottom"
        "horizontalAlign": "center", // горизонтальне вирівнювання ключового кадру "left || center || right"
        "image_format": "jpg", // формат зображень обльоту
        "class": "js-s3d__wrapper", // не змінювати це значення
        "numberSlide": { // номера слайдів для відображення на обльоті
          "min": 0, // мінімальний номер слайду
          "max": 119 // максимальний номер слайду
        },
        "video_keyframes": { // відео ключові кадри, необов'язковий параметр
          "9": "https://o2.smarto.com.ua/dmcc-test-video.mp4", // номер ключового кадру та посилання на відео
          "50": "https://o2.smarto.com.ua/dmcc-test-video.mp4",
          "69": "https://o2.smarto.com.ua/dmcc-test-video.mp4",
          "108": "https://o2.smarto.com.ua/dmcc-test-video.mp4"
        },
        "controlPoint": [ // ключові кадри на обльоті
          9,
          50,
          69,
          108
        ],
        "activeSlide": 9, // Початковий ключовий кадр
        "rotateSpeedDefault": 20, // Швидкість обертання обльоту
        "rotateSpeed": [ 
          {
            "min": 79,
            "max": 100,
            "ms": 40
          }
        ],
        "SLIDER_MOBILE_FINGER_SWIPE": true // перелистування пальцем на мобільних/тач пристроях
        "invert_arrows": false, // обернене обертання обльоту при натисненні на стрілки 
        "DISABLE_MOBILE_ZOOM": true // відключення зуму контейнера обльота на мобільних пристроях
        "slider_scale_container_logo": '/wp-content/themes/3d/assets/s3d/images/icon/smarto.svg', // шлях до логотипу для відзумленого обльоту на мобілці, якщо не вказано - використовується заголовок "Welcome to Spinhouse"
        "show_flat_polygons_tooltip": true, // Відображення підказок на полігонах квартир
        "show_flat_polygons_tooltip_key": "area", // Значення із характеристики квартири яке буде відображатись у підказці
      }
    }
  }
}
```


## Перегортування ключових кадрів через свайп пальцем на тач/мобільних пристроях

settings.json

```javascript
  "flyby": {
    "1": {
      "outside": {
        "swipeToChangeKeyframe": true // Вмикає можливість перегортування ключових кадрів свайпом пальцем
      }
    }
  }
```

## Історія зміни ціни
На сторінці квартири є можливість виводити історію зміни ціни. Для цього необхідно в налаштуваннях квартири вказати параметр **price_history**.
Приклад даних які мають бути в об'єкті квартири:
```json
  "price_history": [
      {
        "date": "2023-12-29 15:26:43",
        "currency": {
          "label": "$",
          "id": "USD",
          "symb": "$",
          "name": "Доллар США",
          "id_form": 4
        },
        "price_uah": 5524114.54,
        "price_usd": 146610,
        "price_m2_uah": 169555.39,
        "price_m2_usd": 4500
      },
  ]
```


Важливо!
За замовчуванням цей модуль відключений через великий розмір.
Для включення необхідно:

- у flatModel.js додати імпорт модуля

```javascript
  import priceHistoryGraphic from '../../../../s3d2/scripts/features/flat/priceHistoryGraphic';
```

- У методі priceHistoryHandler у flatModel.js розкоментувати строку:

```javascript
  this.priceHistoryInstance = priceHistoryGraphic(this.getFlat(this.activeFlat).price_history.reverse(), this.i18n, 'chart');
```


## Інформація про менеджера

**settings.json**

```js
  "manager_info": {
    "tel": "+380501234567",
    "name": { //дефолтні значення виводяться EN
      "en": "Alex Smith",
      "uk": "Олексій"
    },
    "img": "/wp-content/themes/3d/assets/s3d/images/manager.png",
    "position": {//дефолтні значення виводяться EN
      "en": "Sales manager",
      "uk": "Менеджер з продажів"
    },
    "socials": {
      "telegram": "https://web.telegram.org", // якщо значення пусте, то посилання не виводиться
      "viber": "https://viber.com",
      "whatsapp": "https://whatsapp.com",
      "youtube": "https://youtube.com",
      "twitter": "https://x.com",
      "tiktok": "#",
      "facebook": "https://facebook.com"
    }
  }
```

## Посилання на соціальні мережі
**settings.json**


Нижче перелік соц. мереж, для яких готові іконки
```js 
  "social_media_links": {
    "telegram": "https://web.telegram.org", // якщо значення пусте, то посилання не виводиться
    "viber": "https://viber.com",
    "whatsapp": "https://whatsapp.com",
    "youtube": "https://youtube.com",
    "twitter": "https://x.com",
    "tiktok": "#",
    "facebook": "https://facebook.com"
  },
```


## Контактна інформація
settings.json
```js
  "g_contacts": {
    "email": "twins.vn.ua@gmail.com",
    // контакти будівництва, якщо не потрібні- просто видалити весь об'єкт
    "construction_department": {
      "text": { //дефолтні значення виводяться EN
        "en": "Vinnytsia, Keletska Street 123",
        "uk": "Вінниця, вул. Келецька 321"
      },
      "google_maps_link": "https://maps.app.goo.gl/LSahB8F6ZwuLde8j6"
    },
    // контакти Відділу продажів, якщо не потрібні- просто видалити весь об'єкт
    "sales_department": {
      "text": {
        //дефолтні значення виводяться EN
        "en": "Vinnytsia, Magistratska Street, 91",
        "uk": "м.Вінниця, Магістрацька вулиця, 82"
      },
      "google_maps_link": "https://maps.app.goo.gl/Rfh57EcHnodtAQ3F8"
    }
  }
```

## Список переваг у блоку контактів

settings.json

```js
  "g_contact_advantaged_list": [
    { 
      "en": "Advantage example 1", //дефолтні значення виводяться EN
      "uk": "Приклад переваги 1"
    },
    { 
      "en": "Advantage example 2", //дефолтні значення виводяться EN
      "uk": "Приклад переваги 2"
    },
  ]
```

## Тип блоку контактів

settings.json

```js
  "contact_block_variant": "1" // можливі варіанти: 1, 2, 3
```


### Аудіо асистент

У спінхаусі є можливість налаштувати голосовий супровід на обраних сторінках

##### 1) Налаштування
Для цього необхідно:

До settings.json додати:

```json
    {
    	"audioAssistant": {
        	"needToInitialize": true,
        	"files": {
          		"genplan_1": "paht_to_file.mp3",
				"flyby_1_inside_66": "paht_to_file.mp3",
          		"flat": "paht_to_file2.mp3"
        	}
      }
    }
```

**needToInitialize** - вкл./викл
**files** - сторінки і файли до них

Приклад:

Якщо потрібно додати аудіо до генплану, вказати ключ у таком форматі:

    genplan_[номер кадру]
Для обльотів  прописувати розширений ключ

    flyby_[номер обльоту]_[сторона обльоту]_[номер кадру]
Для інших сторінок просто вказати назву

    plannings


##### 2) Підключення візуальних елементів:
Елементи візуальної частини можна використовувати на ваш розсуд.
В асистенті наявні декілька селекторів, які можна додати до інтерфейсу для  управління

Перелік атрибутів:

- **data-s3d-audio-guide-switch** - вкл./виключення звуку, при повторному включені буде відтворюватись аудіо сторінки, де знаходиться користувач. Додає/видаляє у елемента клас **active**
- **data-s3d-audio-guide-repeat** - повтор вже програного аудіозапису на сторінці
- **data-s3d-audio-guide-play-marker**  - до цього елементу буде додаватись клас **playing** під час відтворення аудіо (буде корисним для анімацій і WOW ефектів)
- **data-s3d-audio-guide-state-marker** - до елементу з цим атрибутом буде додаватись клас s3d_audioAssistantState-active коли асистент активний, і клас s3d_audioAssistantState-inactive коли асистент неактивний
- **data-s3d-audio-guide-disable** - вимикає асистент та приховує елемент з цим атрибутом
- **data-s3d-audio-guide-enable** - вмикає асистент та показує елемент з цим атрибутом

До всіх вище описаних елементів присвоюється data-s3d_audio-guide-state="on || off" - для відстеження стану асистента

##### 3) Склад асистента

- Ініціалізується асистент у app.model.js
- Файл з логікою -[AudioAssistant.js](./src/assets/s3d2/scripts/modules/AudioAssistant/AudioAssistant.js) 
- Розмітка -[index-app.js](./src/assets/s3d/scripts/index-app.js) 
- Стилі - [s3d-controller.scss:577](./src/assets/s3d/styles/pages/s3d-controller.scss)



## Тур 360 покращений на сторінці квартири

Для підключення додати до об'єкту квартири властивість:

```json
  "3d_tour_v2": "https://apartment-tours.smartorange.com.ua/en/wp-json/wp/v2/get-tour?id=5706",
```

Важливо: цю версію підтримують тільки тури створені у розділі https://apartment-tours.smartorange.com.ua/wp-admin/edit.php?post_type=tour

Ініціалізація відбувається у flatModel.js

### `SmartoToursV3` --- Опис класу та параметрів конфігурації

``` js
new SmartoToursV3({
  $container: document.querySelector(SMARTO_TOURS_CONTAINER_SELECTOR),
  data: JSON.parse(data),
  scrollableElement: document.querySelector('.s3d-flat-new.s3d-villa'),
  ...additionalConfigs,
  i18n: this.i18n,
  customFloorTitles: {
    '1': 'Floor 1',
    '2': 'Floor 2',
    '3': 'Garage',
    '4': 'Landscape'
  },
  customNavFloorsOrders: ['3', '4', '1', '2'],
  defaultSceneIndex: defaultSceneIndex
});
smartoTours.init();
```

### ⚙️ Параметри конфігурації

#### **`$container`**

-   Тип: `HTMLElement`
-   Контейнер, у який буде рендеритися тур.

#### **`data`**

-   Тип: `Object`
-   Дані турів і сцен.

#### **`scrollableElement`**

-   Тип: `HTMLElement`
-   Елемент, що прокручується разом із туром.

#### **`...additionalConfigs`**

-   Додаткові користувацькі параметри.

#### **`i18n`**

-   Модуль локалізації.

#### **`customFloorTitles`**

-   Користувацькі назви поверхів.

#### **`customNavFloorsOrders`**

-   Порядок відображення поверхів.

#### **`defaultSceneIndex`**

-   Індекс стартової сцени.

## ▶️ Ініціалізація

``` js
const smartoTours = new SmartoTours(config);
smartoTours.init();
```