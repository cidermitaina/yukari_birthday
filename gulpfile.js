"use strict";

//require
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const gulpif  = require('gulp-if');
const del  = require('del');
const browserSync = require("browser-sync");
const watch = require('gulp-watch');
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const sass = require('gulp-sass');
const cssnano  = require('gulp-cssnano');
const autoprefixer = require("gulp-autoprefixer");
const notify = require('gulp-notify');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const data = require('gulp-data');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const frontnote = require("gulp-frontnote");
const uglify = require('gulp-uglify');

//path
const SRC = './src';
const HTDOCS = './docs';
const BASE_PATH = '/';
const DEST = `${HTDOCS}${BASE_PATH}`;

let isProduction = false

// css
gulp.task("sass", () => {
    return gulp.src(`${SRC}/assets/scss/**/*.scss`)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 6 versions']}))
        .pipe(gulpif(isProduction, cssnano()))
        .pipe(gulp.dest(`${DEST}assets/css/`))
});

//styleguide
gulp.task("styleguide", () => {
    return gulp.src(`${SRC}/scss/**/*.scss`)
        .pipe(frontnote({
            out: DEST + './guide',
            css: [BASE_PATH + "assets/css/index.css", ,"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css","https://fonts.googleapis.com/earlyaccess/notosansjapanese.css",BASE_PATH +"assets/css/bootstrap.min.css"]
    }))
});

gulp.task('css', gulp.series('sass'));

//js
gulp.task('webpack', () => {
    const webpackConfig = isProduction ? './webpack.prd' : './webpack.dev.js'
    return gulp.src(`${SRC}/assets/js/main.js`)
        .pipe(webpackStream( require(webpackConfig), webpack))
        .pipe(gulp.dest(`${DEST}assets/js/`));
});

gulp.task('js', gulp.parallel('webpack'));


//html
gulp.task("ejs", () => {
    return gulp.src(
        ["src/**/*.ejs",'!' + "src/**/_*.ejs"]
    )
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(data(function(file) {
            const conf = require(`./src/${BASE_PATH}/json/config.json`);
            const pages = require(`./src/${BASE_PATH}/json/pages.json`);

            if (file.path.length !== 0) {
                let path = file.path.split('Â¥').join('/');
                path = path.split('\\').join('/');
                const filename =path.match(/^.+\/src\/(.+)\.ejs$/)[1];
                var meta = {};
                if (pages[filename]) {
                  meta = pages[filename];
                } else {
                  meta = pages.default;
                }
            }
            return {
              meta: meta,
              conf: conf
            };
        }))
        .pipe(ejs())
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(`${HTDOCS}`))
});

gulp.task('html', gulp.series('ejs'));

// server
gulp.task('browser-sync', () => {
    browserSync({
        server: {
            proxy: "localhost:3000",
            baseDir: HTDOCS
        },
        startPath: `${BASE_PATH}`,
        ghostMode: false
    });
    watch([`${SRC}/assets/scss/**/*.scss`], gulp.series('sass', browserSync.reload));
    watch([`${SRC}/assets/js/**/*.js`], gulp.series('webpack', browserSync.reload));
    watch('./src/**/*.+(jpg|jpeg|png|gif|svg)', gulp.series('imagemin', browserSync.reload));
    watch([
        `${SRC}/**/*.ejs`,
    ], gulp.series('ejs', browserSync.reload));

});

gulp.task('server', gulp.series('browser-sync'));

// copy
gulp.task('copy', () => {
  return gulp
    .src('./src/**/*.pdf')
    .pipe(plumber())
    .pipe(gulp.dest('./docs/'))
})

//image min
gulp.task('imagemin', () => {
  return gulp
    .src('./src/**/*.+(jpg|jpeg|png|gif|svg)',{ base: './src/' })
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.svgo({optimizationLevel: 5}),
        pngquant({ speed: 1 })
      ])
    )
    .pipe(gulp.dest('./docs/'))
})

//clean
gulp.task('clean', () => del([`${DEST}**/*.+(jpg|jpeg|png|gif|svg)`,`${DEST}**/*.html`,`${DEST}assets/js/*.map`,`${DEST}**/*.pdf` ]))

// build
gulp.task('build', gulp.parallel('css', 'js', 'html', 'copy'));

//prd
gulp.task('prd', (done)=>{
    isProduction = true
    return gulp.series('clean', 'css', 'js', 'html', 'copy', 'imagemin')(done);
  }
);

// gulp
gulp.task('default', gulp.series('build','server'));
