'use strict';
/** Requires */
const fs        = require('fs');
const path      = require('path');

const gulp      = require('gulp');
const eslint    = require('gulp-eslint');

const gutil     = require('gulp-util');
const plumber   = require('gulp-plumber');
const yaml      = require('js-yaml');

/** Constants */
const jsPath = [
  "./**/*.js",
  "!./node_modules/**/*"
];

/** Helps */
function onError(err) {
  if (err.toString) {
    gutil.log(gutil.colors.red("Error"), err.toString());
  } else {
    gutil.log(gutil.colors.red("Error"), err.message);
  }

  this.end();
}

/** Tasks */
gulp.task("lint", () => {
  gulp.src(jsPath)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(eslint(yaml.load(
      fs.readFileSync(path.join(__dirname, "./.eslintrc.yml"))
    )))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task("watch", () => {
  gulp.watch(jsPath, ["lint"]);
});

gulp.task("default", ["lint"]);
