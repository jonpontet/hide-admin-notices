'use strict';

import zip from 'gulp-zip';
import gulp from 'gulp';
import cssnano from 'cssnano';
import composer from 'gulp-uglify/composer.js';
import uglifyJs from 'uglify-js';
import concat from 'gulp-concat';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import pump from 'pump';

const {src, dest, watch, series, parallel} = gulp;
const sass = gulpSass(dartSass);
const minify = composer(uglifyJs, console);

const files = {
  src: {
    css: 'src/scss/*.scss',
    js_glob: 'src/js/*.js',
    js: [
      'src/js/hide-admin-notices.js',
    ]
  },
  dist: {
    css: 'assets/css/',
    js: 'assets/js/'
  },
  package: ['./**', '!./node_modules{,/**}', '!./src{,/**}', '!./composer.*', '!./gulpfile.js', '!./package*', '!./*.zip'],
};

gulp.task('css',
  function () {
    return pump([
      gulp.src(files.src.css),
      concat('hide-admin-notices.css'),
      sassGlob(),
      sass({
        includePaths: ['node_modules/']
      }).on('error', sass.logError),
      gulp.dest(files.dist.css),
      concat('hide-admin-notices.min.css'),
      postcss([cssnano()]),
      gulp.dest(files.dist.css)
    ]);
  });

gulp.task('js',
  function (done) {
    files.src.js.forEach(function ($script) {
      pump([
        gulp.src($script),
        gulp.dest(files.dist.js),
        rename(function (path) {
          path.extname = ".min.js"
        }),
        minify({}),
        gulp.dest(files.dist.js)
      ]);
    });
    done();
  });

gulp.task('watch',
  function () {
    gulp.watch(
      [files.src.css, files.src.js_glob],
      {interval: 1000, usePolling: true},
      gulp.parallel('css', 'js')
    );
  });

gulp.task('package',
  function () {
    return pump([
      gulp.src(files.package),
      zip('hide-admin-notices.zip'),
      gulp.dest('./')
    ]);
  });

gulp.task('default', gulp.series('watch'));