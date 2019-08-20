var del = require('del');
var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');
var webpack = require('webpack');
var webpackConfig = require("./webpack.config.js");
// require("@babel/register");

// Load all of our Gulp plugins
var $ = loadPlugins();

// Clean up
gulp.task('clean', function(done){
  del.sync(['./dist','./dist.zip']);
  done();
});

// Lint
gulp.task('lint', function(done) {
  done();

  return gulp.src('./src/main.js')
    .pipe($.plumber())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());  
});

// Test
gulp.task('test', gulp.series('lint', function(done) {
  done();

  return gulp.src(['./tests/**/*.spec.js'], {read: false})
  .pipe($.mocha({
    reporter: 'spec',
    globals: ["sinon", "chai", "expect", "enzyme"],
    require: ['./tests/test-helper.js'],
    compilers: ['js:@babel/register']
  }));
}));

// Live Test Watching
gulp.task('test-watch', gulp.series('lint', 'test', function(done) {
  gulp.watch(['./tests/**/*.spec.js', './src/main.js'], gulp.series('lint', 'test'));

  done();
}));

// Build
gulp.task('build', gulp.series('lint', 'clean', function(done) {
  done();

  return gulp.src('./src/main.js')
    .pipe($.babel()) //this will also handle react transformations
    .pipe(gulp.dest('./dist'));
}));

// Build the example into 'docs' so we can ghpages it
gulp.task('build-example', gulp.series('build', function(done) {
  del.sync('./docs');

  webpack(webpackConfig, function(err, stats) {
    if(err) throw new Error("webpack", err);

    console.log('webpack build done...');

    gulp.src('./src/examples/dist/bundle.js')
      .pipe(gulp.dest('./docs/dist'));

    gulp.src('./dist/main.js')
      .pipe(gulp.dest('./docs'));

    gulp.src('./src/examples/index.html')
      .pipe(gulp.dest('./docs/'));
  });

  done();
}));
