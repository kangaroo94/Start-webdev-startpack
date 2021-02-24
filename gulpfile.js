"use strict";

let project_folder = require("path").basename(__dirname);
let source_folder = "#src";


let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    images: project_folder + "/images/",
    fonts: project_folder + "/fonts/",
    resources: project_folder + "/resources/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/components/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/main.js",
    images: source_folder + "/images/**/*.+(png|jpg|gif|ico|svg|webp)",
    fonts: source_folder + "/fonts/**/*.+(eot|svg|ttf|otf|woff|woff2)",
    resources: source_folder + "/resources/**",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    images: source_folder + "/images/**/*.+(png|jpg|gif|ico|svg|webp)",
    fonts: source_folder + "/fonts/**/*.+(eot|svg|ttf|otf|woff|woff2)",
    resources: source_folder + "/resources/**",
  },
  clean: "./" + project_folder + "/"
};

//определим переменные для функций плагинов
let {
  src,
  dest
} = require('gulp'),
  gulp = require("gulp"),
  sass = require("gulp-sass"), // препроцессор
  notify = require("gulp-notify"), // информирует о найденных ошибках
  sourcemaps = require("gulp-sourcemaps"), // поддержка карты слитого воедино файла, исходного кода
  rename = require("gulp-rename"), // переименовывает файлы, добавляет им префиксы и суффиксы
  prefixer = require("gulp-autoprefixer"), // автоматическая расстановка вендорных префиксов
  cleancss = require("gulp-clean-css"), // очистка css-файлов
  browserSync = require("browser-sync").create(), // live-server для отображения в браузере
  fileinclude = require("gulp-file-include"), // импорт файлов (работает с HTML SCSS/CSS и JS)
  size = require("gulp-size"), // выводит в консоль размер файлов до и после их сжатия
  htmlmin = require("gulp-htmlmin"), // минифицирует HTML файлы
  imagemin = require("gulp-imagemin"), // пережимает изображение
  recompress = require("imagemin-jpeg-recompress"), // пережимает изображение. Используем в связке с gulp-imagemin
  del = require("del"), // удаляет указанные файлы и директории
  ttf2woff = require("gulp-ttf2woff"), // конвертирует шрифты ttf-файла в woff
  ttf2woff2 = require("gulp-ttf2woff2"), // конвертирует шрифты ttf-файла в woff2
  webpack = require("webpack"), // сборщик модулей. Объединить файлы
  webpackStream = require("webpack-stream"), // используем для интеграции webpack с gulp
  uglify = require("gulp-uglify-es").default, // минифицирует JS файлы
  babel = require("gulp-babel"), // конвертирует javascript, стандарта ES6 в ES5
  concat = require("gulp-concat"), // склеивает css и js-файлы в один
  cssmin = require("gulp-cssmin"), // минифицирует CSS файлы
  gutil = require("gulp-util"), // deploy
  ftp = require("vinyl-ftp"); // deploy


gulp.task("scss", function () {
  //делаем из своего scss-кода css для браузера
  return gulp
    .src(path.src.css) //берём все файлы в директории scss и директорий нижнего уровня
    .pipe(sourcemaps.init()) // инициализируем sourcemaps для записи файлов
    .pipe(sass({
      outputStyle: "expanded",
    }).on('error', notify.onError())) //конвертируем scss в css и импортируем все импорты
    .pipe(dest(path.build.css)) //кладём итоговый файл в директорию build/css
    .pipe(
      rename({ //переименовываем файл, чтобы было понятно, что он минифицирован
        suffix: ".min"
      })
    )
    .pipe(
      prefixer({
        //добавляем вендорные префиксы
        overrideBrowserslist: ["last 8 versions"], // версии browser
        cascade: false,
        browsers: [
          //список поддерживаемых браузеров и их версия - ВНИМАНИЕ! данная опция влияет только на расстановку префиксов и не гарантирут 100% работы сайта в этих браузерах.
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 11",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6",
        ],
      })
    )
    .pipe(
      cleancss({ // очищает css файлы
        compatibility: "ie8",
        level: {
          1: {
            specialComments: 0,
            removeEmpty: true,
            removeWhitespace: true,
          },
          2: {
            mergeMedia: true,
            removeEmpty: true,
            removeDuplicateFontRules: true,
            removeDuplicateMediaBlocks: true,
            removeDuplicateRules: true,
            removeUnusedAtRules: false,
          },
        },
      })
    )
    .pipe(sourcemaps.write('.')) // записываем карту в итоговый файл
    .pipe(dest(path.build.css)) //кладём итоговый файл в директорию build/css
    .pipe(
      browserSync.reload({ // live-serve
        stream: true,
      }),
    )
    .pipe(size()); // размер файла

});

gulp.task("style", function () {
  // создаём единую библиотеку из css-стилей всех плагинов
  return gulp
    .src([
      //указываем, где брать исходники
      "node_modules/normalize.css/normalize.css",
      "node_modules/swiper/swiper-bundle.min.css",
      "node_modules/bootstrap/dist/css/bootstrap.min.css"


    ])
    .pipe(sourcemaps.init()) // инициализируем sourcemaps для записи файлов
    .pipe(concat("libs.min.css")) //склеиваем их в один файл с указанным именем
    .pipe(cssmin()) //минифицируем полученный файл
    .pipe(sourcemaps.write('.')) // записываем карту в итоговый файл
    .pipe(dest(path.build.css)) //кидаем готовый файл в директорию
    .pipe(size()); // размер файла
});

gulp.task("js", function () {
  //обновляем браузер, если в наших js файлах что-то поменялось
  return gulp.src(path.src.js)
    .pipe(webpackStream({ // webpackStream свойства
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(sourcemaps.init()) // инициализируем sourcemaps для записи файлов
    .pipe(babel()) // форматируем стандарт кода в ES5
    .pipe(uglify().on("error", notify.onError())) // минифицируем js файлы
    .pipe(sourcemaps.write('.')) // записываем карту в итоговый файл
    .pipe(dest(path.build.js)) // перемещаем итоговый файл в директорию
    .pipe(size()) // размер файла
    .pipe(
      browserSync.reload({ // live-serve
        stream: true,
      }),
    );
});

gulp.task("script", function () {
  // создаём единую библиотеку из css-стилей всех плагинов
  return gulp
    .src([
      //указываем, где брать исходники
      "node_modules/swiper/swiper-bundle.min.js",
      "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
    ])
    .pipe(size()) // размер файла
    .pipe(sourcemaps.init()) // инициализируем sourcemaps для записи файлов
    .pipe(babel()) // форматируем стандарт кода в ES5
    .pipe(concat("libs.min.js")) // склеиваем их в один файл с указанным именем
    .pipe(uglify().on("error", notify.onError())) // минифицируем js файлы
    .pipe(sourcemaps.write('.')) // записываем карту в итоговый файл
    .pipe(dest(path.build.js)) // перемещаем итоговый файл в директорию
    .pipe(size()); // размер файла
});

gulp.task("minjs", function () {
  return gulp
    .src(path.src.js) //берём все файлы в директории js и директорий нижнего уровня
    .pipe(size()) // размер файла
    .pipe(babel()) // форматируем стандарт кода в ES5
    .pipe(uglify().on("error", notify.onError())) // минифицируем js файлы
    .pipe(dest(path.build.js)) // перемещаем итоговый файл в директорию
    .pipe(
      rename({ //переименовываем файл, чтобы было понятно, что он минифицирован
        extname: ".min.js",
      }),
    )
    .pipe(dest(path.build.js)) // перемещаем итоговый файл в директорию
    .pipe(size()); // размер файла
});

gulp.task("html", function () {
  return src(path.src.html)
    .pipe(
      fileinclude({
        //импортируем файлы с префиксом @@
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(htmlmin({ // минифицируем html-файл
      collapseWhitespace: true
    }))
    .pipe(dest(path.build.html)) // перемещаем готовый файл в директорию
    .pipe(sourcemaps.init()) // инициализируем sourcemaps для записи файлов
    .pipe(sourcemaps.write('.')) // записываем карту в итоговый файл
    .pipe(
      browserSync.reload({ // live-server
        stream: true,
      }),
    )
    .pipe(size()); // размер файла
});

gulp.task("images", function () {
  return gulp
    .src(path.src.images)
    .pipe(size()) // размер исходных файлов
    .pipe(
      imagemin([ // минифицируем картинки
        recompress({
          //Настройки сжатия изображений.
          loops: 4, //количество прогонок изображения
          min: 70, // минимальное качество в процентах
          max: 80, // максимальное качество в процентах
          quality: "high", // качество изображения
        }),
        // плагины для обработки разных типов изображений
        imagemin.gifsicle(),
        imagemin.optipng(),
        imagemin.svgo(),
      ]),
    )
    .pipe(dest(path.build.images)) // перемещаем итоговый файл в директорию build/images
    .pipe(
      browserSync.reload({ // live-server
        stream: true,
      }),
    )
    .pipe(size()); // размер файла
});

gulp.task("fonts", function () {
  //перекидываем шрифты из директории src в build, а заодно следим за новыми файлами, чтобы обновлять браузер, когда появляется шрифт
  src(path.src.fonts)
    .pipe(ttf2woff()) // форматирует формат шрифтов ttf в woff
    .pipe(dest(path.build.fonts)) // перемещаем итоговый файл в директорию build/fonts
  return gulp.src(path.src.fonts)
    .pipe(ttf2woff2()) // форматирует формат шрифтов ttf в woff2
    .pipe(dest(path.build.fonts)) // перемещаем итоговый файл в директорию build/fonts
    .pipe(
      browserSync.reload({ // live-server
        stream: true,
      }),
    )
    .pipe(size()); // размер файла
});

gulp.task("resources", function () {
  return gulp
    .src(path.src.resources) // переносит содержимое resources в корень папки
    .pipe(dest(path.build.resources)) // перемещаем готовый файл в директорию
    .pipe(
      browserSync.reload({ // live-server
        stream: true,
      }),
    )
    .pipe(size()); // размер файла
});

gulp.task("deletefonts", function () {
  // очищаем директорию build/fonts от ненужных файлов
  return del.sync(path.build.fonts);
});

gulp.task("deleteimg", function () {
  // очищаем директорию build/images от ненужных файлов
  return del.sync(path.build.images);
});

gulp.task("deleteresources", function () {
  // очищаем директорию build/images от ненужных файлов
  return del.sync(path.build.resources);
});

gulp.task("watch", function () {
  //Следим за изменениями в файлах и директориях и запускаем задачи, если эти изменения произошли
  gulp.watch([path.watch.css], gulp.parallel("scss"));
  gulp.watch([path.watch.html], gulp.parallel("html"));
  gulp.watch([path.watch.fonts], gulp.parallel("fonts", "deletefonts"));
  gulp.watch([path.watch.html], gulp.parallel("js", "minjs"));
  gulp.watch([path.watch.images], gulp.parallel("images", "deleteimg"));
  gulp.watch([path.watch.resources], gulp.parallel("resources", "deleteresources"));
});

gulp.task("deploy", function () {
  // грузим файлы на хостинг по FTP
  let conn = ftp.create({
    host: '',
    user: '',
    password: '',
    parallel: 10,
    log: gutil.log
  });

  let globs = [
    (path.build),
  ];

  return src(globs, {
      base: (path.build),
      buffer: false
    })
    .pipe(conn.newer(''))
    .pipe(conn.dest(''));
});

gulp.task("browser-sync", function () {
  //настройки live-server
  browserSync.init({
    server: {
      baseDir: "./" + project_folder + "/" //какую папку показывать в браузере
    },
    browser: ["chrome"], //в каком браузере
    //tunnel: " ", //тут можно прописать название проекта и дать доступ к нему через интернет. Работает нестабильно, запускается через раз. Не рекомендуется включать без необходимости.
    //tunnel:true, //работает, как и предыдущяя опция, но присваивает рандомное имя. Тоже запускается через раз и поэтому не рекомендуется для включения
    host: "192.168.0.104", //IP сервера в локальной сети. Отключите, если у вас DHCP, пропишите под себя, если фиксированный IP в локалке.
    port: 3000,
    notify: false //убирает синие окно браузера
  });
});


gulp.task(
  "default",
  gulp.parallel(
    "browser-sync",
    "watch",
    "scss",
    "html",
    "fonts",
    "js",
    "style",
    "script",
    "minjs",
    "images",
    "resources",
    "deletefonts",
    "deleteimg",
    "deleteresources"
  ),
); //запускает все перечисленные задачи разом
