<h1 align="center">--Start-webdev-startpack--</h2>
<br>
<div align="center">

<a href="https://github.com/binkovskyi94"><img src="https://img.shields.io/badge/made%20by-binkovskyi94-orange.svg?style=plastic&logo=github"></a> <a href="https://github.com/binkovskyi94/Start-webdev-startpack"><img src="https://img.shields.io/badge/-downloads-green.svg?style=plastic&logo="></a>
</div> 

<div align="center">

![HTML](https://img.shields.io/badge/-HTML-orange?style=plastic&logo=HTML5) ![CSS](https://img.shields.io/badge/-CSS3-blue?style=plastic&logo=CSS3) ![JavaScript](https://img.shields.io/badge/-JavaScript-yellow?style=plastic&logo=JavaScript) ![Sass](https://img.shields.io/badge/-Sass-pink?style=plastic&logo=Sass) ![Bootstrap](https://img.shields.io/badge/-Bootstrap-7952B3?style=plastic&logo=Bootstrap) ![Jquery](https://img.shields.io/badge/-Jquery-0769AD?style=plastic&logo=Jquery) ![Webpack](https://img.shields.io/badge/-Webpack-8DD6F9?style=plastic&logo=Webpack) ![BABEL](https://img.shields.io/badge/-BABEL-F9DC3E?style=plastic&logo=BABEL) ![NPM](https://img.shields.io/badge/-NPM-CB3837?style=plastic&logo=NPM) ![Gulp](https://img.shields.io/badge/-Gulp-CF4647?style=plastic&logo=Gulp) ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=plastic&logo=Node.js)
</div>

<img src="https://file.modx.pro/files/a/1/c/a1c54076c96029a70c7c3979a64c6a42.png" />

<h2 align="center">Описание</h2>

- Сборка Gulp 4 + webpack с плагинами для Frontend разработки

![Anurag's github stats](https://github-readme-stats.vercel.app/api?username=binkovskyi94&show_icons=true&theme=tokyonight)

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

<h2 align="center">Список используемых инструментов</h2> 

Окружение, предназначенное для разработки фронтенд проекта, построено на базе следующих инструментов:

- **Node.js** (область среды, в которой будет выполняться окружение);
- **npm** (менеджер пакетов, входящий в область видимости Node.js; будет использоваться для загрузки Gulp, плагинов и фронтенд пакетов);
- **jQuery, Normalize, Bootstrap, Swiper** (пакеты, которые будут использоваться для сборки css и js частей сайта);
- **Gulp и его плагины** (будут использоваться для сборки проекта и выполнения других веб задач).

<h2 align="center">Структура файлов Gulp проекта</h2> 

### Корневая директория
В корне проекта расположены папки:

- `#src` *(для исходных файлов)* внутри расположены исходные папки:
    - `components` *(для разделения html структуры `index.html` на модули зависимых файлов)*;
    - `fonts` *(для шрифтов)*;
    - `images` *(для исходных изображений)*;
    - `js` *(для js-файлов)*;
    - `js/functions` *(для js-функций)*;
    - `js/vendor` *(для прочих js-компонентов)*;
    - `resources` *(для сторонних файлов и медиа)*;
    - `scss` *(для разделения css структуры `style.css` на модули зависимых файлов )*;
    - файл `index.html`.
- `build` *(для итоговых файлов; будет создана после первой сборки)*;

 - Файлы: `gulpfile.js`, `package.json`, `package-lock.json`, `.editorconfig`, `.stylelintrc`, `.gitignore`, `README.md` 
 - Файл `gulpfile.js` - содержит задачи для сборщика проекта Gulp. Файл `.stylelintrc` - содержит установленные параметры по конфигурации и распределению разметки стилей (файл незначительный! Без должного понимания работы `stylelint` лучше не использовать! Установленные условия, внутри файла можно менять под собственные условия! Для работы с `stylelint` нужно установить: расширения `stylelint для стилей` в `VSCode` + `npm` пакеты: `stylelint-declaration-block-no-ignored-properties`, `stylelint-scss`, `stylelint-order`). 
 - Файл `.editorconfig` - содержит общие установленные параметры.

### Follow me

<p align="center">

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=plastic&logo=GitHub)](https://github.com/binkovskyi94)
[![Telegram](https://img.shields.io/badge/-Telegram-26A5E4?style=plastic&logo=Telegram)](https://t.me/evgeny_binkovskyi)
[![Instagram](https://img.shields.io/badge/-Instagram-E4405F?style=plastic&logo=Instagram)](https://www.instagram.com/evgeny_binkovskyi)
