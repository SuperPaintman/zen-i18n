'use strict';
/** Requires */
const fs            = require('fs');
const path          = require('path');

const gulp          = require('gulp');
const ts            = require('gulp-typescript');
const eslint        = require('gulp-eslint');

const browserify    = require('gulp-browserify');
const uglify        = require('gulp-uglify');
const rename        = require('gulp-rename');

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

const distPath = {
  from: [
    "./typings/**/*.ts",
    "./development/**/*.d.ts",
    "./development/browser*.ts"
  ],
  to: "./dist/"
}

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
gulp.task("build:ts", () => {
  return gulp.src(tsPath.from)
    /** @todo: Пламбер перезапускает TS */
    // .pipe(plumber({
    //   errorHandler: onError
    // }))
    .pipe(ts(ts.createProject('tsconfig.json')))
    .pipe(gulp.dest(tsPath.to));
});

gulp.task("build:browser", () => {
  return gulp.src(distPath.from)
    /** @todo: Пламбер перезапускает TS */
    // .pipe(plumber({
    //   errorHandler: onError
    // }))
    .pipe(ts(ts.createProject('tsconfig.json')))
    .pipe(browserify({
      ignore: ["angular"]
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('browser', 'zen-i18n');
    }))
    .pipe(gulp.dest(distPath.to))
    // Min
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(distPath.to));
});

gulp.task("build", ["build:ts", "build:browser"]);

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
