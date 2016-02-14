'use strict';
/** Requires */
const fs            = require('fs');
const path          = require('path');

const gulp          = require('gulp');
const ts            = require('gulp-typescript');
const eslint        = require('gulp-eslint');

const gutil         = require('gulp-util');
const plumber       = require('gulp-plumber');
const yaml          = require('js-yaml');

/** Constants */
const tsPath = {
  from: [
    "./typings/**/*.ts",
    "./development/**/*.ts",
    "!./node_modules/**/*"
  ],
  to: "./bin/"
};

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
gulp.task("build", () => {
  return gulp.src(tsPath.from)
    /** @todo: Пламбер перезапускает TS */
    // .pipe(plumber({
    //   errorHandler: onError
    // }))
    .pipe(ts(ts.createProject('tsconfig.json')))
    .pipe(gulp.dest(tsPath.to));
});

gulp.task("lint", () => {
  return gulp.src(tsPath.from)
    /** @todo: Пламбер перезапускает TS */
    // .pipe(plumber({
    //   errorHandler: onError
    // }))
    .pipe(ts(ts.createProject('tsconfig.json')))
    .pipe(eslint(yaml.load(
      fs.readFileSync(path.join(__dirname, "./.eslintrc.yml"))
    )))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task("watch", () => {
  gulp.watch(tsPath.from, ["build"]);
});

gulp.task("default", ["build", "lint"]);
