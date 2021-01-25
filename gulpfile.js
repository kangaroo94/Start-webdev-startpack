"use strict";

/* подключаем gulp и плагины */
const { src, dest, parallel, series, watch } = require('gulp'),
        sass = require('gulp-sass'),                                 // препроцессор 
        notify = require('gulp-notify'),                             // информирует о найденных ошибках 
        rename = require('gulp-rename'),                             // переименовывает файлы, добавляет им префиксы и суффиксы 
        autoprefixer = require('gulp-autoprefixer'),                 // автоматическая расстановка вендорных префиксов 
        cleancss = require('gulp-clean-css'),                        // очистка css-файлов                               
        sourcemaps = require('gulp-sourcemaps'),                     // поддержка карты слитого воедино файла, исходного кода 
        browserSync = require('browser-sync').create(),              // live-server для отображения в браузере
        fileinclude = require('gulp-file-include'),                  // импорт файлов (работает с HTML SCSS/CSS и JS) 
        svgSprite = require('gulp-svg-sprite'),                      // конвертирует svg-файл в svg-sprite 
        ttf2woff = require('gulp-ttf2woff'),                         // конвертирует шрифты ttf-файла в woff 
        ttf2woff2 = require('gulp-ttf2woff2'),                       // конвертирует шрифты ttf-файла в woff2 
        fs = require('fs'),
        del = require('del'),                                        // удаляет указанные файлы и директории 
        webpack = require('webpack'),                                // сборщик модулей. Объединить файлы 
        webpackStream = require('webpack-stream'),                   // используем для интеграции webpack с gulp 
        uglify = require('gulp-uglify-es').default,                  // минифицирует JS файлы 
        tiny = require('gulp-tinypng-compress'),                     // пережимает изображение. Работае с API-KEY https://tinypng.com/ 
        gutil = require('gulp-util'),
        ftp = require('vinyl-ftp'),
        babel = require('gulp-babel'),                               // конвертирует javascript, стандарта ES6 в ES5 
        size = require('gulp-filesize'),                             // выводит в консоль размер файлов до и после их сжатия 
        concat = require('gulp-concat'),                             // склеивает css и js-файлы в один 
        cssmin = require('gulp-cssmin'),                             // минифицирует CSS файлы 
        imagemin = require('gulp-imagemin'),                         // пережимает изображение 
        recompress = require('imagemin-jpeg-recompress'),            // пережимает изображение. Используем в связке с gulp-imagemin 
        htmlmin = require('gulp-htmlmin');                           // минифицирует HTML файлы*/

/* DEV PROD */

/* -- задачи -- */

/* функция svgSprites */
const svgSprites = () => {
    return src('./src/img/svg/**.svg')                               // папка SVG. Файлы-svg, которые нахадятся в папке, будут преобразованы в svg-sprite. Вне папки, нет! 
        .pipe(svgSprite({                                            // cоздает из svg-файлов, оптимизированные svg-sprite 
            
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            },
        }))
        .pipe(dest('./app/img'));                                    // перемещаем готовый файл в директорию 
};

/* функция resources */
const resources = () => {
    return src('./src/resources/**')                                 // переносит содержимое resources в корень папки 
        .pipe(dest('./app'));                                        // перемещаем готовый файл в директорию 
};

/* функция imgToBuild */ 
const imgToBuild = () => {
    return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg', './src/img/**.webp'])
        .pipe(size())                                                // размер исходных файлов 
        .pipe(
            imagemin([                                               // минифицируем картинки 
                // Настройки сжатия изображений 
                recompress({
                    loops: 4,                                        // количество прогонок изображения 
                    min: 70,                                         // минимальное качество в процентах 
                    max: 80,                                         // максимальное качество в процентах 
                    quality: "high",                                 // качество изображения 
                }), 
                // плагины для обработки разных типов изображений 
                imagemin.gifsicle(),
                imagemin.optipng(),
                imagemin.svgo(),
            ])
        )
        .pipe(dest('./app/img'))
        .pipe(size())
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
};

/* функция htmlInclude */
const htmlInclude = () => {
    // собираем html из кусочков 
    return src(['./src/*.html'])
        .pipe(fileinclude({                                           // импортируем файлы с префиксом @@. Префикс можно настроить под себя 
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('./app'))                                          // перемещаем готовый файл в директорию */
        .pipe(sourcemaps.init())                                      // инициализируем sourcemaps для записи файлов 
        .pipe(sourcemaps.write())                                     // записываем карту в итоговый файл 
        .pipe(size())                                                 // размер файла 
        .pipe(browserSync.stream());                                  // live-server 
};

/* функция fonts */
const fonts = () => {
// перекидываем шрифты из директории src в app, а заодно следим за новыми файлами, чтобы обновлять браузер, когда появляется шрифт 
    src('./src/fonts/**.ttf')
        .pipe(ttf2woff())
        .pipe(dest('./app/fonts/')); 
    return src('./src/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('./app/fonts/'))                                    // перемещаем итоговый файл в директорию app/fonts 
        .pipe(
            browserSync.reload({                                      
                stream: true,
            })
        );
};

/* функция checkWeight(определяем начертание шрифта) */
const checkWeight = (fontname) => {
    let weight = 400;
    switch (true) {
        case /Thin/.test(fontname):
            weight = 100;
            break;
        case /ExtraLight/.test(fontname):
            weight = 200;
            break;
        case /Light/.test(fontname):
            weight = 300;
            break;
        case /Regular/.test(fontname):
            weight = 400;
            break;
        case /Medium/.test(fontname):
            weight = 500;
            break;
        case /SemiBold/.test(fontname):
            weight = 600;
            break;
        case /Semi/.test(fontname):
            weight = 600;
            break;
        case /Bold/.test(fontname):
            weight = 700;
            break;
        case /ExtraBold/.test(fontname):
            weight = 800;
            break;
        case /Heavy/.test(fontname):
            weight = 700;
            break;
        case /Black/.test(fontname):
            weight = 900;
            break;
        default:
            weight = 400;
    }
    return weight;
};

const cb = () => {}

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts/';

/* функция fontsStyle для автоматического формирования исходного @mixin в готовое свойство шрифта */
const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, '', cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                let font = fontname.split('-')[0];
                let weight = checkWeight(fontname);

                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '", ' + weight + ');\r\n', cb);
                }
                c_fontname = fontname;
            }
        }
    });

    done();
};

/* функция styles */
const styles = () => {
    // делаем из своего scss-кода css для браузера 
    return src('./src/scss/**/*.scss')                                 // берём все файлы в директории scss и директорий нижнего уровня 
        .pipe(sourcemaps.init())                                       // инициализируем sourcemaps для записи файлов 
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))                              // конвертируем scss в css и импортируем все @import 
        .pipe(autoprefixer({                                           // добавляем вендорные префиксы 
            overrideBrowserslist: ["last 8 versions"],                 // версии browser 
            cascade: true,
            browsers: [
                "Android >= 4",
                "Chrome >= 20",
                "Firefox >= 24",
                "Explorer >= 11",
                "iOS >= 6",
                "Opera >= 12",
                "Safari >= 6",
            ],
        }))
        .pipe(cleancss({
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
        }))
        .pipe(rename({
            suffix: '.min'                                             // переименовываем файл, чтобы было понятно, что он минифицирован 
        })) 
        .pipe(sourcemaps.write('.'))                                   // записываем карту в итоговый файл 
        .pipe(dest('./app/css/'))                                      // перемещаем итоговый файл в директорию app/css 
        .pipe(size())                                                  // размер файла 
        .pipe(browserSync.stream());                                   // live-server 
};

/* функция stylesLib */
const stylesLib = () => {
    // создаём единую библиотеку из css-стилей всех плагинов 
    return src([
            // указываем, где брать исходники 
            'node_modules/normalize.css/normalize.css',
        ])
        .pipe(sourcemaps.init())                                       // инициализируем sourcemaps для записи файлов 
        .pipe(concat("libs.min.css"))                                  // склеиваем их в один файл с указанным именем 
        .pipe(cssmin())                                                // минифицируем полученный файл 
        .pipe(sourcemaps.write())                                      // записываем карту в итоговый файл 
        .pipe(dest('./app/css/'))                                      // перемещаем готовый файл в директорию 
        .pipe(size());                                                 // размер файла 
};

/* функция scripts */
const scripts = () => {
    // обновляем браузер, если в наших js файлах что-то поменялось 
    return src('./src/js/main.js')                                     // берём все файлы в директории js 
        // генерируем файл 
        .pipe(webpackStream({
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
        .pipe(sourcemaps.init())                                       // инициализируем sourcemaps для записи файлов 
        .pipe(babel())
        .pipe(uglify().on("error", notify.onError()))                  // минифицируем js файлы 
        .pipe(sourcemaps.write('.'))                                   // записываем карту в итоговый файл
        .pipe(dest('./app/js'))                                        // перемещаем итоговый файл в директорию app/js 
        .pipe(size())                                                  // размер файла 
        .pipe(browserSync.stream());                                   // live-server 
};

/* функция scriptsLib */
const scriptsLib = () => {
    // создаём единую библиотеку из js-файлов всех плагинов 
    return src([
            // указываем, где брать исходники 
            'node_modules/jquery/dist/jquery.min.js',
        ])
        .pipe(size())
        .pipe(sourcemaps.init())                                       // инициализируем sourcemaps для записи файлов 
        .pipe(babel())                                                 //  конвертирует js-файл стандарта ES6 в ES5 
        .pipe(concat("libs.min.js"))                                   // склеиваем их в один файл с указанным именем 
        .pipe(uglify().on("error", notify.onError()))                  // минифицируем полученный файл 
        .pipe(sourcemaps.write())                                      // записываем карту в итоговый файл 
        .pipe(dest('./app/js'))                                        // перемещаем готовый файл в директорию
        .pipe(size());                                                 // размер файла 
};

/* функция minjs */
const minjs = () => {
    // минифицируем наш main.js и перекидываем в директорию app 
    return src('./src/js/main.js')
        .pipe(size())
        .pipe(babel())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest('./app/js'))
        .pipe(
            rename({
                extname: ".min.js",
            })
        )
        .pipe(dest('./app/js'))
        .pipe(size());
};

/* функция watchFiles */
const watchFiles = () => {
    // cледим за изменениями в файлах и директориях и запускаем задачи, если эти изменения произошли 
    browserSync.init({
        server: {
            baseDir: "./app"                                           // какую папку показывать в браузере 
        },
        browser: ["chrome"],                                           // browser 
        host: "192.168.0.104",                                         // IP сервера в локальной сети. Отключите, если у вас DHCP, пропишите под себя, если фиксированный IP в локалке 
        port: 3000,
        notify: false                                                  // убирает синие окно браузера 
    });

    watch('./src/scss/**/*.scss', styles);
    watch('./src/js/**/*.js', scripts);
    watch('./src/html/*.html', htmlInclude);
    watch('./src/*.html', htmlInclude);
    watch('./src/components/*.html', htmlInclude);
    watch('./src/resources/**', resources);
    watch('./src/img/**.jpg', imgToBuild);
    watch('./src/img/**.png', imgToBuild);
    watch('./src/img/**.jpeg', imgToBuild);
    watch('./src/img/**.webp', imgToBuild);
    watch('./src/img/svg/**.svg', svgSprites);
    watch('./src/fonts/**.ttf', fonts);
    watch('./src/fonts/**.ttf', fontsStyle);
};

const clean = () => {
    // очищаем директорию app 
    return del(['app/*']);
};

exports.fileinclude = htmlInclude;
exports.styles = styles;
exports.scripts = scripts;
exports.watchFiles = watchFiles;
exports.fonts = fonts;
exports.fontsStyle = fontsStyle;

exports.default = series(clean, parallel(htmlInclude, scripts, minjs, scriptsLib, fonts, resources, imgToBuild, svgSprites), fontsStyle, stylesLib, styles, watchFiles);


/* BUILD PROD */ 

/* -- задачи -- */

/* функция tinypng */
const tinypng = () => {
    // пережимает изображение. Работае с API-KEY https://tinypng.com/ 
    return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg', './src/img/**.gif', './src/img/**.ico', './src/img/**.svg', './src/img/**.webp'])
        .pipe(tiny({
            key: 'API_KEY',                                            // API-KEY https://tinypng.com/ 
            sigFile: './app/img/.tinypng-sigs',
            parallel: true,
            parallelMax: 50,
            log: true
        }))
        .pipe(dest('./app/img'));                                      // перемещаем готовый файл в директорию 
};

/* функция imgMinToBuild */
const imgMinToBuild = () => {
    return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg', './src/img/**.webp'])
        .pipe(size())
        .pipe(
            imagemin([
                recompress({
                    loops: 4,
                    min: 70,
                    max: 80,
                    quality: "high",
                }),
                imagemin.gifsicle(),
                imagemin.optipng(),
                imagemin.svgo(),
            ])
        )
        .pipe(dest('./app/img'))
        .pipe(size())
        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
};

/* функция stylesBuild */
const stylesBuild = () => {
    return src('./src/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 8 versions"],
            cascade: true,
            browsers: [
                "Android >= 4",
                "Chrome >= 20",
                "Firefox >= 24",
                "Explorer >= 11",
                "iOS >= 6",
                "Opera >= 12",
                "Safari >= 6",
            ],
        }))
        .pipe(cleancss({
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
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('./app/css/'))
        .pipe(size());
};

/* функция stylesLibBuild */
const stylesLibBuild = () => {
    return src([
            'node_modules/normalize.css/normalize.css',
        ])
        .pipe(concat("libs.min.css"))
        .pipe(cssmin())
        .pipe(dest('./app/css/'))
        .pipe(size());
};

/* функция scriptsBuild */
const scriptsBuild = () => {
    return src('./src/js/main.js')
        .pipe(webpackStream({
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
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end');
        })
        .pipe(babel())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest('./app/js'))
        .pipe(size());
};

/* функция minjsBuild */
const minjsBuild = () => {
    return src('./src/js/main.js')
        .pipe(size())
        .pipe(babel())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest('./app/js'))
        .pipe(
            rename({
                extname: ".min.js",
            }),
        )
        .pipe(dest('./app/js'))
        .pipe(size());
};

/* функция scriptsLibBuild */
const scriptsLibBuild = () => {
    return src([
            "node_modules/jquery/dist/jquery.min.js",
        ])
        .pipe(size())
        .pipe(babel())
        .pipe(concat("libs.min.js"))
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest('./app/js'))
        .pipe(size());
};

/* функция htmlMinify */
const htmlMinify = () => {
    return src('app/**/*.html')
        .pipe(htmlmin({                                                // минифицируем html-файл 
            collapseWhitespace: true
        }))
        .pipe(dest('app'));                                            // перемещаем готовый файл в директорию 
};

exports.build = series(clean, parallel(htmlInclude, scriptsBuild, minjsBuild, scriptsLibBuild, fonts, resources, imgMinToBuild, svgSprites), fontsStyle, stylesLibBuild, stylesBuild, htmlMinify, tinypng);

/*DEPLOY */
const deploy = () => {
    // грузим файлы на хостинг по FTP
    let conn = ftp.create({
        host: '',
        user: '',
        password: '',
        parallel: 10,
        log: gutil.log
    });

    let globs = [
        'app/**',
    ];

    return src(globs, {
            base: './app',
            buffer: false
        })
        .pipe(conn.newer(''))
        .pipe(conn.dest(''));
}

exports.deploy = deploy;




























