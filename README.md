<h1 align="center">--Start-webdev-startpack--</h2>
<br>
<p align="center">

<img src="https://img.shields.io/badge/made%20by-binkovskyi94-orange.svg" > 

<img src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" >

<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat">
</p>

<img src="https://file.modx.pro/files/2/f/8/2f8c3614a38abb4c96eb8736e5c84401.jpg" />

<h2 align="center">Описание</h2>

- Сборка Gulp 4 + webpack с плагинами для Frontend разработки

<h2 align="center">Требования к окружению</h2>
Необходимо иметь следующие установленные инструменты:<br>


**Cоздания окружения**
-	node.js
- npm
-	git
-	gulp

<h2 align="center">Установка</h2>

### 1. Клонирование

Скачайте файлы с github или клонируйте его c помощью команды

```bash
https://github.com/binkovskyi94/Start-webdev-startpack.git
```

### 2. Установка пакетов проекта
Для установки пакета плагинов проекта, необходимо в командной строке ввести команды:
```bash
npm install
```

Для установки дополнительных плагинов, нужно выполнить команду:

- Установка плагина с зависимостью ``` --save-dev ``` попадает в директорию ``` "devDependencies" ``` файла ``` "package.json" ```
```bash
npm install название_пакета --save-dev
```

- Установка плагина
```bash
npm install название_пакета --save-prod
```

<h2 align="center">Как использовать окружение?</h2> 

**Обычный режим**: 
- `gulp`                - запуск всех пакетов и live-server         

**Директория DEST**:
- `gulp build`          - для сборки итоговых файлов папки `app` 
- `gulp css:build`      - для сборки итоговых CSS файлов
- `gulp clean:build`    - для очистки каталога `app`
- `gulp html:build`     - для сборки итоговых HTML файлов
- `gulp js:build`       - для сборки итоговых JS файлов
- `gulp fonts:build`    - для сборки итоговых шрифтов
- `gulp image:build`    - для сборки итоговых изображения

<h2 align="center">Список используемых инструментов</h2> 

Окружение, предназначенное для разработки фронтенд проекта, построено на базе следующих инструментов:

- **Node.js** (область среды, в которой будет выполняться окружение);
- **npm** (менеджер пакетов, входящий в область видимости Node.js; будет использоваться для загрузки Gulp, плагинов и фронтенд пакетов);
- **jQuery, Normalize** (пакеты, которые будут использоваться для сборки css и js частей сайта);
- **Gulp и его плагины** (будут использоваться для сборки проекта и выполнения других веб задач).

<h2 align="center">Структура файлов Gulp проекта</h2> 

### Корневая директория
В корне проекта расположены папки:

- `src` *(для исходных файлов)* внутри расположены исходные папки:
    - `components` *(для разделения html структуры `index.html` на модули зависимых файлов)*;
    - `fonts` *(для шрифтов)*;
    - `img` *(для исходных изображений)*;
    - `img/svg` *(для создания svg-sprite. Svg которые находятся вне папки `svg` не будут импортированы в svg-sprite)*;
    - `js` *(для js-файлов)*;
    - `js/functions` *(для js-функций)*;
    - `js/vendor` *(для прочих js-компонентов)*;
    - `resources` *(для сторонних файлов и медиа)*;
    - `scss` *(для разделения css структуры `style.css` на модули зависимых файлов )*;
    - файл `index.html`.
- `app` *(для итоговых файлов; будет создана после первой сборки)*;

> - Файлы: `gulpfile.js`, `package.json`, `package-lock.json`, `.editorconfig`, `.stylelintrc`, `.gitignore`, `README.md` 
> - Файл `gulpfile.js` - содержит задачи для сборщика проекта Gulp. Файл `.stylelintrc` - содержит установленные параметры по конфигурации и распределению разметки стилей (файл незначительный! Без должного понимания работы `stylelint` лучше не использовать! Установленные условия, внутри файла можно менять под собственные условия! Для работы с `stylelint` нужно установить: расширения `stylelint для стилей` в `VSCode` + `npm` пакеты: `stylelint-declaration-block-no-ignored-properties`, `stylelint-scss`, `stylelint-order`). 
> - Файл `.editorconfig` - содержит общие установленные параметры.
<hr>
