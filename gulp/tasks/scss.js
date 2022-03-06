import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css';  // Сжатие CSS файла
import webpcss from 'gulp-webpcss';  // Вывод WEBP изображений. Чтобы плагин заработал необходимо установить конвертер "npm i -D webp-converter@2.2.3"
import autoprefixer from 'gulp-autoprefixer';  // Добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries';  // групировка медиа запросов

const sass = gulpSass(dartSass);  // В константу sass делаем вызов из плагина gulp-sass с передачей компилятора sass

export const scss = () => {
    return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "SCSS",
                message: "Error: <%= error.message %>"
            })))
        .pipe(app.plugins.replace(/@img\//g, '../img/'))
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(
            app.plugins.if(
                app.isBuild,
                groupCssMediaQueries()
            )
        )
        .pipe(
            app.plugins.if(
                app.isBuild,
                webpcss({
                    webpClass: ".webp",
                    noWebpClass: ".no-webp"
                })
            )
        )
        .pipe(
            app.plugins.if(
                app.isBuild,
                autoprefixer({
                    grid: true,
                    overrideBrowserslist: ["last 3 versions"],
                    cascade: true
                })
            )
        )
        .pipe(app.gulp.dest(app.path.build.css))  // Деалет копию css файла до сжатия его cleanCss
        .pipe(
            app.plugins.if(
                app.isBuild,
                cleanCss()
            )
        )
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browsersync.stream());
}