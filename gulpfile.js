'use strict';

import zip from 'gulp-zip';
import gulp from 'gulp';
import cssnano from 'cssnano';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import postcss from 'gulp-postcss';

const {src, dest, watch, series, parallel} = gulp;
const sass = gulpSass(dartSass);

const files = {
    src: {
        css: 'src/scss/*.scss',
        js: 'src/js/*.js'
    },
    dist: {
        css: 'assets/css/',
        js: 'assets/js/'
    },
    package: ['./**', '!./node_modules{,/**}', '!./src{,/**}', '!./composer.*', '!./gulpfile.js', '!./package*'],
};

gulp.task('css',
    function () {
        return gulp.src(files.src.css)
            .pipe(concat('hide-admin-notices.css'))
            .pipe(sassGlob())
            .pipe(sass({
                includePaths: ['node_modules/']
            }))
            .pipe(gulp.dest(files.dist.css))
            .pipe(concat('hide-admin-notices.min.css'))
            .pipe(postcss([cssnano()]))
            .pipe(gulp.dest(files.dist.css));
    });

gulp.task('js',
    function () {
        return gulp.src([files.src.js])
            .pipe(concat('hide-admin-notices.js'))
            .pipe(gulp.dest(files.dist.js))
            .pipe(concat('hide-admin-notices.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(files.dist.js));
    });

gulp.task('watch',
    function () {
        gulp.watch(
            [files.src.css, files.src.js],
            {interval: 1000, usePolling: true},
            gulp.series(
                gulp.parallel('css', 'js')
            )
        );
    });

gulp.task('package',
    function () {
        return gulp.src(files.package)
            .pipe(zip('hide-admin-notices.zip'))
            .pipe(gulp.dest('./'));
    });

gulp.task('default', gulp.series('watch'));