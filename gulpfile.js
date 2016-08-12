/*GENERAL GULP PLUGINS*/
var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    zip = require('gulp-zip');

/*REACT AND ES6 GULP PLUGINS*/
var babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

/*SCSS GULP PLUGINS*/
var autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    minifyCSS = require('gulp-clean-css');

/*IMAGE Compression*/
var imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegrecompress = require('imagemin-jpeg-recompress');

/*BROWSERIFY GULP PLUGINS*/
var browserify = require('browserify'),
    source = require('vinyl-source-stream');

/*PATHS TO WRITE*/
var SCRIPTS_PATH = 'public/scripts/**/*.js',
    DIST_PATH = 'public/dist',
    SCSS_PATH = 'public/scss/**/*.scss',
    IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,gif,svg}';

/*
Browserify task to bundle the modules.
*/
gulp.task('browserify', function () {
    return browserify('./public/modules/import.js', { debug: true })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(DIST_PATH));
});

/*
Styles for SASS
*/
gulp.task('styles', function () {
    return gulp.src('public/scss/styles.scss')
        .pipe(plumber(function (err) {
            console.log("Styles Error " + err)
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

/*
Scripts for ES6 and React
*/
gulp.task('scripts', function () {
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function (err) {
            console.log('Scripts Task Error ' + err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

/*
Images compression
*/
gulp.task('images', function () {
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                pngquant(),
                jpegrecompress()
            ]
        ))
        .pipe(gulp.dest(DIST_PATH + "/images"))
});

/*
PRODUCTION TASKS WITH NO SOURCEMAPS
*/
//Styles
gulp.task('stylesPro', function () {
    return gulp.src('public/scss/styles.scss')
        .pipe(plumber(function (err) {
            console.log("Styles Error " + err)
            this.emit('end');
        }))
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

//Scripts
gulp.task('scriptsPro', function () {
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function (err) {
            console.log('Scripts Task Error ' + err);
            this.emit('end');
        }))
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
});

/*Delete the distribution folder*/
gulp.task('clean', function() {
    return del.sync([
        DIST_PATH
    ]);
});

/*Zip up the public directory for sharing :)*/
gulp.task('export', ['default'], function() {
    return gulp.src('public/**/*')
        .pipe(zip('website.zip'))
        .pipe(gulp.dest('./'))
})

/*
GENERAL TASKS
*/

/*Production task. Run through the production tasks.
Images is not included for assumption of already being
minified through development*/
gulp.task('production', ['clean', 'scriptsPro', 'stylesPro'], function () {
    console.log("production task.");
});

/*
Default task. Run through all gulp plugins for development.
Sourcemaps have not been included.
*/
gulp.task('default', ['clean', 'styles', 'scripts', 'images', 'browserify'], function () {
    console.log("default task.");
});

/*
Run a server and a livereload for development.
Livereload has a script tag in index.html.
*/
gulp.task('watch', ['default'], function () {
    console.log("watch task.");
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    gulp.watch(SCSS_PATH, ['styles']);
})
