var del = require('del');
var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var isparta = require('isparta');

// Load all of our Gulp plugins
var $ = loadPlugins();

function _registerBabel() {
  require('babel-core/register');
}

// Clean up
gulp.task('clean', function(){
  del.sync(['./dist','./dist.zip']);
});

// Lint
gulp.task('lint', function() {
  return gulp.src('./src/main.js')
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

// Test
gulp.task('test', function() {
  _registerBabel();

  return gulp.src(['./tests/**/*.spec.js'], {read: false})
  .pipe($.mocha({
    reporter: 'spec',
    globals: ["sinon", "chai", "expect"],
    require: ['./tests/test-helper.js']
  }));
});

// Live Test Watching
gulp.task('test-watch', ['test'], function() {
   gulp.watch(['./tests/**/*.spec.js', './src/main.js'], ['test']);
});

// Coverage
gulp.task('test-coverage', function () {
  _registerBabel();

  return gulp.src(['./src/main.js'])
    .pipe($.istanbul({ // Covering filecs
          instrumenter: isparta.Instrumenter,
          includeUntested: true }))
    .pipe($.istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', () => {
      gulp.src(['./tests/**/*.spec.js'], {read: false})
        .pipe($.mocha({
              reporter: 'spec',
              globals: ["sinon", "chai", "expect"],
              require: ['./tests/test-helper.js'] }))
        .pipe($.istanbul.writeReports());
    });
});

// Build
gulp.task('build', ['clean'], function (callback) {
    return gulp.src('./src/main.js')
      .pipe($.babel()) //this will also handle react transformations
      .pipe(gulp.dest('./dist'));
});
