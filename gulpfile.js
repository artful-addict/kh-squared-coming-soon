//// Variables

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

//// Task Runner

gulp.task('sass', function() {
  return gulp.src('build/scss/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.watch('build/scss/**/*.scss', ['sass']);

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  })
})

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('build/scss/styles.scss', ['sass']);
  gulp.watch('build/*.html', browserSync.reload);
  gulp.watch('build/behaviors/**/*.js', browserSync.reload);
});

gulp.task('useref', function(){
  return gulp.src('build/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('build/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function(){
  return gulp.src('build/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function(){
  return del.sync('dist');
});

gulp.task('build', ['sass', 'browserSync']);