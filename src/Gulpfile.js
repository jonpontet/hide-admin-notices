'use strict';

const {src, dest, watch, series, parallel} = require('gulp');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');

const files = {
    src: {
        css: 'assets/css/*.css',
        js: 'assets/js/*.js'
    },
    dist: {
        css: '../assets/css/',
        js: '../assets/js/'
    }
};

function cssTask() {
    return src(files.src.css, {sourcemaps: true})
        .pipe(concat('hide-admin-notices.min.css'))
        .pipe(postcss([cssnano()]))
        .pipe(dest(files.dist.css, {sourcemaps: '.'}));
}

function jsTask() {
    return src([files.src.js], {sourcemaps: true})
        .pipe(concat('hide-admin-notices.min.js'))
        .pipe(uglify())
        .pipe(dest(files.dist.js, {sourcemaps: '.'}));
}

function watchTask() {
    watch(
        [files.src.css, files.src.js],
        {interval: 1000, usePolling: true},
        series(
            parallel(cssTask, jsTask)
        )
    );
}

exports.default = watchTask;